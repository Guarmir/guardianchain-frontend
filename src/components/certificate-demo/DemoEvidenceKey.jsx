export default function DemoEvidenceKey({ t }) {
  return (
    <section style={styles.section}>
      <span style={styles.badge}>{t.evidenceBadge}</span>

      <h2 style={styles.title}>{t.evidenceTitle}</h2>

      <p style={styles.text}>{t.evidenceText}</p>
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

  badge: {
    display: "inline-block",
    padding: "7px 12px",
    marginBottom: "14px",
    background: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "900",
  },

  title: {
    margin: "0 0 12px",
    fontSize: "32px",
    fontWeight: "900",
  },

  text: {
    maxWidth: "760px",
    margin: "0 auto",
    fontSize: "16px",
    lineHeight: "1.7",
    opacity: 0.94,
  },
}