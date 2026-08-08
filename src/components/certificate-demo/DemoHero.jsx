import { Link } from "react-router-dom"

export default function DemoHero({ t, lang }) {
  return (
    <section style={styles.hero}>
      <span style={styles.badge}>{t.badge}</span>

      <h1 style={styles.title}>{t.title}</h1>

      <p style={styles.subtitle}>{t.subtitle}</p>

      <div style={styles.heroActions}>
        <Link to={`/verify?lang=${lang}`} style={styles.actionLink}>
          <button style={styles.verifyButton}>{t.verify}</button>
        </Link>
      </div>
    </section>
  )
}

const styles = {
  hero: {
    textAlign: "center",
    marginBottom: "52px",
  },

  badge: {
    display: "inline-block",
    padding: "8px 14px",
    marginBottom: "18px",
    background: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: "800",
  },

  title: {
    maxWidth: "920px",
    margin: "0 auto 18px",
    fontSize: "52px",
    lineHeight: "1.08",
    fontWeight: "900",
    letterSpacing: "-1.3px",
  },

  subtitle: {
    maxWidth: "820px",
    margin: "0 auto",
    fontSize: "18px",
    lineHeight: "1.6",
    opacity: 0.94,
  },

  heroActions: {
    display: "flex",
    justifyContent: "center",
    marginTop: "28px",
  },

  actionLink: {
    textDecoration: "none",
  },

  verifyButton: {
    padding: "15px 26px",
    background: "rgba(255,255,255,0.14)",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.22)",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "900",
    fontSize: "15px",
  },
}