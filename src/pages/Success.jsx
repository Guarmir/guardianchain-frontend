import { useSearchParams } from "react-router-dom"

export default function Success() {

  const [params] = useSearchParams()

  const hash = params.get("hash")

  function downloadCertificate() {

    window.open(`/api/download-certificate?hash=${hash}`)

  }

  return (

    <div style={styles.page}>

      <div style={styles.card}>

        <h1 style={styles.title}>
          Registro realizado com sucesso ✅
        </h1>

        <p style={styles.text}>
          Seu hash foi enviado para registro na blockchain.
        </p>

        <p style={styles.text}>
          O certificado também foi enviado para seu e-mail.
        </p>

        <div style={styles.buttons}>

          <button
            style={styles.primaryButton}
            onClick={downloadCertificate}
          >
            Baixar certificado
          </button>

          <a href="/register">
            <button style={styles.secondaryButton}>
              Registrar novo arquivo
            </button>
          </a>

          <a href="/">
            <button style={styles.secondaryButton}>
              Voltar ao início
            </button>
          </a>

        </div>

      </div>

    </div>

  )
}

const styles = {

  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg,#4c5bd4,#3949ab)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  card: {
    background: "white",
    padding: "40px",
    borderRadius: "14px",
    width: "520px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)"
  },

  title: {
    fontSize: "28px",
    marginBottom: "20px"
  },

  text: {
    fontSize: "14px",
    marginBottom: "8px"
  },

  buttons: {
    marginTop: "25px",
    display: "flex",
    gap: "10px",
    justifyContent: "center"
  },

  primaryButton: {
    background: "#3949ab",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  secondaryButton: {
    background: "#eee",
    border: "none",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: "pointer"
  }

}