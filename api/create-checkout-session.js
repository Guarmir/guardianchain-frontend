import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {

    const { hash } = req.body

    if (!hash) {
      return res.status(400).json({ error: "Hash missing" })
    }

    const languageHeader = req.headers["accept-language"] || "en"

    const language = languageHeader.startsWith("pt")
      ? "pt"
      : "en"

    const session = await stripe.checkout.sessions.create({

      payment_method_types: ["card"],

      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "GuardianChain Digital Proof"
            },
            unit_amount: 900
          },
          quantity: 1
        }
      ],

      success_url: `https://guardianchain.online/success?hash=${hash}`,

      cancel_url: `https://guardianchain.online`,

      metadata: {
        hash: hash,
        language: language
      }

    })

    res.status(200).json({ id: session.id })

  } catch (error) {

    console.error(error)

    res.status(500).json({ error: "Stripe error" })

  }

}