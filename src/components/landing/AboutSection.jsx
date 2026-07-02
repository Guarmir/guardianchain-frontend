export default function AboutSection({ t }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.title}>{t.aboutTitle}</h2>

      <p style={styles.text}>{t.aboutText}</p>
      <p style={styles.text}>{t.aboutText2}</p>
      <p style={styles.text}>{t.aboutText3}</p>
      <p style={styles.text}>{t.aboutText4}</p>

      <div style={styles.grid}>
        {t.trustItems.map((item) => (
          <div key={item} style={styles.card}>
            <span style={styles.check}>✓</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

const styles = {
  section: {
    maxWidth: "980px",
    margin: "80px auto 0",
    padding: "40px 24px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "22px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
  },

  title: {
    fontSize: "32px",
    marginBottom: "24px",
  },

  text: {
    maxWidth: "820px",
    margin: "0 auto 18px",
    lineHeight: "1.7",
    opacity: 0.94,
    fontSize: "16px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginTop: "36px",
  },

  card: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "14px",
    textAlign: "left",
  },

  check: {
    width: "22px",
    height: "22px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#4338ca",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    flexShrink: 0,
  },
}