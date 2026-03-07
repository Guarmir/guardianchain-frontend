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

      <div style={styles.featuresTop}>

        <div>🔒 {t("landing.private")}</div>
        <div>⛓ {t("landing.blockchain")}</div>
        <div>🌐 {t("landing.verify")}</div>
        <div>⏱ {t("landing.proof")}</div>

      </div>

      <div style={styles.card}>

        <div style={styles.plan}>
          Registro único
        </div>

        <div style={styles.price}>
          US$ 9
        </div>

        <div style={styles.priceDescription}>
          pagamento único
        </div>

        <button
          style={styles.button}
          onClick={() => navigate("/register")}
        >
          Registrar prova
        </button>

        <button
          style={styles.verifyButton}
          onClick={() => navigate("/verify")}
        >
          Verificar certificado
        </button>

      </div>

      <div style={styles.featuresBottom}>

        <p>✔ Registro permanente na blockchain</p>
        <p>✔ Certificado verificável</p>
        <p>✔ Arquivo nunca enviado</p>

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
    paddingBottom: "80px"
  },

  logo: {
    width: "160px",
    marginBottom: "40px"
  },

  title: {
    fontSize: "44px",
    textAlign: "center",
    maxWidth: "800px",
    marginBottom: "20px"
  },

  subtitle: {
    fontSize: "20px",
    textAlign: "center",
    maxWidth: "700px",
    marginBottom: "10px"
  },

  description: {
    fontSize: "15px",
    opacity: 0.9,
    textAlign: "center",
    marginBottom: "30px"
  },

  featuresTop: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
    marginBottom: "40px",
    fontSize: "16px"
  },

  card: {
    background: "white",
    color: "#333",
    padding: "40px",
    borderRadius: "14px",
    width: "340px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
    marginBottom: "30px"
  },

  plan: {
    fontSize: "14px",
    marginBottom: "10px",
    opacity: 0.8
  },

  price: {
    fontSize: "52px",
    fontWeight: "bold",
    marginBottom: "6px"
  },

  priceDescription: {
    fontSize: "14px",
    marginBottom: "24px"
  },

  button: {
    background: "#3949ab",
    color: "white",
    border: "none",
    padding: "14px 28px",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
    marginBottom: "12px"
  },

  verifyButton: {
    background: "transparent",
    border: "1px solid #3949ab",
    color: "#3949ab",
    padding: "12px 28px",
    borderRadius: "8px",
    fontSize: "15px",
    cursor: "pointer",
    width: "100%"
  },

  featuresBottom: {
    fontSize: "14px",
    opacity: 0.9,
    textAlign: "center",
    lineHeight: "26px"
  }

}