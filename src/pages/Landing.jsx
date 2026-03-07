import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

export default function Landing() {

  const { t } = useTranslation()
  const navigate = useNavigate()

  return (

    <div style={styles.page}>

      <img src="/logo.png" style={styles.logo} />

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
          style={styles.button}
          onClick={() => navigate("/register")}
        >
          {t("price.button")}
        </button>

        <div style={styles.trust}>

          <p>✔ Blockchain timestamp</p>
          <p>✔ Verifiable certificate</p>
          <p>✔ File never uploaded</p>

        </div>

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
    justifyContent: "center",
    padding: "40px"
  },

  logo: {
    width: "160px",
    marginBottom: "30px"
  },

  title: {
    fontSize: "44px",
    textAlign: "center",
    maxWidth: "800px"
  },

  subtitle: {
    marginTop: "20px",
    fontSize: "20px",
    textAlign: "center",
    maxWidth: "700px"
  },

  description: {
    marginTop: "10px",
    opacity: 0.9,
    textAlign: "center",
    marginBottom: "30px"
  },

  features: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "40px",
    fontSize: "16px"
  },

  card: {
    background: "white",
    color: "#333",
    padding: "40px",
    borderRadius: "14px",
    width: "360px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)"
  },

  plan: {
    fontSize: "14px",
    marginBottom: "10px"
  },

  price: {
    fontSize: "48px",
    fontWeight: "bold",
    marginBottom: "10px"
  },

  priceDescription: {
    fontSize: "14px",
    marginBottom: "20px"
  },

  button: {
    background: "#3949ab",
    color: "white",
    border: "none",
    padding: "14px 30px",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "20px"
  },

  trust: {
    fontSize: "13px",
    opacity: 0.8,
    lineHeight: "22px"
  }

}