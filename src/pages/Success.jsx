import { Link, useSearchParams } from "react-router-dom"
import { useEffect } from "react"

export default function Success() {
  const [params] = useSearchParams()

  const langParam = params.get("lang")
  const lang = langParam === "pt" ? "pt" : "en"

  const sessionId = params.get("session_id")

  // Analytics - compra concluída
  useEffect(() => {
    if (typeof window.gtag === "function") {

      // Evento padrão purchase
      window.gtag("event", "purchase", {
        transaction_id: sessionId || "unknown",
        value: 8,
        currency: "USD"
      })

      // Conversão Google Ads
      window.gtag("event", "conversion", {
        send_to: "AW-18086374211/9ucuCKWmhKEcEMPWoLBD",
        value: 8.0,
        currency: "USD",
        transaction_id: sessionId || ""
      })
    }
  }, [sessionId])

  const handleDownload = () => {
    if (!sessionId) return

    const url =
      "/api/download-certificate?session_id=" +
      encodeURIComponent(sessionId) +
      "&lang=" +
      lang

    window.open(url, "_blank")
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>
          {lang === "pt"
            ? "Certificado criado"
            : "Certificate created"}
        </h1>

        <p>
          {lang === "pt"
            ? "O hash do seu arquivo foi registrado."
            : "Your file hash has been registered."}
        </p>

        <p>
          {lang === "pt"
            ? "O certificado foi enviado para o email utilizado no pagamento."
            : "The certificate was sent to the email used during payment."}
        </p>

        <button
          style={styles.buttonPrimary}
          onClick={handleDownload}
        >
          {lang === "pt"
            ? "Baixar certificado"
            : "Download certificate"}
        </button>

        <Link to={`/register?lang=${lang}`}>
          <button style={styles.buttonSecondary}>
            {lang === "pt"
              ? "Registrar outro arquivo"
              : "Register another file"}
          </button>
        </Link>

        <Link to={`/?lang=${lang}`}>
          <button style={styles.buttonSecondary}>
            {lang === "pt"
              ? "Página inicial"
              : "Home"}
          </button>
        </Link>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(180deg,#5a60d1,#3b3fa3)",
  },

  card: {
    background: "#f3f3f3",
    padding: "40px",
    borderRadius: "14px",
    textAlign: "center",
    width: "420px",
  },

  buttonPrimary: {
    width: "100%",
    marginTop: "20px",
    padding: "14px",
    background: "#4b4fbf",
    border: "none",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
  },

  buttonSecondary: {
    width: "100%",
    marginTop: "10px",
    padding: "14px",
    background: "#ddd",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
}