import Stripe from "stripe"
import generateCertificate from "./generate-certificate.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {

  const { session_id } = req.query

  if (!session_id) {
    return res.status(400).json({ error: "Session não fornecida" })
  }

  try {

    const session = await stripe.checkout.sessions.retrieve(session_id)

    const hash = session.metadata?.hash
    const language = session.metadata?.language || "en"

    if (!hash) {
      return res.status(400).json({ error: "Hash não encontrado" })
    }

    const pdf = await generateCertificate({
      hash,
      language
    })

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=guardianchain-certificate.pdf"
    )

    res.send(pdf)

  } catch (error) {

    console.error("Erro ao gerar download:", error)

    res.status(500).json({ error: "Erro ao gerar certificado" })

  }

}