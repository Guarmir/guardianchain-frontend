import { useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import i18n from "../i18n"

export default function Success(){

  const { t } = useTranslation()

  const [params] = useSearchParams()

  const sessionId = params.get("session_id")
  const lang = params.get("lang") || i18n.language || "en"

  function download(){

    window.location.href =
      `/api/download-certificate?session_id=${sessionId}&lang=${lang}`

  }

  return(

    <div style={styles.page}>

      <div style={styles.card}>

        <h1>{t("success.title")}</h1>

        <p>{t("success.blockchain")}</p>

        <p>{t("success.email")}</p>

        <button
          onClick={download}
          style={styles.primary}
        >
          {t("success.download")}
        </button>

        <button
          onClick={()=>window.location.href="/register"}
          style={styles.secondary}
        >
          {t("success.new")}
        </button>

        <button
          onClick={()=>window.location.href="/"}
          style={styles.secondary}
        >
          {t("success.home")}
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