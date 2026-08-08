import {
  getDatabaseClient,
} from "../api/lib/db.js"

import {
  syncCustomerAccount,
} from "../api/lib/admin/admin-customer-sync-repository.js"

import {
  preparePaidCheckoutOrder,
} from "../api/lib/admin/admin-order-fulfillment-repository.js"

import {
  markCertificateDeliverySent,
  prepareCertificateFulfillment,
} from "../api/lib/admin/admin-certificate-fulfillment-repository.js"

const TEST_EMAIL =
  "guardianchain-certificate-fulfillment-test@example.invalid"

const TEST_CHECKOUT_SESSION_ID =
  "cs_test_gc_certificate_fulfillment"

const TEST_PAYMENT_INTENT_ID =
  "pi_test_gc_certificate_fulfillment"

const TEST_HASH =
  `0x${"a".repeat(64)}`

const FIRST_EVIDENCE_KEY =
  "GC-TEST-CERTIFICATE-FULFILLMENT-0001"

const SECOND_EVIDENCE_KEY =
  "GC-TEST-CERTIFICATE-FULFILLMENT-0002"

async function removeTestRecords() {
  const sql =
    getDatabaseClient()

  await sql`
    DELETE FROM gc_certificates

    WHERE source_order_id IN (
      SELECT id

      FROM gc_orders

      WHERE
        stripe_checkout_session_id =
          ${TEST_CHECKOUT_SESSION_ID}
    )
  `

  await sql`
    DELETE FROM gc_credit_ledger

    WHERE order_id IN (
      SELECT id

      FROM gc_orders

      WHERE
        stripe_checkout_session_id =
          ${TEST_CHECKOUT_SESSION_ID}
    )
  `

  await sql`
    DELETE FROM gc_orders

    WHERE
      stripe_checkout_session_id =
        ${TEST_CHECKOUT_SESSION_ID}
  `

  await sql`
    DELETE FROM gc_credit_accounts

    WHERE customer_id IN (
      SELECT id

      FROM gc_customers

      WHERE
        LOWER(email) =
        LOWER(${TEST_EMAIL})
    )
  `

  await sql`
    DELETE FROM gc_customers

    WHERE
      LOWER(email) =
      LOWER(${TEST_EMAIL})
  `
}

async function readTestCounts() {
  const sql =
    getDatabaseClient()

  const rows =
    await sql`
      SELECT
        (
          SELECT COUNT(*)::INTEGER

          FROM gc_certificates
            AS certificate

          INNER JOIN gc_orders
            AS order_record
            ON order_record.id =
              certificate
                .source_order_id

          WHERE
            order_record
              .stripe_checkout_session_id =
              ${TEST_CHECKOUT_SESSION_ID}
        ) AS certificates,

        (
          SELECT COUNT(*)::INTEGER

          FROM gc_credit_ledger
            AS ledger

          INNER JOIN gc_orders
            AS order_record
            ON order_record.id =
              ledger.order_id

          WHERE
            order_record
              .stripe_checkout_session_id =
              ${TEST_CHECKOUT_SESSION_ID}

            AND ledger.operation_type =
              'certificate_consumption'
        ) AS consumptions
    `

  return rows[0]
}

function validateFirstFulfillment(
  result,
) {
  if (
    !result.certificateCreatedNow
  ) {
    throw new Error(
      "The first fulfillment did not create a certificate",
    )
  }

  if (
    !result.creditConsumedNow
  ) {
    throw new Error(
      "The first fulfillment did not consume a credit",
    )
  }

  if (
    result.certificate
      .evidenceKey !==
    FIRST_EVIDENCE_KEY
  ) {
    throw new Error(
      "The persisted Evidence Key is incorrect",
    )
  }

  if (
    result.creditAccount.balance !== 0
  ) {
    throw new Error(
      "The credit balance should be zero after consumption",
    )
  }

  if (
    result.creditAccount.totalUsed !== 1
  ) {
    throw new Error(
      "The used credit total should be one",
    )
  }

  if (
    result.order
      .fulfillmentStatus !==
    "consumed"
  ) {
    throw new Error(
      "The single-certificate order should be consumed",
    )
  }

  if (
    !result.shouldSendEmail
  ) {
    throw new Error(
      "A new certificate should require email delivery",
    )
  }
}

function validateRepeatedFulfillment(
  firstResult,
  repeatedResult,
) {
  if (
    repeatedResult
      .certificateCreatedNow
  ) {
    throw new Error(
      "Repeated fulfillment created another certificate",
    )
  }

  if (
    repeatedResult
      .creditConsumedNow
  ) {
    throw new Error(
      "Repeated fulfillment consumed another credit",
    )
  }

  if (
    repeatedResult
      .certificate
      .id !==
    firstResult
      .certificate
      .id
  ) {
    throw new Error(
      "Repeated fulfillment returned another certificate",
    )
  }

  if (
    repeatedResult
      .certificate
      .evidenceKey !==
    FIRST_EVIDENCE_KEY
  ) {
    throw new Error(
      "Repeated fulfillment replaced the persisted Evidence Key",
    )
  }

  if (
    repeatedResult
      .creditAccount
      .balance !== 0
  ) {
    throw new Error(
      "Repeated fulfillment changed the credit balance",
    )
  }
}

