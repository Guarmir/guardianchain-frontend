import Stripe from "stripe"

import {
  DEFAULT_CHECKOUT_PRODUCT_ID,
  getCheckoutProductById,
} from "./lib/product-catalog.js"

const stripeSecretKey =
  process.env.STRIPE_SECRET_KEY

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey)
  : null

const HASH_ALGORITHM = "sha-256"
const HASH_VERSION = "1"

function isValidSha256Hash(hash) {
  return /^0x[a-fA-F0-9]{64}$/.test(
    String(hash || ""),
  )
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    })
  }

  try {
    if (!stripe) {
      return res.status(500).json({
        error:
          "STRIPE_SECRET_KEY is missing on the server",
      })
    }

    const {
      hash,
      fileName,
      language,
      ownerName,
      ownerEmail,
      ownerType,
      ownershipDeclaration,
      productId,
    } = req.body || {}

    if (
      !hash ||
      !fileName ||
      !ownerName ||
      !ownerEmail ||
      !ownershipDeclaration
    ) {
      return res.status(400).json({
        error:
          "Missing required certificate data",
      })
    }

    if (!isValidSha256Hash(hash)) {
      return res.status(400).json({
        error: "Invalid SHA-256 hash format",
      })
    }

    const normalizedLanguage =
      language === "pt" ? "pt" : "en"

    const normalizedProductId =
      productId || DEFAULT_CHECKOUT_PRODUCT_ID

    const selectedProduct =
      getCheckoutProductById(
        normalizedProductId,
        normalizedLanguage,
      )

    if (!selectedProduct) {
      return res.status(400).json({
        error:
          "Selected product is unavailable",
      })
    }

    const baseUrl =
      process.env.BASE_URL ||
      "https://guardianchain.online"

    const isPt =
      normalizedLanguage === "pt"

    const successUrl =
      `${baseUrl}/success` +
      `?session_id={CHECKOUT_SESSION_ID}` +
      `&lang=${normalizedLanguage}`

    const cancelUrl =
      `${baseUrl}/register` +
      `?lang=${normalizedLanguage}` +
      `&product=${encodeURIComponent(
        selectedProduct.id,
      )}`

    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        payment_method_types: ["card"],

        customer_email: ownerEmail,

        locale: isPt ? "pt-BR" : "en",

        success_url: successUrl,

        cancel_url: cancelUrl,

        line_items: [
          {
            price_data: {
              currency:
                selectedProduct.currency,

              product_data: {
                name:
                  selectedProduct.name,

                description:
                  selectedProduct.description,
              },

              unit_amount:
                selectedProduct.unitAmount,
            },

            quantity: 1,
          },
        ],

        metadata: {
          hash,
          hashAlgorithm: HASH_ALGORITHM,
          hashVersion: HASH_VERSION,

          fileName,
          language: normalizedLanguage,

          ownerName,
          ownerEmail,

          ownerType:
            ownerType || "individual",

          ownershipDeclaration: "accepted",
          declarationVersion: "1.0",

          certificateType:
            "declared_owner",

          productId:
            selectedProduct.id,

          productType:
            selectedProduct.type,

          productCredits:
            String(selectedProduct.credits),

          currency:
            selectedProduct.currency.toUpperCase(),

          price:
            (
              selectedProduct.unitAmount / 100
            ).toFixed(2),
        },
      })

    return res.status(200).json({
      url: session.url,
    })
  } catch (error) {
    console.error(
      "Checkout error full:",
      error,
    )

    return res.status(500).json({
      error:
        error.message ||
        "Failed to create checkout session",
    })
  }
}