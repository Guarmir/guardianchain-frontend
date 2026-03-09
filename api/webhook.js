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

  const buf = await new Promise(resolve => {

    const chunks = []

    req.on("data",chunk => chunks.push(chunk))

    req.on("end",() => resolve(Buffer.concat(chunks)))

  })

  let event

  try{

    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )

  }catch(err){

    console.error("Webhook error:",err.message)

    return res.status(400).send(`Webhook Error: ${err.message}`)

  }

  if(event.type === "checkout.session.completed"){

    const session = event.data.object

    const hash = session.metadata?.hash
    const email = session.customer_details?.email
    const language = session.metadata?.language || "en"

    if(!hash || !email){

      console.error("Dados faltando:",{hash,email})

      return res.status(200).json({received:true})

    }

    try{

      const pdf = await generateCertificate({
        hash,
        language
      })

      await sendCertificate(email,pdf)

      console.log("Certificado enviado para:",email)

    }catch(err){

      console.error("Erro ao gerar certificado:",err)

    }

  }

  res.json({received:true})

}