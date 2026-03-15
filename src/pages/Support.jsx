import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import i18n from "../i18n"
import Footer from "../components/Footer"

export default function Support() {
  const [params] = useSearchParams()

  const langParam = params.get("lang")
  const lang = langParam === "pt" ? "pt" : "en"

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
  }, [lang])

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>{lang === "pt" ? "Suporte" : "Support"}</h1>

        <p>
          {lang === "pt"
            ? "Se precisar de ajuda, tiver sugestões ou quiser relatar problemas, entre em contato:"
            : "If you need assistance, have suggestions, or want to report issues, contact us:"}
        </p>

        <p style={styles.email}>support@guardianchain.online</p>

        <p>
          {lang === "pt"
            ? "Responderemos assim que possível."
            : "We will respond as soon as possible."}
        </p>
      </div>

      <Footer />
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg,#4c5bd4,#3949ab)",
    color: "white",
    padding: "60px 20px 80px",
  },

  card: {
    maxWidth: "900px",
    margin: "0 auto",
    background: "white",
    color: "#222",
    padding: "40px",
    borderRadius: "14px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
    lineHeight: "1.8",
    textAlign: "center",
  },

  email: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: "24px 0",
  },
}
