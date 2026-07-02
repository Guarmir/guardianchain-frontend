export default function HowItWorks({ t }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.title}>{t.howTitle}</h2>

      <p style={styles.text}>{t.howText}</p>

      <div style={styles.grid}>
        {t.howSteps.map((step, index) => (
          <div key={step.title} style={styles.card}>
            <div style={styles.number}>{index + 1}</div>
            <div style={styles.icon}>{step.icon}</div>
            <h3 style={styles.cardTitle}>{step.title}</h3>
            <p style={styles.cardText}>{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

const styles = {
  section: {
    maxWidth: "1100px",
    margin: "80px auto 0",
    padding: "20px",
  },

  title: {
    fontSize: "32px",
    marginBottom: "12px",
  },

  text: {
    maxWidth: "720px",
    margin: "0 auto 40px",
    opacity: 0.92,
    lineHeight: "1.6",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "20px",
    padding: "28px 22px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
  },

  number: {
    width: "36px",
    height: "36px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#4b4fbf",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    margin: "0 auto 16px",
  },

  icon: {
    fontSize: "32px",
    marginBottom: "14px",
  },

  cardTitle: {
    fontSize: "20px",
    marginBottom: "10px",
  },

  cardText: {
    opacity: 0.92,
    lineHeight: "1.6",
    fontSize: "15px",
  },
}