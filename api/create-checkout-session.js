import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {

    const { hash, language } = req.body

    const session = await stripe.checkout.sessions.create({

      payment_method_types: ["card"],

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

      mode: "payment",

      metadata: {
        hash: hash,
        language: language || "en"
      },

      success_url: `${process.env.BASE_URL}/success?hash=${hash}`,
      cancel_url: `${process.env.BASE_URL}`

    })

    res.status(200).json({ url: session.url })

  } catch (error) {

    console.error(error)

    res.status(500).json({ error: "Stripe session error" })

  }

}