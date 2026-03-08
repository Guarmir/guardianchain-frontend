import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req,res){

  if(req.method !== "POST"){

    return res.status(405).json({error:"Method not allowed"})

  }

  const {hash,language} = req.body

  try{

    const session = await stripe.checkout.sessions.create({

      payment_method_types:["card"],

      line_items:[{

        price_data:{

          currency:"usd",

          product_data:{
            name:"GuardianChain Proof Registration"
          },

          unit_amount:900

        },

        quantity:1

      }],

      mode:"payment",

      success_url:`${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url:`${process.env.BASE_URL}`,

      metadata:{
        hash,
        language
      }

    })

    res.status(200).json({id:session.id})

  }

  catch(error){

    res.status(500).json({error:error.message})

  }

}