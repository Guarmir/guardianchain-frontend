import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useSearchParams } from "react-router-dom"
import i18n from "../i18n"

export default function Landing() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const langParam = params.get("lang")
  const lang = langParam === "pt" ? "pt" : "en"

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
  }, [lang])

  function goRegister() {
    navigate(`/register?lang=${lang}`)
  }

  function goVerify() {
    navigate(`/verify?lang=${lang}`)
  }

  return (
    <div style={styles.page}>
      <img
        src="/logo.png"
        alt="GuardianChain logo"
        style={styles.logo}
      />

      <h1 style={styles.title}>
        {t("landing.title")}
      </h1>

      <p style={styles.subtitle}>
        {t("landing.subtitle")}
      </p>

      <p style={styles.description}>
        {t("landing.description")}
      </p>

      <div style={styles.featuresTop}>
        <div>🔒 {t("landing.private")}</div>
        <div>⛓ {t("landing.blockchain")}</div>
        <div>🌐 {t("landing.verify")}</div>
        <div>⏱ {t("landing.proof")}</div>
      </div>

      <div style={styles.card}>
        <div style={styles.plan}>
          {t("price.single")}
        </div>

        <div style={styles.price}>
          {t("price.value")}
        </div>

        <div style={styles.priceDescription}>
          {t("price.description")}
        </div>

        <button
          style={styles.primaryButton}
          onClick={goRegister}
          type="button"
        >
          {t("price.register")}
        </button>

        <button
          style={styles.secondaryButton}
          onClick={goVerify}
          type="button"
        >
          {t("price.verify")}
        </button>
      </div>

      <div style={styles.featuresBottom}>
        <p>✔ {t("landing.blockchain")}</p>
        <p>✔ {t("landing.verify")}</p>
        <p>✔ {t("landing.private")}</p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg,#4c5bd4,#3949ab)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "60px",
    paddingBottom: "80px",
    paddingLeft: "20px",
    paddingRight: "20px",
  },

  logo: {
    width: "160px",
    marginBottom: "40px",
  },

  title: {
    fontSize: "44px",
    textAlign: "center",
    maxWidth: "800px",
    marginBottom: "20px",
  },

  subtitle: {
    fontSize: "20px",
    textAlign: "center",
    maxWidth: "700px",
    marginBottom: "10px",
  },

  description: {
    fontSize: "15px",
    opacity: 0.9,
    textAlign: "center",
    marginBottom: "30px",
  },

  featuresTop: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
    marginBottom: "40px",
    fontSize: "16px",
  },

  card: {
    background: "white",
    color: "#333",
    padding: "40px",
    borderRadius: "14px",
    width: "340px",
    maxWidth: "100%",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
    marginBottom: "30px",
  },

  plan: {
    fontSize: "14px",
    marginBottom: "10px",
    opacity: 0.8,
  },

  price: {
    fontSize: "52px",
    fontWeight: "bold",
    marginBottom: "6px",
  },

  priceDescription: {
    fontSize: "14px",
    marginBottom: "24px",
  },

  primaryButton: {
    background: "#3949ab",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
    marginBottom: "12px",
  },

  secondaryButton: {
    background: "#3949ab",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "15px",
    cursor: "pointer",
    width: "100%",
  },

  featuresBottom: {
    fontSize: "14px",
    opacity: 0.9,
    textAlign: "center",
    lineHeight: "26px",
  },
}
