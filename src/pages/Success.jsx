import { useSearchParams } from "react-router-dom"

export default function Success() {

  const [params] = useSearchParams()

  const hash = params.get("hash")

  async function downloadCertificate() {

    const language = navigator.language

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

    a.click()

  }

  return (

    <div style={styles.page}>

      <div style={styles.card}>

        <h1 style={styles.title}>
          Registro realizado com sucesso
        </h1>

        <p style={styles.text}>
          Seu certificado foi gerado.
        </p>

        <button
          style={styles.button}
          onClick={downloadCertificate}
        >
          Baixar certificado
        </button>

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
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
  },

  title: {
    marginBottom: "10px"
  },

  text: {
    marginBottom: "20px"
  },

  button: {
    background: "#3949ab",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer"
  }

}