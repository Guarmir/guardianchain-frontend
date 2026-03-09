import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

export default function Register(){

  const [params] = useSearchParams()

  const langParam = params.get("lang")

  const language =
    langParam === "pt" ? "pt" : "en"

  const [hash,setHash] = useState(null)
  const [loading,setLoading] = useState(false)

  async function generateHash(file){

    const buffer = await file.arrayBuffer()

    const hashBuffer = await crypto.subtle.digest("SHA-256",buffer)

    const hashArray = Array.from(new Uint8Array(hashBuffer))

    const hashHex = hashArray
      .map(b => b.toString(16).padStart(2,"0"))
      .join("")

    setHash(hashHex)

    return hashHex
  }

  async function handleFile(e){

    const file = e.target.files[0]

    if(!file) return

    await generateHash(file)

  }

  async function handleRegister(){

    if(!hash){
      alert("Hash not generated")
      return
    }

    setLoading(true)

    try{

      const res = await fetch("/api/create-checkout-session",{

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({
          hash:hash,
          language:language
        })

      })

      const data = await res.json()

      const stripe = await stripePromise

      await stripe.redirectToCheckout({
        sessionId:data.id
      })

    }catch(err){

      console.error(err)

      alert("Payment error")

    }

    setLoading(false)

  }

  return(

    <div style={{textAlign:"center",marginTop:"100px"}}>

      <h1>GuardianChain</h1>

      <input type="file" onChange={handleFile}/>

      {hash && <p>{hash}</p>}

      <button
        onClick={handleRegister}
        disabled={!hash || loading}
      >
        Pay & Register
      </button>

    </div>

  )

}