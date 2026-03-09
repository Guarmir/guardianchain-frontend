import { useState } from "react"
import { useTranslation } from "react-i18next"
import i18n from "../i18n"

export default function Register() {

  const { t } = useTranslation()

  const [hash,setHash] = useState("")
  const [fileName,setFileName] = useState("")

  async function generateHash(file){

    const buffer = await file.arrayBuffer()

    const hashBuffer = await crypto.subtle.digest("SHA-256",buffer)

    const hashArray = Array.from(new Uint8Array(hashBuffer))

    const hashHex = hashArray.map(b=>b.toString(16).padStart(2,"0")).join("")

    setHash("0x"+hashHex)

    setFileName(file.name)

  }

  async function handleCheckout(){

    if(!hash){
      alert(t("register.select_file"))
      return
    }

    const language = i18n.language

    const response = await fetch("/api/create-checkout-session",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        hash,
        language
      })
    })

    const data = await response.json()

    const stripe = window.Stripe("pk_test_51SkLPvK4J089mMwmMDF2qmdzyzj6aPGVagvGoQnO0gaQ4vkkrTY68rcjhFlu56YznsF61oJ35TWXCVnXfouaSthv00pJPoWVKB")

    await stripe.redirectToCheckout({
      sessionId:data.id
    })

  }

  return(

    <div style={styles.page}>

      <div style={styles.card}>

        <h1>{t("register.title")}</h1>

        <p>{t("register.subtitle")}</p>

        <label style={styles.label}>
          {t("register.choose_file")}
        </label>

        <input
          type="file"
          onChange={(e)=>generateHash(e.target.files[0])}
        />

        {fileName && (

          <div style={{marginTop:"20px"}}>

            <p><b>{fileName}</b></p>

            <textarea
              value={hash}
              readOnly
              style={{
                width:"100%",
                height:"100px"
              }}
            />

          </div>

        )}

        <button
          onClick={handleCheckout}
          style={styles.button}
        >

          {t("register.pay")}

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

  label:{
    display:"block",
    marginBottom:"8px",
    fontWeight:"bold"
  },

  button:{
    background:"#3949ab",
    color:"white",
    border:"none",
    padding:"14px",
    borderRadius:"8px",
    fontSize:"16px",
    cursor:"pointer",
    width:"100%",
    marginTop:"20px"
  }

}