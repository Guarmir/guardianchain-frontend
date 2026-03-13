import Stripe from "stripe"
import generateCertificate from "./generate-certificate.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req,res){

  const { session_id, hash, lang } = req.query

  let fileHash = hash
  let language = lang === "pt" ? "pt" : "en"

  try{

    // fluxo vindo do Stripe success page
    if(session_id){

      const session = await stripe.checkout.sessions.retrieve(session_id)

      fileHash = session.metadata?.hash

      if(!fileHash){
        return res.status(400).json({ error:"Hash not found" })
      }

    }

    // fluxo vindo da página verify
    if(!fileHash){
      return res.status(400).json({ error:"Hash not provided" })
    }

    const pdf = await generateCertificate({
      hash: fileHash,
      language: language
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