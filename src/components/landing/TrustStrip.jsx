export default function TrustStrip({ lang }) {
  const content = {
    pt: [
      "Seus arquivos nunca são enviados para nossos servidores.",
      "Verificação pública disponível a qualquer momento.",
      "Certificado digital permanente e verificável.",
      "Criado para proteger antes de compartilhar.",
    ],
    en: [
      "Your files are never uploaded to our servers.",
      "Public verification available anytime.",
      "Permanent and verifiable digital certificate.",
      "Built to protect before you share.",
    ],
  }

  const items = content[lang] || content.en

  return (
    <section style={styles.strip}>
      {items.map((item, index) => (
        <div key={item} style={styles.item}>
          <span style={styles.icon}>{["🔒", "🌎", "🛡️", "✅"][index]}</span>
          <span>{item}</span>
        </div>
      ))}
    </section>
  )
}

const styles = {
  strip: {
    maxWidth: "1080px",
    margin: "0 auto 50px",
    padding: "18px 20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "18px",
    boxShadow: "0 18px 45px rgba(0,0,0,0.16)",
  },

  item: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    fontSize: "14px",
    fontWeight: "700",
    lineHeight: "1.4",
  },

  icon: {
    fontSize: "18px",
    flexShrink: 0,
  },
}