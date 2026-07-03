import Stripe from "stripe"
import generateCertificate from "./generate-certificate.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

function generateEvidenceKey({ paymentId, language }) {
  const year = new Date().getUTCFullYear()
  const market = language === "pt" ? "BR" : "EN"

  const source = `${paymentId || "guardianchain"}-${language}-${year}`
  let hash = 0

  for (let i = 0; i < source.length; i++) {
    hash = (hash << 5) - hash + source.charCodeAt(i)
    hash |= 0
  }

  const base = Math.abs(hash).toString(36).toUpperCase().padStart(8, "0")
  const part1 = base.slice(0, 4)
  const part2 = base.slice(4, 8)

  return `GC-${year}-${market}-${part1}-${part2}`
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