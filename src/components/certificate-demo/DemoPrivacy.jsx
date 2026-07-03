export default function DemoPrivacy({ t }) {
  return (
    <section style={styles.section}>
      <div>
        <h2 style={styles.title}>{t.privacyTitle}</h2>

        <p style={styles.text}>{t.privacyText}</p>
      </div>

      <div style={styles.iconBox}>🔒</div>
    </section>
  )
}

const styles = {
  section: {
    marginTop: "34px",
    padding: "34px",
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "24px",
    alignItems: "center",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "24px",
  },

  title: {
    fontSize: "31px",
    marginBottom: "16px",
  },

  text: {
    fontSize: "16px",
    lineHeight: "1.7",
    opacity: 0.94,
  },

  iconBox: {
    width: "94px",
    height: "94px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.14)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "44px",
  },
}