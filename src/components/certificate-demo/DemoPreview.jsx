import certificatePreview from "../../assets/certificate-preview.png"

export default function DemoPreview() {
  return (
    <section style={styles.section}>
      <div style={styles.imageWrapper}>
        <div style={styles.ribbon}>SAMPLE</div>

        <img
          src={certificatePreview}
          alt="GuardianChain Certificate Preview"
          style={styles.image}
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
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "26px",
    boxShadow: "0 22px 55px rgba(0,0,0,0.20)",
  },

  imageWrapper: {
    position: "relative",
    display: "inline-block",
  },

  ribbon: {
    position: "absolute",
    top: "22px",
    left: "50%",
    transform: "translateX(-50%) rotate(-10deg)",
    zIndex: 2,
    padding: "12px 34px",
    borderRadius: "12px",
    background: "rgba(220,38,38,0.88)",
    color: "#ffffff",
    fontSize: "26px",
    fontWeight: "900",
    letterSpacing: "3px",
    boxShadow: "0 14px 34px rgba(0,0,0,0.25)",
    pointerEvents: "none",
  },

  image: {
    width: "100%",
    maxWidth: "520px",
    maxHeight: "680px",
    objectFit: "cover",
    objectPosition: "top",
    borderRadius: "18px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.36)",
    border: "1px solid rgba(255,255,255,0.16)",
    background: "#ffffff",
  },
}