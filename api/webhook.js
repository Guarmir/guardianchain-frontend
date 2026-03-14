import Stripe from "stripe"
import sendEmail from "./send-certificate.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const config = {
  api: {
    bodyParser: false,
  },
}

async function getRawBody(req) {
  return await new Promise((resolve, reject) => {
    const chunks = []

    req.on("data", (chunk) => chunks.push(chunk))
    req.on("end", () => resolve(Buffer.concat(chunks)))
    req.on("error", (err) => reject(err))
  })
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const sig = req.headers["stripe-signature"]

  if (!sig) {
    console.error("[STRIPE WEBHOOK] Missing stripe-signature header")
    return res.status(400).send("Missing stripe-signature header")
  }

  let buf

  try {
    buf = await getRawBody(req)
  } catch (err) {
    console.error("[STRIPE WEBHOOK] Error reading request body:", err)
    return res.status(400).send("Invalid request body")
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error("[STRIPE WEBHOOK] Signature verification failed:", err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object

    const hash = session.metadata?.hash || null
    const language = session.metadata?.language === "pt" ? "pt" : "en"
    const fileName = session.metadata?.fileName || ""

    const email =
      session.customer_details?.email ||
      session.customer_email ||
      session.metadata?.email ||
      null

    console.log("[STRIPE WEBHOOK] Session completed:", {
      hash,
      language,
      fileName,
      email,
    })

    if (!hash || !email) {
      console.error("[STRIPE WEBHOOK] Missing required data:", {
        hash,
        email,
      })

      return res.status(200).json({ received: true })
    }

    try {
      await sendEmail({
        hash,
        language,
        email,
        fileName,
      })

      console.log("[STRIPE WEBHOOK] Certificate sent successfully to:", email)
    } catch (err) {
      console.error("[STRIPE WEBHOOK] Error sending certificate email:", err)
    }
  }

  return res.status(200).json({ received: true })
}