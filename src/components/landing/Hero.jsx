export default function Hero({ lang }) {
  const content = {
    pt: {
      title:
        "Prove que o que você criou é seu — antes que alguém diga o contrário.",
      subtitle:
        "Crie uma prova digital simples, privada e verificável para proteger arquivos, ideias, documentos e trabalhos antes de compartilhar.",
      features: [
        "Seu arquivo permanece privado",
        "Registro permanente e verificável",
        "Verificação pública",
        "Simples e seguro",
      ],
      time: "⚡ Leva menos de 1 minuto",
    },

    en: {
      title:
        "Prove that what you created is yours — before someone says otherwise.",
      subtitle:
        "Create a simple, private and verifiable digital proof to protect files, ideas, documents and work before sharing them.",
      features: [
        "Your file stays private",
        "Permanent and verifiable record",
        "Public verification",
        "Simple and secure",
      ],
      time: "⚡ Takes less than 1 minute",
    },
  }

  const t = content[lang] || content.en

  return (
    <section style={styles.hero}>
      <h1 style={styles.title}>{t.title}</h1>

      <p style={styles.subtitle}>{t.subtitle}</p>

      <div style={styles.features}>
        <span>🔒 {t.features[0]}</span>
        <span>✅ {t.features[1]}</span>
        <span>🌎 {t.features[2]}</span>
        <span>🛡️ {t.features[3]}</span>
      </div>

      <p style={styles.timeText}>{t.time}</p>
    </section>
  )
}

const styles = {
  hero: {
    maxWidth: "1040px",
    margin: "0 auto",
    padding: "30px 10px 50px",
    textAlign: "center",
  },

  title: {
    maxWidth: "980px",
    margin: "0 auto 22px",
    fontSize: "56px",
    fontWeight: "900",
    lineHeight: "1.08",
    letterSpacing: "-1.6px",
  },

  subtitle: {
    maxWidth: "780px",
    margin: "0 auto 26px",
    fontSize: "19px",
    lineHeight: "1.6",
    opacity: 0.94,
  },

  features: {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap",
    marginBottom: "18px",
    fontSize: "15px",
    fontWeight: "700",
  },

  timeText: {
    margin: "0",
    fontSize: "15px",
    fontWeight: "800",
    opacity: 0.96,
  },
}