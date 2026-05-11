import Stripe from "stripe"
import generateCertificate from "./generate-certificate.js"
import nodemailer from "nodemailer"

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

  if (rawBuffer.length > 0) {
    return {
      rawBuffer,
      rawText: rawBuffer.toString("utf8"),
    }
  }

  if (req.body) {
    if (typeof req.body === "string") {
      return {
        rawBuffer: Buffer.from(req.body),
        rawText: req.body,
      }
    }

    const bodyText = JSON.stringify(req.body)

    return {
      rawBuffer: Buffer.from(bodyText),
      rawText: bodyText,
    }
  }

  return {
    rawBuffer: Buffer.from(""),
    rawText: "",
  }
}

async function sendCertificateEmail({
  to,
  ownerName,
  language,
  pdfBuffer,
  verificationUrl,
}) {
  const isPt = language === "pt"

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })

  await transporter.sendMail({
    from: `"GuardianChain" <${process.env.GMAIL_USER}>`,
    to,
    subject: isPt
      ? "Seu certificado GuardianChain"
      : "Your GuardianChain certificate",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>${isPt ? "Certificado GuardianChain gerado" : "GuardianChain certificate generated"}</h2>
        <p>${isPt ? "Olá" : "Hello"} ${ownerName || ""},</p>
        <p>
          ${
            isPt
              ? "Seu certificado de prova digital foi gerado com vínculo ao titular declarado."
              : "Your digital proof certificate has been generated with declared holder binding."
          }
        </p>
        <p>
          ${isPt ? "Link de verificação:" : "Verification link:"}<br />
          <a href="${verificationUrl}">${verificationUrl}</a>
        </p>
        <p>
          ${
            isPt
              ? "O arquivo original não foi enviado nem armazenado pela GuardianChain."
              : "The original file was not uploaded or stored by GuardianChain."
          }
        </p>
      </div>
    `,
    attachments: [
      {
        filename: "guardianchain-certificate.pdf",
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  })
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
        console.error("[WEBHOOK] Empty request body")
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

    const baseUrl = process.env.BASE_URL || "https://guardianchain.online"

    const verificationUrl = `${baseUrl}/verify?hash=${encodeURIComponent(
      hash
    )}&lang=${language}`

    const pdfBuffer = await generateCertificate({
      hash,
      language,
      fileName,
      ownerName,
      ownerEmail,
      ownerType,
      paymentId,
    })

    await sendCertificateEmail({
      to: ownerEmail,
      ownerName,
      language,
      pdfBuffer,
      verificationUrl,
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