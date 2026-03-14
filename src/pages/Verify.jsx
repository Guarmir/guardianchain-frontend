import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import i18n from "../i18n"

export default function Verify() {
  const [params] = useSearchParams()

  const hash = params.get("hash")
  const langParam = params.get("lang")
  const lang = langParam === "pt" ? "pt" : "en"

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
  }, [lang])

  function download() {
    if (!hash) {
      alert(
        lang === "pt"
          ? "Hash não encontrado."
          : "Hash not found."
      )
      return
    }

    window.location.href = `/api/download-certificate?hash=${encodeURIComponent(hash)}&lang=${lang}`
  }

  function goToRegister() {
    window.location.href = `/register?lang=${lang}`
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>GuardianChain</h1>

        <p style={styles.label}>
          {lang === "pt" ? "Hash:" : "Hash:"}
        </p>

        {hash ? (
          <p style={styles.hash}>{hash}</p>
        ) : (
          <p style={styles.warning}>
            {lang === "pt"
              ? "Hash não informado na URL."
              : "Hash was not provided in the URL."}
          </p>
        )}

        <button
          onClick={download}
          disabled={!hash}
          style={{
            ...styles.primary,
            opacity: hash ? 1 : 0.7,
            cursor: hash ? "pointer" : "not-allowed",
          }}
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
    width: "700px",
    maxWidth: "100%",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
  },

  label: {
    marginTop: "20px",
    fontWeight: "bold",
  },

  hash: {
    marginTop: "10px",
    wordBreak: "break-all",
    background: "#f5f5f5",
    padding: "12px",
    borderRadius: "8px",
    fontFamily: "monospace",
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