import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

export default function Register(){

  const { t, i18n } = useTranslation()

  const [params] = useSearchParams()

  const langParam = params.get("lang") || "en"

  if(i18n.language !== langParam){
    i18n.changeLanguage(langParam)
  }

  const language = langParam === "pt" ? "pt" : "en"

  const [hash,setHash] = useState(null)
  const [loading,setLoading] = useState(false)
  const [fileName,setFileName] = useState("")

  async function generateHash(file){

    const buffer = await file.arrayBuffer()

    const hashBuffer = await crypto.subtle.digest("SHA-256",buffer)

    const hashArray = Array.from(new Uint8Array(hashBuffer))

    const hashHex = hashArray
      .map(b => b.toString(16).padStart(2,"0"))
      .join("")

    setHash(hashHex)

  }

  async function handleFile(e){

    const file = e.target.files[0]

    if(!file) return

    setFileName(file.name)

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
          hash,
          language
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

    <div style={styles.page}>

      <div style={styles.card}>

        <h1>GuardianChain</h1>

        <p>
          {language === "pt"
            ? "Selecione um arquivo para gerar prova criptográfica."
            : "Select a file to generate a cryptographic proof."
          }
        </p>

        <input type="file" onChange={handleFile}/>

        {fileName && (
          <p style={{marginTop:"10px"}}>
            {fileName}
          </p>
        )}

        {hash && (
          <textarea
            readOnly
            value={hash}
            style={styles.hashBox}
          />
        )}

        <button
          onClick={handleRegister}
          disabled={!hash || loading}
          style={styles.button}
        >
          {language === "pt"
            ? "Pagar e Registrar"
            : "Pay & Register"
          }
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

  hashBox:{
    width:"100%",
    marginTop:"15px",
    height:"100px"
  },

  button:{
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