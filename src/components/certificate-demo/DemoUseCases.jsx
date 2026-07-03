export default function DemoUseCases({ t }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.title}>{t.useTitle}</h2>

      <p style={styles.text}>{t.useText}</p>

      <div style={styles.grid}>
        {t.useCases.map((item) => (
          <div key={item} style={styles.card}>
            <span style={styles.icon}>✓</span>

            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

const styles = {
  section: {
    marginTop: "34px",
    padding: "34px",
    textAlign: "center",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "24px",
  },

  title: {
    fontSize: "31px",
    marginBottom: "16px",
  },

  text: {
    maxWidth: "760px",
    margin: "0 auto 28px",
    fontSize: "16px",
    lineHeight: "1.7",
    opacity: 0.94,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "14px",
  },

  card: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "15px",
    background: "rgba(255,255,255,0.11)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "15px",
    fontWeight: "700",
    textAlign: "left",
  },

  icon: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    background: "#ffffff",
    color: "#4338ca",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    flexShrink: 0,
  },
}