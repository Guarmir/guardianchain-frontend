import Footer from "../components/Footer"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useSearchParams } from "react-router-dom"
import i18n from "../i18n"

export default function Landing() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const langParam = params.get("lang")
  const normalizedParamLang = langParam === "pt" || langParam === "en" ? langParam : null

  useEffect(() => {
    if (normalizedParamLang) {
      if (i18n.language !== normalizedParamLang) {
        i18n.changeLanguage(normalizedParamLang)
      }

      localStorage.setItem("guardianchain_lang", normalizedParamLang)
      return
    }

    const savedLang = localStorage.getItem("guardianchain_lang")
    const browserLang = navigator.language?.toLowerCase().startsWith("pt") ? "pt" : "en"
    const detectedLang = savedLang === "pt" || savedLang === "en" ? savedLang : browserLang

    if (i18n.language !== detectedLang) {
      i18n.changeLanguage(detectedLang)
    }

    navigate(`/?lang=${detectedLang}`, { replace: true })
  }, [normalizedParamLang, navigate])

  const lang = normalizedParamLang || (i18n.language === "pt" ? "pt" : "en")

  function setLang(newLang) {
    localStorage.setItem("guardianchain_lang", newLang)

    if (i18n.language !== newLang) {
      i18n.changeLanguage(newLang)
    }

    navigate(`/?lang=${newLang}`, { replace: true })
  }

  function goRegister() {
    navigate(`/register?lang=${lang}`)
  }

  function goVerify() {
    navigate(`/verify?lang=${lang}`)
  }

  return (
    <div style={styles.page}>
      <div style={styles.langSwitch}>
        <button
          type="button"
          style={{
            ...styles.langButton,
            ...(lang === "pt" ? styles.langButtonActive : {}),
          }}
          onClick={() => setLang("pt")}
        >
          PT
        </button>

        <span style={styles.langDivider}>|</span>

        <button
          type="button"
          style={{
            ...styles.langButton,
            ...(lang === "en" ? styles.langButtonActive : {}),
          }}
          onClick={() => setLang("en")}
        >
          EN
        </button>
      </div>

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
      <Footer />
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
    position: "relative",
  },

  langSwitch: {
    position: "absolute",
    top: "20px",
    right: "20px",
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "999px",
    padding: "6px 10px",
    backdropFilter: "blur(6px)",
  },

  langButton: {
    background: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    opacity: 0.65,
  },

  langButtonActive: {
    opacity: 1,
    textDecoration: "underline",
  },

  langDivider: {
    margin: "0 8px",
    opacity: 0.7,
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
