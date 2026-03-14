import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {

    const { hash, language, fileName } = req.body

    if (!hash) {
      return res.status(400).json({ error: "Hash not provided" })
    }

    const lang = language === "pt" ? "pt" : "en"

    const baseUrl =
      process.env.BASE_URL ||
      process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}` ||
      "http://localhost:5173"

    const session = await stripe.checkout.sessions.create({

      payment_method_types: ["card"],

      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "GuardianChain Digital Proof Certificate",
            },
            unit_amount: 900,
          },
          quantity: 1,
        },
      ],

      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&lang=${lang}`,

      cancel_url: `${baseUrl}/register?lang=${lang}`,

      metadata: {
        hash,
        fileName: fileName || "",
        language: lang,
      },

    })

    res.status(200).json({
      id: session.id,
      url: session.url
    })

  } catch (error) {

    console.error("Stripe session error:", error)

    res.status(500).json({
      error: "Failed to create checkout session"
    })

  }

}