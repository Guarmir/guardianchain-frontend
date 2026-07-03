export default function DemoAnatomy({ t }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.title}>{t.anatomyTitle}</h2>

      <p style={styles.text}>{t.anatomyText}</p>

      <div style={styles.grid}>
        {t.anatomyItems.map((item) => (
          <div key={item.number} style={styles.card}>
            <span style={styles.number}>{item.number}</span>

            <div>
              <h3 style={styles.cardTitle}>{item.title}</h3>
              <p style={styles.cardText}>{item.text}</p>
            </div>
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
    textAlign: "left",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "24px",
  },

  title: {
    fontSize: "31px",
    margin: "0 0 16px",
  },

  text: {
    fontSize: "16px",
    lineHeight: "1.7",
    opacity: 0.94,
    margin: "0 0 24px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "14px",
  },

  card: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    padding: "16px",
    background: "rgba(255,255,255,0.11)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "16px",
  },

  number: {
    minWidth: "42px",
    height: "42px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#4338ca",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "13px",
    flexShrink: 0,
  },

  cardTitle: {
    margin: "0 0 6px",
    fontSize: "17px",
  },

  cardText: {
    margin: 0,
    lineHeight: "1.55",
    opacity: 0.9,
    fontSize: "14px",
  },
}