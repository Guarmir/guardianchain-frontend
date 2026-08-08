import Stripe from "stripe"

import sendEmail from "./send-certificate.js"

import {
  generateEvidenceKey,
} from "./lib/evidence-key.js"

import {
  DEFAULT_CHECKOUT_PRODUCT_ID,
  getProductCatalogEntryById,
} from "./lib/product-catalog.js"

import {
  syncCustomerAccount,
} from "./lib/admin/admin-customer-sync-repository.js"

import {
  preparePaidCheckoutOrder,
} from "./lib/admin/admin-order-fulfillment-repository.js"

import {
  markCertificateDeliveryFailed,
  markCertificateDeliverySent,
  prepareCertificateFulfillment,
} from "./lib/admin/admin-certificate-fulfillment-repository.js"

export const config = {
  api: {
    bodyParser: false,
  },
}

const stripeSecretKey =
  process.env.STRIPE_SECRET_KEY

const stripe =
  stripeSecretKey
    ? new Stripe(
        stripeSecretKey,
      )
    : null

function isLocalEnvironment() {
  return (
    process.env.BASE_URL
      ?.includes(
        "localhost",
      ) ||
    process.env.VERCEL_ENV ===
      "development" ||
    process.env.NODE_ENV !==
      "production"
  )
}

function requestBodyValueToBuffer(
  value,
) {
  if (
    value === undefined ||
    value === null
  ) {
    return null
  }

  if (
    Buffer.isBuffer(value)
  ) {
    return value
  }

  if (
    value instanceof Uint8Array
  ) {
    return Buffer.from(value)
  }

  if (
    typeof value === "string"
  ) {
    return Buffer.from(
      value,
      "utf8",
    )
  }

  if (
    typeof value === "object"
  ) {
    return Buffer.from(
      JSON.stringify(value),
      "utf8",
    )
  }

  return Buffer.from(
    String(value),
    "utf8",
  )
}

async function getRequestBody(
  request,
  {
    allowParsedBodyFallback = false,
  } = {},
) {
  const chunks = []
  let streamError = null

  try {
    for await (
      const chunk of request
    ) {
      chunks.push(
        typeof chunk === "string"
          ? Buffer.from(
              chunk,
              "utf8",
            )
          : Buffer.from(
              chunk,
            ),
      )
    }
  } catch (error) {
    streamError =
      error
  }

  if (
    chunks.length > 0
  ) {
    const rawBuffer =
      Buffer.concat(chunks)

    return {
      rawBuffer,

      rawText:
        rawBuffer.toString(
          "utf8",
        ),

      source:
        "request_stream",
    }
  }

  if (
    allowParsedBodyFallback
  ) {
    const fallbackBuffer =
      requestBodyValueToBuffer(
        request.body,
      )

    if (
      fallbackBuffer &&
      fallbackBuffer.length > 0
    ) {
      return {
        rawBuffer:
          fallbackBuffer,

        rawText:
          fallbackBuffer.toString(
            "utf8",
          ),

        source:
          "request_body_fallback",
      }
    }
  }

  if (streamError) {
    throw streamError
  }

  return {
    rawBuffer:
      Buffer.alloc(0),

    rawText:
      "",

    source:
      "empty",
  }
}

function normalizeStripeReference(
  value,
) {
  if (
    typeof value === "string"
  ) {
    return value
  }

  if (
    value &&
    typeof value === "object"
  ) {
    return value.id || ""
  }

  return ""
}

function toPositiveInteger(
  value,
  fallback,
) {
  const number =
    Number.parseInt(
      String(value || ""),
      10,
    )

  return (
    Number.isInteger(number) &&
    number > 0
      ? number
      : fallback
  )
}

function unixSecondsToIso(
  value,
) {
  const seconds =
    Number(value)

  if (
    !Number.isFinite(seconds) ||
    seconds <= 0
  ) {
    return new Date()
      .toISOString()
  }

  return new Date(
    seconds * 1000,
  ).toISOString()
}

function validateCheckoutProduct({
  catalogProduct,
  metadataProductType,
  metadataCredits,
  amountTotal,
  currency,
}) {
  if (!catalogProduct) {
    throw new Error(
      "The Stripe checkout product is not present in the server catalog",
    )
  }

  const expectedCurrency =
    catalogProduct.currency
      .toUpperCase()

  const matches =
    catalogProduct.type ===
      metadataProductType &&
    catalogProduct.credits ===
      metadataCredits &&
    catalogProduct.unitAmount ===
      amountTotal &&
    expectedCurrency ===
      currency

  if (!matches) {
    throw new Error(
      "Stripe checkout data does not match the server product catalog",
    )
  }
}

