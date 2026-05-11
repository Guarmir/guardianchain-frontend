import Stripe from "stripe"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    if (!stripe) {
      console.error("STRIPE_SECRET_KEY is missing")
      return res.status(500).json({
        error: "STRIPE_SECRET_KEY is missing on the server"
      })
    }

    const {
      hash,
      fileName,
      language,
      ownerName,
      ownerEmail,
      ownerType,
      ownershipDeclaration
    } = req.body || {}

    if (!hash || !fileName || !ownerName || !ownerEmail || !ownershipDeclaration) {
      return res.status(400).json({
        error: "Missing required certificate data",
        received: {
          hasHash: Boolean(hash),
          hasFileName: Boolean(fileName),
          hasOwnerName: Boolean(ownerName),
          hasOwnerEmail: Boolean(ownerEmail),
          hasOwnershipDeclaration: Boolean(ownershipDeclaration)
        }
      })
    }

    const normalizedLanguage = language === "pt" ? "pt" : "en"
    const baseUrl = process.env.BASE_URL || "http://localhost:3000"

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card", "pix"],

      payment_method_options: {
        pix: {
          expires_after_seconds: 3600
        }
      },

      customer_email: ownerEmail,
      locale: normalizedLanguage === "pt" ? "pt-BR" : "en",

      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/register?lang=${normalizedLanguage}`,

      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name:
                normalizedLanguage === "pt"
                  ? "Certificado GuardianChain"
                  : "GuardianChain Certificate",
              description:
                normalizedLanguage === "pt"
                  ? "Registro de prova digital verificável em blockchain"
                  : "Verifiable digital proof registration on blockchain"
            },
            unit_amount: 4900
          },
          quantity: 1
        }
      ],

      metadata: {
        hash,
        fileName,
        language: normalizedLanguage,
        ownerName,
        ownerEmail,
        ownerType: ownerType || "individual",
        ownershipDeclaration: "accepted",
        declarationVersion: "1.0",
        certificateType: "declared_owner",
        product: "guardianchain_certificate"
      }
    })

    return res.status(200).json({ url: session.url })
  } catch (error) {
    console.error("Checkout error full:", {
      message: error.message,
      type: error.type,
      code: error.code,
      param: error.param,
      raw: error.raw
    })

    return res.status(500).json({
      error: error.message || "Failed to create checkout session",
      type: error.type || null,
      code: error.code || null,
      param: error.param || null
    })
  }
}