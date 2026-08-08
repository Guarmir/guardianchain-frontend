export default function DemoCTA({ t }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.title}>{t.finalTitle}</h2>

      <p style={styles.text}>{t.finalText}</p>
    </section>
  )
}

const styles = {
  section: {
    marginTop: "34px",
    padding: "42px 26px",
    textAlign: "center",
    background: "rgba(255,255,255,0.13)",
    border: "1px solid rgba(255,255,255,0.20)",
    borderRadius: "26px",
    boxShadow: "0 22px 55px rgba(0,0,0,0.20)",
  },

  title: {
    maxWidth: "760px",
    margin: "0 auto 14px",
    fontSize: "34px",
    lineHeight: "1.15",
    fontWeight: "900",
  },

  text: {
    maxWidth: "660px",
    margin: "0 auto",
    lineHeight: "1.6",
    opacity: 0.94,
    fontSize: "16px",
  },
}