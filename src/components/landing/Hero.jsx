import { Link } from "react-router-dom"

export default function Hero({ t, lang }) {
  return (
    <>
      <h1 style={styles.title}>{t.title}</h1>

      <p style={styles.subtitle}>{t.subtitle}</p>

      <p style={styles.note}>{t.note}</p>

      <div style={styles.features}>
        <span>🔒 {t.feature1}</span>
        <span>✅ {t.feature2}</span>
        <span>🌐 {t.feature3}</span>
        <span>🛡️ {t.feature4}</span>
      </div>

      <section style={styles.problemBox}>
        <h2 style={styles.problemTitle}>{t.problemTitle}</h2>

        <div style={styles.problemGrid}>
          {t.problemItems.map((item) => (
            <div key={item} style={styles.problemItem}>
              <span style={styles.problemCheck}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <Link to={`/register?lang=${lang}`} style={styles.heroCtaLink}>
          <button style={styles.heroCta}>{t.register}</button>
        </Link>
      </section>

      <div style={styles.card}>
        <p style={styles.priceTitle}>{t.priceTitle}</p>

        <h2 style={styles.price}>{t.price}</h2>

        <p>{t.pay}</p>

        <p style={styles.secure}>✓ {t.secure1}</p>
        <p style={styles.secure}>✓ {t.secure2}</p>
        <p style={styles.secure}>✓ {t.secure3}</p>
        <p style={styles.secure}>✓ {t.secure4}</p>

        <Link to={`/register?lang=${lang}`} style={styles.fullWidthLink}>
          <button style={styles.buttonPrimary}>{t.register}</button>
        </Link>

        <Link to={`/verify?lang=${lang}`} style={styles.fullWidthLink}>
          <button style={styles.buttonSecondary}>{t.verify}</button>
        </Link>
      </div>
    </>
  )
}

const styles = {
  title: {
    fontSize: "54px",
    fontWeight: "800",
    lineHeight: "1.1",
    marginBottom: "20px",
  },

  subtitle: {
    fontSize: "18px",
    marginBottom: "10px",
    maxWidth: "900px",
    marginLeft: "auto",
    marginRight: "auto",
    lineHeight: "1.5",
  },

  note: {
    opacity: 0.95,
    marginBottom: "20px",
    fontWeight: "600",
  },

  features: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "34px",
  },

  problemBox: {
    maxWidth: "900px",
    margin: "0 auto 44px",
    padding: "30px 24px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "22px",
    boxShadow: "0 20px 45px rgba(0,0,0,0.18)",
  },

  problemTitle: {
    fontSize: "28px",
    margin: "0 0 22px",
  },

  problemGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "14px",
    marginBottom: "24px",
  },

  problemItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textAlign: "left",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "14px",
    fontSize: "15px",
  },

  problemCheck: {
    width: "22px",
    height: "22px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#4338ca",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    flexShrink: 0,
  },

  heroCtaLink: {
    display: "inline-block",
    textDecoration: "none",
  },

  heroCta: {
    padding: "15px 28px",
    background: "#ffffff",
    color: "#4338ca",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "900",
    fontSize: "16px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
  },

  card: {
    background: "#ffffff",
    color: "#111",
    maxWidth: "480px",
    margin: "0 auto",
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
    border: "1px solid rgba(255,255,255,0.2)",
  },

  priceTitle: {
    opacity: 0.9,
    fontWeight: "700",
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

  fullWidthLink: {
    display: "block",
    width: "100%",
    textDecoration: "none",
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
    fontWeight: "700",
    fontSize: "16px",
    boxShadow: "0 10px 25px rgba(75,79,191,0.4)",
    transition: "0.2s",
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
    fontWeight: "700",
  },
}