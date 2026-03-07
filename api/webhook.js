import Stripe from "stripe"
import generateCertificate from "./generate-certificate.js"
import nodemailer from "nodemailer"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const config = {
  api: {
    bodyParser: false
  }
}

async function buffer(readable) {
  const chunks = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(req, res) {

  const sig = req.headers["stripe-signature"]

  const buf = await buffer(req)

  let event

  try {

    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )

  } catch (err) {

    console.error("Webhook signature verification failed.", err)

    return res.status(400).send(`Webhook Error: ${err.message}`)

  }

  if (event.type === "checkout.session.completed") {

    const session = event.data.object

    const hash = session.metadata.hash

    const language = session.metadata.language || "en"

    const email = session.customer_details.email

    try {

      const certificate = await generateCertificate({
        hash,
        language
      })

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      })

      const subject =
        language === "pt"
          ? "Seu certificado GuardianChain"
          : "Your GuardianChain Certificate"

      const text =
        language === "pt"
          ? "Seu certificado de prova digital está anexado."
          : "Your digital proof certificate is attached."

      await transporter.sendMail({

        from: process.env.EMAIL_USER,

        to: email,

        subject,

        text,

        attachments: [
          {
            filename: "guardianchain-certificate.pdf",
            content: certificate
          }
        ]

      })

    } catch (error) {

      console.error("Error generating or sending certificate", error)

    }

  }

  res.json({ received: true })

}