export default function DemoVerification({ t }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.title}>{t.verifyTitle}</h2>

      <div style={styles.grid}>
        {t.verifySteps.map((step, index) => (
          <div key={step} style={styles.card}>
            <div style={styles.number}>{index + 1}</div>
            <p style={styles.text}>{step}</p>
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
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "24px",
  },

  title: {
    fontSize: "31px",
    marginBottom: "22px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "14px",
  },

  card: {
    padding: "22px 18px",
    background: "rgba(255,255,255,0.11)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "18px",
  },

  number: {
    width: "38px",
    height: "38px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#4338ca",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 14px",
    fontWeight: "900",
  },

  text: {
    margin: 0,
    lineHeight: "1.5",
    fontWeight: "700",
  },
}