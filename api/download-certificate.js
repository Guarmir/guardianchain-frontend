import Stripe from "stripe"
import generateCertificate from "./generate-certificate.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req,res){

  const {session_id,hash} = req.query

  let fileHash = hash

  if(session_id){

    const session = await stripe.checkout.sessions.retrieve(session_id)

    fileHash = session.metadata.hash

  }

  if(!fileHash){

    return res.status(400).json({error:"Hash não fornecido"})

  }

  const pdf = await generateCertificate(fileHash)

  res.setHeader("Content-Type","application/pdf")

  res.send(pdf)

}