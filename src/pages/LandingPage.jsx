import { Link, useSearchParams } from "react-router-dom"
import Footer from "../components/Footer.jsx"

export default function LandingPage() {
  const [params] = useSearchParams()

  const langParam = params.get("lang")
  const lang = langParam === "pt" ? "pt" : "en"

  const t = {
    pt: {
      title: "Proteja seu trabalho antes que alguém reivindique autoria.",
      subtitle:
        "Crie uma prova imutável de propriedade em menos de 1 minuto.",
      note: "Seu arquivo nunca é enviado. Apenas o hash criptográfico é registrado.",
      feature1: "Proteção de autoria",
      feature2: "Prova imutável",
      feature3: "Verificação pública",
      feature4: "Protegido por blockchain",
      priceTitle: "Registro único",
      price: "R$ 19,90",
      pay: "pagamento único",
      register: "Registrar prova",
      verify: "Verificar certificado",
      secure1: "Pagamento seguro via Stripe",
      secure2: "Certificado gerado imediatamente após o pagamento",
      secure3: "Seu arquivo nunca é enviado para nossos servidores",
      switchToPt: "PT",
      switchToEn: "EN",
    },
    en: {
      title: "Protect your work before someone claims it.",
      subtitle: "Create immutable proof of ownership in less than 1 minute.",
      note: "Your file is never uploaded. Only the cryptographic hash is recorded.",
      feature1: "Protect authorship",
      feature2: "Immutable proof",
      feature3: "Public verification",
      feature4: "Blockchain secured",
      priceTitle: "One-time registration",
      price: "US$ 4",
      pay: "one-time payment",
      register: "Register proof",
      verify: "Verify certificate",
      secure1: "Secure payment powered by Stripe",
      secure2: "Certificate generated immediately after payment",
      secure3: "Your file is never uploaded to our servers",
      switchToPt: "PT",
      switchToEn: "EN",
    },
  }[lang]

  return (
    <div style={styles.page}>
      <div style={styles.langSwitch}>
        <Link
          to="/?lang=pt"
          style={{
            ...styles.langLink,
            opacity: lang === "pt" ? 1 : 0.7,
            fontWeight: lang === "pt" ? "700" : "400",
          }}
        >
          {t.switchToPt}
        </Link>

        <span style={styles.langDivider}>|</span>

        <Link
          to="/?lang=en"
          style={{
            ...styles.langLink,
            opacity: lang === "en" ? 1 : 0.7,
            fontWeight: lang === "en" ? "700" : "400",
          }}
        >
          {t.switchToEn}
        </Link>
      </div>

      <h1 style={styles.title}>{t.title}</h1>

      <p style={styles.subtitle}>{t.subtitle}</p>

      <p style={styles.note}>{t.note}</p>

      <div style={styles.features}>
        <span>🔒 {t.feature1}</span>
        <span>⛓ {t.feature2}</span>
        <span>🌐 {t.feature3}</span>
        <span>📄 {t.feature4}</span>
      </div>

      <div style={styles.card}>
        <p style={styles.priceTitle}>{t.priceTitle}</p>

        <h2 style={styles.price}>{t.price}</h2>

        <p>{t.pay}</p>

        <p style={styles.secure}>{t.secure1}</p>
        <p style={styles.secure}>{t.secure2}</p>
        <p style={styles.secure}>{t.secure3}</p>

        <Link to={`/register?lang=${lang}`}>
          <button style={styles.buttonPrimary}>{t.register}</button>
        </Link>

        <Link to={`/verify?lang=${lang}`}>
          <button style={styles.buttonSecondary}>{t.verify}</button>
        </Link>
      </div>

      <Footer />
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    textAlign: "center",
    padding: "30px 20px 60px",
    background: "linear-gradient(180deg,#5a60d1,#3b3fa3)",
    color: "white",
  },

  langSwitch: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginBottom: "40px",
  },

  langLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
  },

  langDivider: {
    opacity: 0.8,
  },

  title: {
    fontSize: "42px",
    marginBottom: "20px",
  },

  subtitle: {
    fontSize: "20px",
    marginBottom: "10px",
  },

  note: {
    opacity: 0.9,
    marginBottom: "20px",
  },

  features: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "40px",
  },

  card: {
    background: "#f3f3f3",
    color: "#111",
    maxWidth: "480px",
    margin: "0 auto",
    padding: "30px",
    borderRadius: "14px",
  },

  priceTitle: {
    opacity: 0.8,
  },

  price: {
    fontSize: "42px",
    margin: "10px 0",
  },

  secure: {
    fontSize: "14px",
    marginTop: "6px",
    opacity: 0.9,
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
    background: "#6366f1",
    border: "none",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
  },
}