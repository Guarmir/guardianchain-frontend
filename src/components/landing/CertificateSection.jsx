import {
  Link,
} from "react-router-dom"

import CertificateSamplePreview from "../certificate-demo/CertificateSamplePreview.jsx"

export default function CertificateSection({
  t,
  lang,
}) {
  const labels =
    lang === "pt"
      ? {
          ribbon: "EXEMPLO",
          pdf: "PDF profissional",
          qr: "QR Code verificável",
          hash: "Hash criptográfico",
          link: "Link permanente",
          button:
            "Ver certificado de exemplo",
        }
      : {
          ribbon: "SAMPLE",
          pdf: "Professional PDF",
          qr: "Verifiable QR Code",
          hash: "Cryptographic hash",
          link: "Permanent link",
          button:
            "View sample certificate",
        }

  return (
    <section style={styles.section}>
      <h2 style={styles.title}>
        {t.certificateTitle}
      </h2>

      <p style={styles.text}>
        {t.certificateText}
      </p>

      <div style={styles.previewWrapper}>
        <div style={styles.ribbon}>
          {labels.ribbon}
        </div>

        <CertificateSamplePreview
          lang={lang}
          compact
        />
      </div>

      <div style={styles.infoBox}>
        <div style={styles.item}>
          <span style={styles.icon}>
            ✓
          </span>

          <span>
            {labels.pdf}
          </span>
        </div>

        <div style={styles.item}>
          <span style={styles.icon}>
            ✓
          </span>

          <span>
            {labels.qr}
          </span>
        </div>

        <div style={styles.item}>
          <span style={styles.icon}>
            ✓
          </span>

          <span>
            {labels.hash}
          </span>
        </div>

        <div style={styles.item}>
          <span style={styles.icon}>
            ✓
          </span>

          <span>
            {labels.link}
          </span>
        </div>
      </div>

      <Link
        to={`/certificate-demo?lang=${lang}`}
        style={styles.buttonLink}
      >
        <button style={styles.button}>
          {labels.button}
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
    width: "100%",
    maxWidth: "620px",
    maxHeight: "600px",
    overflow: "hidden",
    margin: "0 auto 30px",
    borderRadius: "18px",
  },

  ribbon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 14px",
    padding: "9px 24px",
    background:
      "rgba(220,38,38,0.94)",
    color: "#ffffff",
    borderRadius: "10px",
    fontWeight: "900",
    letterSpacing: "2px",
    fontSize: "16px",
    transform: "rotate(-3deg)",
    boxShadow:
      "0 10px 24px rgba(0,0,0,0.22)",
  },

  infoBox: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
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
    background:
      "rgba(255,255,255,0.10)",
    border:
      "1px solid rgba(255,255,255,0.15)",
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
    boxShadow:
      "0 14px 34px rgba(0,0,0,0.22)",
  },
}