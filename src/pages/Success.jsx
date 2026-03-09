import { useSearchParams } from "react-router-dom"

export default function Success(){

  const [params] = useSearchParams()

  const sessionId = params.get("session_id")
  const lang = params.get("lang") || "en"

  function download(){

    window.location.href =
      `/api/download-certificate?session_id=${sessionId}&lang=${lang}`

  }

  return(

    <div style={styles.page}>

      <div style={styles.card}>

        <h1>Registro realizado com sucesso ✓</h1>

        <p>Seu hash foi registrado na blockchain.</p>

        <p>O certificado também foi enviado para seu e-mail.</p>

        <button
          onClick={download}
          style={styles.primary}
        >
          Baixar certificado
        </button>

        <button
          onClick={()=>window.location.href="/register"}
          style={styles.secondary}
        >
          Registrar novo arquivo
        </button>

        <button
          onClick={()=>window.location.href="/"}
          style={styles.secondary}
        >
          Voltar ao início
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
    marginTop:"20px"
  },

  secondary:{
    background:"#eee",
    border:"none",
    padding:"12px",
    borderRadius:"8px",
    width:"100%",
    marginTop:"10px"
  }

}