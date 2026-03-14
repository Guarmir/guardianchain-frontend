import { useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import i18n from "../i18n"

export default function Success(){

  const { t } = useTranslation()

  const [params] = useSearchParams()

  const sessionId = params.get("session_id")

  // idioma vindo da URL
  const langParam = params.get("lang")

  const lang = langParam === "pt" ? "pt" : "en"

  // sincroniza idioma do i18n
  if(i18n.language !== lang){
    i18n.changeLanguage(lang)
  }

  function download(){

    window.location.href =
      `/api/download-certificate?session_id=${sessionId}&lang=${lang}`

  }

  return(

    <div style={styles.page}>

      <div style={styles.card}>

        <h1>

          {lang === "pt"
            ? "Certificado criado"
            : "Certificate created"
          }

        </h1>

        <p>

          {lang === "pt"
            ? "O hash do seu arquivo foi registrado."
            : "Your file hash has been registered."
          }

        </p>

        <p>

          {lang === "pt"
            ? "O certificado foi enviado para o seu email."
            : "The certificate was sent to your email."
          }

        </p>

        <button
          onClick={download}
          style={styles.primary}
        >

          {lang === "pt"
            ? "Baixar certificado"
            : "Download certificate"
          }

        </button>

        <button
          onClick={()=>window.location.href=`/register?lang=${lang}`}
          style={styles.secondary}
        >

          {lang === "pt"
            ? "Registrar outro arquivo"
            : "Register another file"
          }

        </button>

        <button
          onClick={()=>window.location.href=`/?lang=${lang}`}
          style={styles.secondary}
        >

          {lang === "pt"
            ? "Página inicial"
            : "Home"
          }

        </button>

      </div>

    </div>

  )

}

const styles = {

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
  },

  secondary:{
    background:"#eee",
    border:"none",
    padding:"12px",
    borderRadius:"8px",
    width:"100%",
    marginTop:"10px",
    cursor:"pointer"
  }

}