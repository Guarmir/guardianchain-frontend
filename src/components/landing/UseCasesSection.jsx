export default function UseCasesSection({ t }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.title}>{t.useCasesTitle}</h2>

      <p style={styles.text}>{t.useCasesText}</p>

      <div style={styles.grid}>
        {t.useCases.map((item) => (
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
    padding: "34px 22px",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "22px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
  },

  title: {
    fontSize: "32px",
    margin: "0 0 12px",
  },

  text: {
    maxWidth: "720px",
    margin: "0 auto 28px",
    opacity: 0.92,
    lineHeight: "1.6",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
  },

  card: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textAlign: "left",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "14px",
    color: "#ffffff",
    fontSize: "15px",
  },

  check: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "22px",
    height: "22px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#4b4fbf",
    fontWeight: "800",
    flexShrink: 0,
  },
}