export default async function handler(
  request,
  response,
) {
  if (
    request.method !== "POST"
  ) {
    return response
      .status(405)
      .send(
        "Method not allowed",
      )
  }

  if (!stripe) {
    console.error(
      "[WEBHOOK] Missing STRIPE_SECRET_KEY",
    )

    return response
      .status(500)
      .json({
        error:
          "Server configuration error",
      })
  }

  try {
    const isLocal =
      isLocalEnvironment()

    const {
      rawBuffer,
      rawText,
      source:
        bodySource,
    } =
      await getRequestBody(
        request,
        {
          allowParsedBodyFallback:
            isLocal,
        },
      )

    let event

    if (isLocal) {
      if (!rawText) {
        console.warn(
          "[WEBHOOK] Local event body is empty",
          {
            source:
              bodySource,

            bytes:
              rawBuffer.length,
          },
        )

        return response
          .status(200)
          .json({
            received: true,

            skipped:
              "empty_body_local_event",
          })
      }

      event =
        JSON.parse(
          rawText,
        )

      console.log(
        "[WEBHOOK] Local mode: signature verification skipped",
        {
          bodySource,

          bodyBytes:
            rawBuffer.length,

          eventType:
            event?.type ||
            null,
        },
      )
    } else {
      const signature =
        request.headers[
          "stripe-signature"
        ]

      if (!signature) {
        throw new Error(
          "Missing Stripe signature",
        )
      }

      if (
        !process.env
          .STRIPE_WEBHOOK_SECRET
      ) {
        throw new Error(
          "Missing STRIPE_WEBHOOK_SECRET",
        )
      }

      event =
        stripe.webhooks
          .constructEvent(
            rawBuffer,
            signature,
            process.env
              .STRIPE_WEBHOOK_SECRET,
          )
    }

    if (
      event.type !==
      "checkout.session.completed"
    ) {
      return response
        .status(200)
        .json({
          received: true,

          ignored:
            event.type,
        })
    }

    const session =
      event.data.object

    const metadata =
      session.metadata || {}

    if (
      session.payment_status !==
      "paid"
    ) {
      return response
        .status(200)
        .json({
          received: true,

          skipped:
            "payment_not_paid",
        })
    }

    const hash =
      metadata.hash

    const fileName =
      metadata.fileName ||
      "registered-file"

    const language =
      metadata.language === "pt"
        ? "pt"
        : "en"

    const ownerName =
      metadata.ownerName ||
      "Declared holder"

    const ownerEmail =
      metadata.ownerEmail ||
      session
        .customer_details
        ?.email ||
      session.customer_email

    const ownerType =
      metadata.ownerType ===
      "company"
        ? "company"
        : "individual"

    const checkoutSessionId =
      normalizeStripeReference(
        session.id,
      )

    const paymentIntentId =
      normalizeStripeReference(
        session.payment_intent,
      )

    const paymentId =
      paymentIntentId ||
      checkoutSessionId

    const productId =
      metadata.productId ||
      DEFAULT_CHECKOUT_PRODUCT_ID

    const catalogProduct =
      getProductCatalogEntryById(
        productId,
        language,
      )

    const productType =
      metadata.productType ===
        "package"
        ? "package"
        : "single"

    const creditsPurchased =
      toPositiveInteger(
        metadata.productCredits,
        catalogProduct
          ?.credits ||
          1,
      )

    const amountTotal =
      Number(
        session.amount_total,
      )

    const currency =
      String(
        session.currency ||
        metadata.currency ||
        "",
      )
        .trim()
        .toUpperCase()

    const issuedAt =
      session.created ||
      null

    const paidAt =
      unixSecondsToIso(
        event.created ||
        session.created,
      )

    const hashAlgorithm =
      String(
        metadata.hashAlgorithm ||
        "sha-256",
      )
        .trim()
        .toLowerCase()

    const hashVersion =
      String(
        metadata.hashVersion ||
        "1",
      ).trim()

    if (
      !hash ||
      !ownerEmail ||
      !checkoutSessionId
    ) {
      console.error(
        "[WEBHOOK] Missing required checkout data",
        {
          hashPresent:
            Boolean(hash),

          ownerEmailPresent:
            Boolean(
              ownerEmail,
            ),

          checkoutSessionPresent:
            Boolean(
              checkoutSessionId,
            ),
        },
      )

      return response
        .status(200)
        .json({
          received: true,

          skipped:
            "missing_required_checkout_data",
        })
    }

    if (
      !Number.isInteger(
        amountTotal,
      ) ||
      amountTotal < 0
    ) {
      throw new Error(
        "Stripe checkout amount is invalid",
      )
    }

    validateCheckoutProduct({
      catalogProduct,

      metadataProductType:
        productType,

      metadataCredits:
        creditsPurchased,

      amountTotal,
      currency,
    })

    const customer =
      await syncCustomerAccount({
        email:
          ownerEmail,

        name:
          ownerName,

        ownerType,
      })

    const orderProcessing =
      await preparePaidCheckoutOrder({
        customerId:
          customer.id,

        checkoutSessionId,

        paymentIntentId:
          paymentIntentId ||
          null,

        productId:
          catalogProduct.id,

        productType:
          catalogProduct.type,

        creditsPurchased:
          catalogProduct.credits,

        amountTotal:
          catalogProduct
            .unitAmount,

        currency:
          catalogProduct
            .currency,

        paidAt,

        productSnapshot: {
          catalogVersion:
            catalogProduct
              .catalogVersion,

          name:
            catalogProduct.name,

          description:
            catalogProduct
              .description,

          source:
            "stripe_checkout_metadata",
        },
      })

    console.log(
      "[WEBHOOK] Paid order synchronized",
      {
        orderId:
          orderProcessing
            .order
            .id,

        customerId:
          customer.id,

        productId:
          catalogProduct.id,

        orderCreated:
          orderProcessing
            .orderCreated,

        creditsGrantedNow:
          orderProcessing
            .creditsGrantedNow,

        currentBalance:
          orderProcessing
            .creditAccount
            .balance,
      },
    )

    const proposedEvidenceKey =
      generateEvidenceKey({
        paymentId:
          paymentId ||
          `HASH-${hash}`,

        fileHash:
          hash,

        language,

        issuedAt,
      })

    const certificateProcessing =
      await prepareCertificateFulfillment({
        customerId:
          customer.id,

        orderId:
          orderProcessing
            .order
            .id,

        fileHash:
          hash,

        fileName,

        evidenceKey:
          proposedEvidenceKey,

        hashAlgorithm,
        hashVersion,
      })

    const certificate =
      certificateProcessing
        .certificate

    console.log(
      "[WEBHOOK] Certificate synchronized",
      {
        certificateId:
          certificate.id,

        orderId:
          orderProcessing
            .order
            .id,

        evidenceKey:
          certificate
            .evidenceKey,

        certificateCreatedNow:
          certificateProcessing
            .certificateCreatedNow,

        creditConsumedNow:
          certificateProcessing
            .creditConsumedNow,

        deliveryStatus:
          certificate
            .deliveryStatus,
      },
    )

    if (
      !certificateProcessing
        .shouldSendEmail
    ) {
      console.log(
        "[WEBHOOK] Certificate already delivered. Duplicate delivery skipped.",
        {
          certificateId:
            certificate.id,

          checkoutSessionId,
        },
      )

      return response
        .status(200)
        .json({
          received: true,

          customerSynchronized:
            true,

          orderSynchronized:
            true,

          certificateSynchronized:
            true,

          creditsGranted:
            orderProcessing
              .creditsGrantedNow,

          creditConsumed:
            certificateProcessing
              .creditConsumedNow,

          emailSent:
            false,

          duplicateDeliverySkipped:
            true,
        })
    }

    try {
      await sendEmail({
        hash,
        language,

        email:
          customer.email,

        fileName,
        ownerName,

        ownerEmail:
          customer.email,

        ownerType,
        paymentId,
        issuedAt,

        evidenceKey:
          certificate
            .evidenceKey,
      })

      await markCertificateDeliverySent({
        certificateId:
          certificate.id,
      })
    } catch (deliveryError) {
      try {
        await markCertificateDeliveryFailed({
          certificateId:
            certificate.id,

          errorMessage:
            deliveryError
              ?.message ||
            "Certificate delivery failed",
        })
      } catch (
        deliveryStatusError
      ) {
        console.error(
          "[WEBHOOK] Failed to record certificate delivery error:",
          {
            certificateId:
              certificate.id,

            message:
              deliveryStatusError
                ?.message,
          },
        )
      }

      throw deliveryError
    }

    console.log(
      "[WEBHOOK] Certificate delivery completed",
      {
        certificateId:
          certificate.id,

        customerId:
          customer.id,

        evidenceKey:
          certificate
            .evidenceKey,

        checkoutSessionId,
      },
    )

    return response
      .status(200)
      .json({
        received: true,

        customerSynchronized:
          true,

        orderSynchronized:
          true,

        certificateSynchronized:
          true,

        creditsGranted:
          orderProcessing
            .creditsGrantedNow,

        creditConsumed:
          certificateProcessing
            .creditConsumedNow,

        emailSent:
          true,

        duplicateDeliverySkipped:
          false,
      })
  } catch (error) {
    console.error(
      "[WEBHOOK] Error:",
      {
        name:
          error?.name,

        message:
          error?.message,
      },
    )

    return response
      .status(500)
      .json({
        error:
          error?.message ||
          "Webhook processing failed",
      })
  }
}