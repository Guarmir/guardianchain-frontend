import Stripe from "stripe"
import generateCertificate from "./generate-certificate.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {

  const { session_id } = req.query

  if (!session_id) {
    return res.status(400).json({ error: "session_id não fornecido" })
  }

  try {

    const session = await stripe.checkout.sessions.retrieve(session_id)

    const hash = session.metadata?.hash

    if (!hash) {
      return res.status(400).json({ error: "hash não encontrado no metadata" })
    }

    const pdf = await generateCertificate({
      hash: hash,
      language: "en"
    })

    res.setHeader("Content-Type", "application/pdf")

    res.send(pdf)

  } catch (error) {

    console.error(error)

    res.status(500).json({ error: "Erro ao gerar certificado" })

  }

}