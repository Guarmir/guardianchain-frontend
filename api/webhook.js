import Stripe from "stripe"
import nodemailer from "nodemailer"
import generateCertificate from "./generate-certificate.js"

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

    console.error("Webhook error:", err.message)

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

        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,

        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }

      })

      const texts = {

        pt: {
          subject: "Seu certificado GuardianChain",
          message:
            "Seu certificado de prova digital foi gerado.\n\nO arquivo PDF está anexado.\n\nGuardianChain"
        },

        en: {
          subject: "Your GuardianChain Certificate",
          message:
            "Your digital proof certificate has been generated.\n\nThe PDF file is attached.\n\nGuardianChain"
        }

      }

      const t = language === "pt" ? texts.pt : texts.en

      await transporter.sendMail({

        from: process.env.SMTP_USER,

        to: email,

        subject: t.subject,

        text: t.message,

        attachments: [
          {
            filename: "guardianchain-certificate.pdf",
            content: certificate
          }
        ]

      })

      console.log("Email sent successfully")

    } catch (error) {

      console.error("Error generating or sending certificate", error)

    }

  }

  res.json({ received: true })

}