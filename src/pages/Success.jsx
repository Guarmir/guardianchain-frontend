import { useSearchParams } from "react-router-dom"

export default function Success() {

  const [params] = useSearchParams()

  const hash = params.get("hash")

  async function downloadCertificate() {

    const browserLang = navigator.language || "en"

    const language = browserLang.startsWith("pt") ? "pt" : "en"

    const response = await fetch("/api/send-certificate", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        hash,
        language
      })

    })

    const blob = await response.blob()

    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")

    a.href = url
    a.download = "guardianchain-certificate.pdf"

    document.body.appendChild(a)

    a.click()

    a.remove()

  }

  return (

    <div style={styles.page}>

      <div style={styles.card}>

        <h1 style={styles.title}>
          Registro realizado com sucesso ✔
        </h1>

        <p style={styles.text}>
          Seu hash foi registrado na blockchain.
        </p>

        <p style={styles.text}>
          O certificado também foi enviado para seu e-mail.
        </p>

        <button
          style={styles.primary}
          onClick={downloadCertificate}
        >
          Baixar
        </button>

        <div style={styles.buttons}>

          <a href="/register">
            <button style={styles.secondary}>
              Registrar novo arquivo
            </button>
          </a>

          <a href="/">
            <button style={styles.secondary}>
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
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    maxWidth: "420px"
  },

  title: {
    marginBottom: "15px"
  },

  text: {
    marginBottom: "10px"
  },

  primary: {
    background: "#3949ab",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    width: "100%",
    marginTop: "20px"
  },

  buttons: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  secondary: {
    background: "#eeeeee",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer"
  }

}