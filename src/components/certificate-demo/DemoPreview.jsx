import CertificateSamplePreview from "./CertificateSamplePreview.jsx"

export default function DemoPreview({
  lang,
}) {
  const ribbon =
    lang === "pt"
      ? "EXEMPLO"
      : "SAMPLE"

  return (
    <section style={styles.section}>
      <div style={styles.previewWrapper}>
        <div style={styles.ribbon}>
          {ribbon}
        </div>

        <CertificateSamplePreview
          lang={lang}
        />
      </div>
    </section>
  )
}

const styles = {
  section: {
    marginTop: "34px",
    textAlign: "center",
    padding: "34px",
    background:
      "rgba(255,255,255,0.10)",
    border:
      "1px solid rgba(255,255,255,0.16)",
    borderRadius: "26px",
    boxShadow:
      "0 22px 55px rgba(0,0,0,0.20)",
  },

  previewWrapper: {
    width: "100%",
    maxWidth: "620px",
    margin: "0 auto",
  },

  ribbon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 14px",
    padding: "9px 24px",
    borderRadius: "10px",
    background:
      "rgba(220,38,38,0.94)",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "900",
    letterSpacing: "2px",
    transform: "rotate(-3deg)",
    boxShadow:
      "0 10px 24px rgba(0,0,0,0.22)",
  },
}