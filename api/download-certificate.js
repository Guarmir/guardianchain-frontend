import Stripe from "stripe"
import generateCertificate from "./generate-certificate.js"
import { generateEvidenceKey } from "./lib/evidence-key.js"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  if (!stripe) {
    console.error("[DOWNLOAD CERTIFICATE] Missing STRIPE_SECRET_KEY")

    return res.status(500).json({
      error: "Server configuration error",
    })
  }

  const { session_id, hash, lang } = req.query

  let fileHash = hash || null
  let language = lang === "pt" ? "pt" : "en"
  let fileName = ""
  let ownerName = ""
  let ownerEmail = ""
  let ownerType = "individual"
  let paymentId = ""
  let issuedAt = null

  try {
    if (session_id) {
      const session = await stripe.checkout.sessions.retrieve(session_id)

      fileHash = session.metadata?.hash || fileHash
      language =
        session.metadata?.language === "pt"
          ? "pt"
          : language

      fileName = session.metadata?.fileName || ""
      ownerName = session.metadata?.ownerName || ""

      ownerEmail =
        session.metadata?.ownerEmail ||
        session.customer_details?.email ||
        session.customer_email ||
        ""

      ownerType =
        session.metadata?.ownerType || "individual"

      paymentId =
        session.payment_intent || session.id

      issuedAt = session.created || null

      if (!fileHash) {
        console.error(
          "[DOWNLOAD CERTIFICATE] Hash missing in Stripe session"
        )

        return res.status(400).json({
          error: "Hash not found in session metadata",
        })
      }
    }

    if (!fileHash) {
      console.error("[DOWNLOAD CERTIFICATE] Hash not provided")

      return res.status(400).json({
        error: "Hash not provided",
      })
    }

    const evidenceKey = generateEvidenceKey({
      paymentId: paymentId || `HASH-${fileHash}`,
      fileHash,
      language,
      issuedAt,
    })

    console.log("[DOWNLOAD CERTIFICATE] Generating PDF:", {
      hash: fileHash,
      language,
      fileName,
      ownerName,
      ownerEmail,
      ownerType,
      paymentId,
      issuedAt,
      evidenceKey,
    })

    const pdf = await generateCertificate({
      hash: fileHash,
      language,
      fileName,
      ownerName,
      ownerEmail,
      ownerType,
      paymentId,
      evidenceKey,
    })

    res.setHeader("Content-Type", "application/pdf")

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=guardianchain-certificate.pdf"
    )

    return res.send(pdf)
  } catch (error) {
    console.error(
      "[DOWNLOAD CERTIFICATE] Error:",
      error
    )

    return res.status(500).json({
      error: "Certificate generation failed",
    })
  }
}