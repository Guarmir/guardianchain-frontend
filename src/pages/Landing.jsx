import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

export default function Landing() {

  const { t } = useTranslation()
  const navigate = useNavigate()

  return (

    <div style={styles.page}>

      <div style={styles.hero}>

        <img
          src="/logo.png"
          alt="GuardianChain"
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

        <div style={styles.features}>

          <p>🔒 {t("landing.private")}</p>
          <p>⛓ {t("landing.blockchain")}</p>
          <p>🌐 {t("landing.verify")}</p>
          <p>⏱ {t("landing.proof")}</p>

        </div>

      </div>

      <div style={styles.card}>

        <p style={styles.plan}>
          {t("price.single")}
        </p>

        <h2 style={styles.price}>
          {t("price.value")}
        </h2>

        <p style={styles.priceDescription}>
          {t("price.description")}
        </p>

        <button
          style={styles.button}
          onClick={() => navigate("/register")}
        >
          {t("price.button")}
        </button>

      </div>

      <div style={styles.footer}>

        <a href="#">Sobre</a>
        <a href="#">Termos</a>
        <a href="#">Privacidade</a>

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
    padding: "40px"
  },

  hero: {
    textAlign: "center",
    maxWidth: "700px"
  },

  logo: {
    width: "180px",
    marginBottom: "30px"
  },

  title: {
    fontSize: "48px",
    marginBottom: "20px"
  },

  subtitle: {
    fontSize: "22px",
    marginBottom: "10px"
  },

  description: {
    opacity: 0.9,
    marginBottom: "30px"
  },

  features: {
    marginBottom: "40px",
    lineHeight: "30px"
  },

  card: {
    background: "white",
    color: "#333",
    padding: "40px",
    borderRadius: "12px",
    width: "320px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
  },

  plan: {
    fontSize: "14px",
    marginBottom: "10px"
  },

  price: {
    fontSize: "36px",
    marginBottom: "10px"
  },

  priceDescription: {
    fontSize: "14px",
    marginBottom: "25px"
  },

  button: {
    background: "#3949ab",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer"
  },

  footer: {
    marginTop: "40px",
    display: "flex",
    gap: "20px",
    fontSize: "14px"
  }

}