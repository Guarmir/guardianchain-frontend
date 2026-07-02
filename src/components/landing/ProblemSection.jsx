import { Link } from "react-router-dom"

export default function ProblemSection({ t, lang }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.title}>{t.problemTitle}</h2>

      <div style={styles.grid}>
        {t.problemItems.map((item) => (
          <div key={item} style={styles.card}>
            <span style={styles.check}>✓</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      <h3 style={styles.createdFor}>{t.problemConclusion}</h3>

      <p style={styles.text}>{t.problemText}</p>

      <Link to={`/register?lang=${lang}`} style={styles.link}>
        <button style={styles.button}>{t.register}</button>
      </Link>
    </section>
  )
}

const styles = {
  section: {
    maxWidth: "980px",
    margin: "80px auto 0",
    padding: "42px 24px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "24px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
  },

  title: {
    fontSize: "32px",
    marginBottom: "26px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "14px",
    marginBottom: "32px",
  },

  card: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textAlign: "left",
    padding: "16px 18px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "14px",
    color: "#ffffff",
    fontSize: "15px",
    lineHeight: "1.5",
  },

  check: {
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

  createdFor: {
    fontSize: "26px",
    margin: "8px 0 12px",
  },

  text: {
    maxWidth: "720px",
    margin: "0 auto 28px",
    opacity: 0.94,
    lineHeight: "1.7",
    fontSize: "16px",
  },

  link: {
    display: "inline-block",
    textDecoration: "none",
  },

  button: {
    padding: "15px 26px",
    background: "#ffffff",
    color: "#4338ca",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "900",
    fontSize: "15px",
  },
}