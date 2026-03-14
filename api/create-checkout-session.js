import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req,res){

  const { hash, language } = req.body

  if(!hash){
    return res.status(400).json({ error:"Hash not provided" })
  }

  const lang = language === "pt" ? "pt" : "en"

  const session = await stripe.checkout.sessions.create({

    payment_method_types:["card"],

    mode:"payment",

    line_items:[{
      price_data:{
        currency:"usd",
        product_data:{
          name:"GuardianChain Certificate"
        },
        unit_amount:900
      },
      quantity:1
    }],

    success_url:`${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&lang=${lang}`,

    cancel_url:`${process.env.BASE_URL}/register?lang=${lang}`,

    metadata:{
      hash,
      language:lang
    }

  })

  res.json({ id:session.id })

}