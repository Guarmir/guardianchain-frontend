import Stripe from "stripe"
import generateCertificate from "./generate-certificate.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req,res){

 generateCertificate({
  hash,
  language: lang
})

  if(!session_id){
    return res.status(400).json({ error:"Session not provided" })
  }

  try{

    const session = await stripe.checkout.sessions.retrieve(session_id)

    const hash = session.metadata?.hash

    const language = lang || session.metadata?.language || "en"

    if(!hash){
      return res.status(400).json({ error:"Hash not found" })
    }

    const pdf = await generateCertificate({
      hash,
      language
    })

    res.setHeader("Content-Type","application/pdf")

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=guardianchain-certificate.pdf"
    )

    res.send(pdf)

  }catch(err){

    console.error("Download error:",err)

    res.status(500).json({ error:"Certificate generation failed" })

  }

}