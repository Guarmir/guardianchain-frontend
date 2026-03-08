import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req,res){

  const { hash } = req.body

  if(!hash){
    return res.status(400).json({error:"Hash não fornecido"})
  }

  const session = await stripe.checkout.sessions.create({

    payment_method_types:["card"],

    mode:"payment",

    line_items:[{
      price_data:{
        currency:"usd",
        product_data:{
          name:"GuardianChain Registration"
        },
        unit_amount:900
      },
      quantity:1
    }],

    success_url:`${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,

    cancel_url:`${process.env.BASE_URL}/register`,

    metadata:{
      hash:hash
    }

  })

  res.json({id:session.id})

}