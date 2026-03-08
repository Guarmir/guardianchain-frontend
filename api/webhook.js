import Stripe from "stripe"
import generateCertificate from "./generate-certificate.js"
import sendCertificate from "./send-certificate.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req,res){

  const sig = req.headers["stripe-signature"]

  let event

  try{

    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )

  }

  catch(err){

    return res.status(400).send(`Webhook Error: ${err.message}`)

  }

  if(event.type === "checkout.session.completed"){

    const session = event.data.object

    const hash = session.metadata.hash

    const language = session.metadata.language || "en"

    const email = session.customer_details.email

    const pdf = await generateCertificate(hash,language)

    await sendCertificate(email,pdf)

  }

  res.json({received:true})

}