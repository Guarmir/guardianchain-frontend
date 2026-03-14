import Stripe from "stripe"
import generateCertificate from "./generate-certificate.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

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

  try {

    // fluxo vindo da página Success (Stripe)
    if (session_id) {

      const session = await stripe.checkout.sessions.retrieve(session_id)

      fileHash = session.metadata?.hash || fileHash
      language = session.metadata?.language === "pt" ? "pt" : language
      fileName = session.metadata?.fileName || ""

      if (!fileHash) {
        console.error("[DOWNLOAD CERTIFICATE] Hash missing in Stripe session")
        return res.status(400).json({ error: "Hash not found in session metadata" })
      }

    }

    // fluxo vindo da página Verify
    if (!fileHash) {
      console.error("[DOWNLOAD CERTIFICATE] Hash not provided")
      return res.status(400).json({ error: "Hash not provided" })
    }

    console.log("[DOWNLOAD CERTIFICATE] Generating PDF:", {
      hash: fileHash,
      language,
      fileName,
    })

    const pdf = await generateCertificate({
      hash: fileHash,
      language,
      fileName,
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
      error: "Certificate generation failed"
    })

  }

}