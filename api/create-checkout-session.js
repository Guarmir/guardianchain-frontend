import Stripe from "stripe"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    if (!stripe) {
      return res.status(500).json({
        error: "STRIPE_SECRET_KEY is missing on the server",
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
    } = req.body || {}

    if (!hash || !fileName || !ownerName || !ownerEmail || !ownershipDeclaration) {
      return res.status(400).json({
        error: "Missing required certificate data",
      })
    }

    const normalizedLanguage = language === "pt" ? "pt" : "en"
    const baseUrl = process.env.BASE_URL || "https://guardianchain.online"
    const isPt = normalizedLanguage === "pt"

    const currency = isPt ? "brl" : "usd"
    const unitAmount = isPt ? 1990 : 800

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: ownerEmail,
      locale: isPt ? "pt-BR" : "en",

      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&lang=${normalizedLanguage}`,
      cancel_url: `${baseUrl}/register?lang=${normalizedLanguage}`,

      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: isPt
                ? "Certificado GuardianChain"
                : "GuardianChain Certificate",
              description: isPt
                ? "Registro de prova digital verificável em blockchain"
                : "Verifiable digital proof registration on blockchain",
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
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
        product: "guardianchain_certificate",
        currency,
        price: isPt ? "19.90 BRL" : "8.00 USD",
      },
    })

    return res.status(200).json({ url: session.url })
  } catch (error) {
    console.error("Checkout error full:", error)

    return res.status(500).json({
      error: error.message || "Failed to create checkout session",
    })
  }
}