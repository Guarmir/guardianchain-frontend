export default function CertificateSection({ t, certificatePreview }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.title}>{t.certificateTitle}</h2>

      <p style={styles.text}>{t.certificateText}</p>

      <img
        src={certificatePreview}
        alt="GuardianChain Certificate Preview"
        style={styles.image}
      />
    </section>
  )
}

const styles = {
  section: {
    marginTop: "80px",
    textAlign: "center",
  },

  title: {
    fontSize: "32px",
    marginBottom: "14px",
  },

  text: {
    maxWidth: "760px",
    margin: "0 auto 30px",
    opacity: 0.92,
    lineHeight: "1.6",
  },

  image: {
    width: "100%",
    maxWidth: "620px",
    maxHeight: "520px",
    objectFit: "cover",
    objectPosition: "top",
    borderRadius: "18px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "#ffffff",
  },
}