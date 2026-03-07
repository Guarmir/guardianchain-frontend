import Stripe from "stripe"
import sendEmail from "./send-email.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req, res) {

  const sig = req.headers["stripe-signature"]

  let event

  try {

    const chunks = []

    for await (const chunk of req) {
      chunks.push(chunk)
    }

    const rawBody = Buffer.concat(chunks)

    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )

  } catch (err) {

    console.error(err.message)

    return res.status(400).send(`Webhook Error: ${err.message}`)

  }

  if (event.type === "checkout.session.completed") {

    const session = event.data.object

    const hash = session.metadata.hash
    const language = session.metadata.language || "en"
    const email = session.customer_details.email

    try {

      await sendEmail({
        hash,
        language,
        email
      })

    } catch (error) {

      console.error("Email error:", error)

    }

  }

  res.status(200).json({ received: true })

}