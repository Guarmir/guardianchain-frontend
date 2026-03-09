import { useState } from "react"
import { useTranslation } from "react-i18next"
import i18n from "../i18n"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

export default function Register(){

  const { t } = useTranslation()

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
      alert("File hash not generated")
      return
    }

    setLoading(true)

    const language = i18n.language?.startsWith("pt") ? "pt" : "en"

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

      alert("Payment initialization failed")

    }

    setLoading(false)

  }

  return(

    <div style={styles.page}>

      <div style={styles.card}>

        <h1>{t("register.title") || "Register File"}</h1>

        <p>
          {t("register.description") ||
          "Select a file to generate blockchain proof of existence"}
        </p>

        <input
          type="file"
          onChange={handleFile}
          style={{marginTop:"20px"}}
        />

        {hash && (

          <div style={{marginTop:"20px"}}>

            <p><strong>SHA256</strong></p>

            <p style={{wordBreak:"break-all"}}>
              {hash}
            </p>

          </div>

        )}

        <button
          onClick={handleRegister}
          disabled={!hash || loading}
          style={styles.primary}
        >

          {loading
            ? "Processing..."
            : "Pay & Register"}

        </button>

      </div>

    </div>

  )

}

const styles={

  page:{
    minHeight:"100vh",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    background:"linear-gradient(180deg,#4c5bd4,#3949ab)"
  },

  card:{
    background:"white",
    padding:"40px",
    borderRadius:"14px",
    width:"420px",
    textAlign:"center",
    boxShadow:"0 20px 60px rgba(0,0,0,0.25)"
  },

  primary:{
    background:"#3949ab",
    color:"white",
    border:"none",
    padding:"14px",
    borderRadius:"8px",
    width:"100%",
    marginTop:"20px",
    cursor:"pointer"
  }

}