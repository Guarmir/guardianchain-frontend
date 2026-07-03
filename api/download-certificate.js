import crypto from "crypto"
import Stripe from "stripe"
import generateCertificate from "./generate-certificate.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

function normalizeCode(value) {
  return String(value || "")
    .replace(/[^A-Z0-9]/gi, "")
    .toUpperCase()
}

function generateEvidenceKey({ paymentId, fileHash, language }) {
  const year = new Date().getUTCFullYear()
  const market = language === "pt" ? "BR" : "EN"

  const paymentPart = normalizeCode(paymentId).slice(-6).padStart(6, "0")
  const hashPart = normalizeCode(fileHash).slice(0, 6).padEnd(6, "0")
  const randomPart = crypto.randomBytes(4).toString("hex").toUpperCase()

  return `GC-${year}-${market}-${paymentPart}-${hashPart}-${randomPart}`
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("[DOWNLOAD CERTIFICATE] Missing STRIPE_SECRET_KEY")
    return res.status(500).json({ error: "Server configuration error" })
  }

  const { session_id, hash, lang } = req.query

  let fileHash = hash || null
  let language = lang === "pt" ? "pt" : "en"
  let fileName = ""
  let ownerName = ""
  let ownerEmail = ""
  let ownerType = "individual"
  let paymentId = ""

  try {
    if (session_id) {
      const session = await stripe.checkout.sessions.retrieve(session_id)

      fileHash = session.metadata?.hash || fileHash
      language = session.metadata?.language === "pt" ? "pt" : language
      fileName = session.metadata?.fileName || ""
      ownerName = session.metadata?.ownerName || ""
      ownerEmail =
        session.metadata?.ownerEmail ||
        session.customer_details?.email ||
        session.customer_email ||
        ""
      ownerType = session.metadata?.ownerType || "individual"
      paymentId = session.payment_intent || session.id

      if (!fileHash) {
        console.error("[DOWNLOAD CERTIFICATE] Hash missing in Stripe session")
        return res.status(400).json({ error: "Hash not found in session metadata" })
      }
    }

    if (!fileHash) {
      console.error("[DOWNLOAD CERTIFICATE] Hash not provided")
      return res.status(400).json({ error: "Hash not provided" })
    }

    const evidenceKey = generateEvidenceKey({
      paymentId,
      fileHash,
      language,
    })

    console.log("[DOWNLOAD CERTIFICATE] Generating PDF:", {
      hash: fileHash,
      language,
      fileName,
      ownerName,
      ownerEmail,
      ownerType,
      paymentId,
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
  } catch (err) {
    console.error("[DOWNLOAD CERTIFICATE] Error:", err)

    return res.status(500).json({
      error: "Certificate generation failed",
    })
  }
}