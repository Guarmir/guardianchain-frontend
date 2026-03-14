import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import i18n from "../i18n"

export default function Success() {
  const [params] = useSearchParams()

  const sessionId = params.get("session_id")
  const langParam = params.get("lang")
  const lang = langParam === "pt" ? "pt" : "en"

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
  }, [lang])

  function download() {
    if (!sessionId) {
      alert(
        lang === "pt"
          ? "Sessão de pagamento não encontrada."
          : "Payment session not found."
      )
      return
    }

    window.location.href = `/api/download-certificate?session_id=${encodeURIComponent(sessionId)}&lang=${lang}`
  }

  function goToRegister() {
    window.location.href = `/register?lang=${lang}`
  }

  function goToHome() {
    window.location.href = `/?lang=${lang}`
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
            ? "O certificado foi enviado para o seu email."
            : "The certificate was sent to your email."}
        </p>

        {!sessionId && (
          <p style={styles.warning}>
            {lang === "pt"
              ? "Aviso: sessão de pagamento não encontrada na URL."
              : "Warning: payment session was not found in the URL."}
          </p>
        )}

        <button
          onClick={download}
          style={{
            ...styles.primary,
            opacity: sessionId ? 1 : 0.7,
            cursor: sessionId ? "pointer" : "not-allowed",
          }}
          disabled={!sessionId}
          type="button"
        >
          {lang === "pt"
            ? "Baixar certificado"
            : "Download certificate"}
        </button>

        <button
          onClick={goToRegister}
          style={styles.secondary}
          type="button"
        >
          {lang === "pt"
            ? "Registrar outro arquivo"
            : "Register another file"}
        </button>

        <button
          onClick={goToHome}
          style={styles.secondary}
          type="button"
        >
          {lang === "pt"
            ? "Página inicial"
            : "Home"}
        </button>
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
    background: "linear-gradient(180deg,#4c5bd4,#3949ab)",
    padding: "20px",
  },

  card: {
    background: "white",
    padding: "40px",
    borderRadius: "14px",
    width: "420px",
    maxWidth: "100%",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
  },

  warning: {
    marginTop: "10px",
    color: "#b00020",
    fontSize: "14px",
  },

  primary: {
    background: "#3949ab",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "8px",
    width: "100%",
    marginTop: "20px",
  },

  secondary: {
    background: "#eee",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    width: "100%",
    marginTop: "10px",
    cursor: "pointer",
  },
}