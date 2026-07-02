export default function FounderSection({ t, linkedinUrl }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.title}>{t.founderTitle}</h2>

      <p style={styles.text}>{t.founderText}</p>

      <p style={styles.text}>{t.founderText2}</p>

      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={styles.button}
      >
        {t.founderButton}
      </a>
    </section>
  )
}

const styles = {
  section: {
    maxWidth: "980px",
    margin: "80px auto 0",
    padding: "40px 24px",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "22px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
  },

  title: {
    fontSize: "32px",
    marginBottom: "18px",
  },

  text: {
    maxWidth: "780px",
    margin: "0 auto 18px",
    lineHeight: "1.7",
    opacity: 0.94,
    fontSize: "16px",
  },

  button: {
    display: "inline-block",
    marginTop: "18px",
    padding: "14px 22px",
    background: "#ffffff",
    color: "#4338ca",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "800",
    transition: "0.2s",
  },
}