import { useNavigate } from "react-router-dom"

export default function Success(){

  const navigate = useNavigate()

  return(

    <div style={styles.page}>

      <div style={styles.card}>

        <h1>Registro realizado com sucesso ✔</h1>

        <p>
        Seu hash foi registrado na blockchain.
        </p>

        <p>
        O certificado foi enviado para seu e-mail.
        </p>

        <button
        style={styles.button}
        onClick={()=>navigate("/register")}
        >

        Registrar novo arquivo

        </button>

        <button
        style={styles.secondary}
        onClick={()=>navigate("/")}
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
  },

  secondary:{
    marginTop:"10px",
    padding:"10px",
    border:"none",
    borderRadius:"8px",
    cursor:"pointer"
  }

}