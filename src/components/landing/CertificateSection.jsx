import { Link } from "react-router-dom"
import certificatePreview from "../../assets/certificate-preview.png"

export default function CertificateSection({ t, lang }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.title}>{t.certificateTitle}</h2>

      <p style={styles.text}>{t.certificateText}</p>

      <div style={styles.previewWrapper}>
        <div style={styles.ribbon}>SAMPLE</div>

        <img
          src={certificatePreview}
          alt="GuardianChain Certificate Preview"
          style={styles.image}
        />
      </div>

      <div style={styles.infoBox}>
        <div style={styles.item}>
          <span style={styles.icon}>✓</span>
          <span>PDF profissional</span>
        </div>

        <div style={styles.item}>
          <span style={styles.icon}>✓</span>
          <span>QR Code verificável</span>
        </div>

        <div style={styles.item}>
          <span style={styles.icon}>✓</span>
          <span>Hash criptográfico</span>
        </div>

        <div style={styles.item}>
          <span style={styles.icon}>✓</span>
          <span>Link permanente</span>
        </div>
      </div>

      <Link
        to={`/certificate-demo?lang=${lang}`}
        style={styles.buttonLink}
      >
        <button style={styles.button}>
          {lang === "pt"
            ? "Ver certificado de exemplo"
            : "View sample certificate"}
        </button>
      </Link>
    </section>
  )
}

const styles = {
  section: {
    maxWidth: "980px",
    margin: "80px auto 0",
    textAlign: "center",
  },

  title: {
    fontSize: "34px",
    marginBottom: "16px",
    fontWeight: "800",
  },

  text: {
    maxWidth: "760px",
    margin: "0 auto 34px",
    opacity: 0.92,
    lineHeight: "1.7",
    fontSize: "17px",
  },

  previewWrapper: {
    position: "relative",
    display: "inline-block",
    marginBottom: "30px",
  },

  ribbon: {
    position: "absolute",
    top: "22px",
    left: "50%",
    transform: "translateX(-50%) rotate(-12deg)",
    background: "rgba(220,38,38,0.88)",
    color: "#ffffff",
    padding: "10px 34px",
    borderRadius: "10px",
    fontWeight: "900",
    letterSpacing: "2px",
    fontSize: "22px",
    zIndex: 2,
    pointerEvents: "none",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
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

  infoBox: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "14px",
    margin: "0 auto 32px",
    maxWidth: "820px",
  },

  item: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    justifyContent: "center",
    padding: "14px",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "14px",
    fontWeight: "700",
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

  buttonLink: {
    textDecoration: "none",
  },

  button: {
    padding: "16px 30px",
    background: "#ffffff",
    color: "#4338ca",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "900",
    fontSize: "16px",
    boxShadow: "0 14px 34px rgba(0,0,0,0.22)",
  },
}