async function runCheck() {
  console.log(
    "[CERTIFICATE FULFILLMENT CHECK] Preparing isolated test...",
  )

  await removeTestRecords()

  try {
    const customer =
      await syncCustomerAccount({
        email:
          TEST_EMAIL,

        name:
          "GuardianChain Certificate Test",

        ownerType:
          "individual",
      })

    const order =
      await preparePaidCheckoutOrder({
        customerId:
          customer.id,

        checkoutSessionId:
          TEST_CHECKOUT_SESSION_ID,

        paymentIntentId:
          TEST_PAYMENT_INTENT_ID,

        productId:
          "single-certificate",

        productType:
          "single",

        creditsPurchased:
          1,

        amountTotal:
          800,

        currency:
          "USD",

        paidAt:
          new Date().toISOString(),

        productSnapshot: {
          source:
            "certificate_fulfillment_test",

          catalogVersion:
            "1.1",
        },
      })

    if (
      order.creditAccount.balance !== 1
    ) {
      throw new Error(
        "The paid order should grant one credit",
      )
    }

    console.log(
      "[CERTIFICATE FULFILLMENT CHECK] Paid order prepared:",
      {
        orderId:
          order.order.id,

        balance:
          order.creditAccount.balance,
      },
    )

    const firstResult =
      await prepareCertificateFulfillment({
        customerId:
          customer.id,

        orderId:
          order.order.id,

        fileHash:
          TEST_HASH,

        fileName:
          "guardianchain-test-file.pdf",

        evidenceKey:
          FIRST_EVIDENCE_KEY,

        hashAlgorithm:
          "sha-256",

        hashVersion:
          "1",
      })

    validateFirstFulfillment(
      firstResult,
    )

    console.log(
      "[CERTIFICATE FULFILLMENT CHECK] First certificate confirmed:",
      {
        certificateId:
          firstResult
            .certificate
            .id,

        evidenceKey:
          firstResult
            .certificate
            .evidenceKey,

        balance:
          firstResult
            .creditAccount
            .balance,

        orderStatus:
          firstResult
            .order
            .fulfillmentStatus,
      },
    )

    const repeatedResult =
      await prepareCertificateFulfillment({
        customerId:
          customer.id,

        orderId:
          order.order.id,

        fileHash:
          TEST_HASH,

        fileName:
          "guardianchain-test-file.pdf",

        evidenceKey:
          SECOND_EVIDENCE_KEY,

        hashAlgorithm:
          "sha-256",

        hashVersion:
          "1",
      })

    validateRepeatedFulfillment(
      firstResult,
      repeatedResult,
    )

    console.log(
      "[CERTIFICATE FULFILLMENT CHECK] Idempotency confirmed.",
    )

    const delivery =
      await markCertificateDeliverySent({
        certificateId:
          firstResult
            .certificate
            .id,
      })

    if (
      delivery.deliveryStatus !==
      "sent"
    ) {
      throw new Error(
        "The certificate delivery status should be sent",
      )
    }

    const deliveredResult =
      await prepareCertificateFulfillment({
        customerId:
          customer.id,

        orderId:
          order.order.id,

        fileHash:
          TEST_HASH,

        fileName:
          "guardianchain-test-file.pdf",

        evidenceKey:
          SECOND_EVIDENCE_KEY,
      })

    if (
      deliveredResult.shouldSendEmail
    ) {
      throw new Error(
        "A delivered certificate should not request another email",
      )
    }

    const counts =
      await readTestCounts()

    if (
      Number(
        counts.certificates,
      ) !== 1
    ) {
      throw new Error(
        "Expected exactly one certificate",
      )
    }

    if (
      Number(
        counts.consumptions,
      ) !== 1
    ) {
      throw new Error(
        "Expected exactly one credit consumption",
      )
    }

    console.log(
      "[CERTIFICATE FULFILLMENT CHECK] Database records confirmed:",
      {
        certificates:
          counts.certificates,

        consumptions:
          counts.consumptions,

        deliveryStatus:
          deliveredResult
            .certificate
            .deliveryStatus,
      },
    )

    console.log(
      "[CERTIFICATE FULFILLMENT CHECK] Validation completed successfully.",
    )
  } finally {
    await removeTestRecords()

    console.log(
      "[CERTIFICATE FULFILLMENT CHECK] Test records removed.",
    )
  }
}

runCheck().catch(
  (error) => {
    console.error(
      "[CERTIFICATE FULFILLMENT CHECK] Validation failed:",
      {
        name:
          error?.name,

        message:
          error?.message,
      },
    )

    process.exitCode = 1
  },
)