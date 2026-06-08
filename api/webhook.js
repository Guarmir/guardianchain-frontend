import Stripe from "stripe"
import sendEmail from "./send-certificate.js"

export const config = {
  api: {
    bodyParser: false,
  },
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

async function getRequestBody(req) {
  const chunks = []

  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk)
  }

  const rawBuffer = Buffer.concat(chunks)

  return {
    rawBuffer,
    rawText: rawBuffer.toString("utf8"),
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed")
  }

  try {
    const { rawBuffer, rawText } = await getRequestBody(req)

    const isLocal =
      process.env.BASE_URL?.includes("localhost") ||
      process.env.VERCEL_ENV === "development" ||
      process.env.NODE_ENV !== "production"

    let event

    if (isLocal) {
      if (!rawText) {
        return res.status(200).json({
          received: true,
          skipped: "empty_body_local_event",
        })
      }

      event = JSON.parse(rawText)
      console.log("[WEBHOOK] Local mode: signature verification skipped")
    } else {
      const signature = req.headers["stripe-signature"]

      event = stripe.webhooks.constructEvent(
        rawBuffer,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    }

    if (event.type !== "checkout.session.completed") {
      return res.status(200).json({
        received: true,
        ignored: event.type,
      })
    }

    const session = event.data.object
    const metadata = session.metadata || {}

    const hash = metadata.hash
    const fileName = metadata.fileName || "registered-file"
    const language = metadata.language === "pt" ? "pt" : "en"
    const ownerName = metadata.ownerName || "Declared holder"

    const ownerEmail =
      metadata.ownerEmail ||
      session.customer_details?.email ||
      session.customer_email

    const ownerType = metadata.ownerType || "individual"
    const paymentId = session.payment_intent || session.id

    if (!hash || !ownerEmail) {
      console.error("[WEBHOOK] Missing hash or owner email", {
        hash,
        ownerEmail,
      })

      return res.status(200).json({
        received: true,
        skipped: "missing_hash_or_email",
      })
    }

    await sendEmail({
      hash,
      language,
      email: ownerEmail,
      fileName,
      ownerName,
      ownerEmail,
      ownerType,
      paymentId,
    })

    console.log("[WEBHOOK] Certificate email sent", {
      ownerEmail,
      ownerName,
      hash,
      paymentId,
    })

    return res.status(200).json({
      received: true,
      emailSent: true,
    })
  } catch (error) {
    console.error("[WEBHOOK] Error:", error)

    return res.status(500).json({
      error: error.message,
    })
  }
}