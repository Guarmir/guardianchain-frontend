import { Link, useSearchParams } from "react-router-dom"
import Footer from "../components/Footer.jsx"
import certificatePreview from "../assets/certificate-preview.png"

export default function LandingPage() {
  const [params] = useSearchParams()

  const langParam = params.get("lang")
  const lang = langParam === "pt" ? "pt" : "en"

  const t = {
    pt: {
      title: "Proteja seu trabalho antes que alguém reivindique autoria.",
      subtitle: "Crie uma prova imutável de propriedade em menos de 1 minuto.",
      note: "Seu arquivo nunca é enviado. Apenas o hash criptográfico é registrado.",

      feature1: "Proteção de autoria",
      feature2: "Prova imutável",
      feature3: "Verificação pública",
      feature4: "Protegido por blockchain",

      priceTitle: "Registro único",
      price: "R$ 19,90",
      pay: "pagamento único",

      register: "Criar prova agora",
      verify: "Verificar certificado",

      secure1: "Pagamento seguro via Stripe",
      secure2: "Certificado gerado imediatamente após o pagamento",
      secure3: "Seu arquivo nunca é enviado para nossos servidores",

      howTitle: "Como funciona",
      howText: "Em poucos passos, você cria uma prova verificável sem enviar seu arquivo.",
      howSteps: [
        {
          icon: "📁",
          title: "Escolha seu arquivo",
          text: "Seu arquivo permanece no seu dispositivo. Nenhum upload é realizado.",
        },
        {
          icon: "🔐",
          title: "Geramos a prova criptográfica",
          text: "Um hash único é criado e vinculado a um registro verificável.",
        },
        {
          icon: "📄",
          title: "Receba seu certificado",
          text: "Baixe o certificado PDF com QR Code e verificação pública.",
        },
      ],

      aboutTitle: "Quem está por trás do GuardianChain?",
      aboutText:
        "O GuardianChain foi criado para fornecer uma infraestrutura acessível, focada em privacidade e verificação independente de provas digitais para criadores, desenvolvedores, profissionais e empresas em todo o mundo.",
      aboutText2:
        "A plataforma foi construída com um princípio simples: seus arquivos devem permanecer sob seu controle.",
      aboutText3:
        "O GuardianChain nunca faz upload ou armazena o arquivo original. Apenas a impressão digital criptográfica (hash) é registrada e vinculada a registros públicos em blockchain.",
      aboutText4:
        "Nosso objetivo é tornar a evidência digital mais acessível, transparente e verificável para a internet moderna.",
      trustItems: [
        "Arquitetura focada em privacidade",
        "Sem upload de arquivos",
        "Verificação independente",
        "Registros públicos em blockchain",
        "Pagamento seguro via Stripe",
      ],

      certificateTitle: "Veja o certificado que você recebe",
      certificateText:
        "Cada registro gera um certificado verificável com hash criptográfico, QR Code e validação pública.",

      useCasesTitle: "Ideal para proteger",
      useCasesText:
        "Use o GuardianChain para criar prova de existência, autoria e integridade de arquivos digitais importantes.",
      useCases: [
        "Conteúdo gerado por IA",
        "Artes e Design",
        "Música e Áudio",
        "Contratos e Documentos",
        "Fotografia",
        "Pesquisas e Ideias",
        "Desenvolvedores e Arquivos-fonte",
        "Propostas e entregas profissionais",
      ],

      switchToPt: "PT",
      switchToEn: "EN",
    },

    en: {
      title: "Protect your work before someone claims it.",
      subtitle: "Create immutable proof of ownership in less than 1 minute.",
      note: "Your file is never uploaded. Only the cryptographic hash is recorded.",

      feature1: "Protect authorship",
      feature2: "Immutable proof",
      feature3: "Public verification",
      feature4: "Blockchain secured",

      priceTitle: "One-time registration",
      price: "US$ 4",
      pay: "one-time payment",

      register: "Create proof now",
      verify: "Verify certificate",

      secure1: "Secure payment powered by Stripe",
      secure2: "Certificate generated immediately after payment",
      secure3: "Your file is never uploaded to our servers",

      howTitle: "How it works",
      howText: "In a few steps, you create verifiable proof without uploading your file.",
      howSteps: [
        {
          icon: "📁",
          title: "Choose your file",
          text: "Your file stays on your device. No upload is performed.",
        },
        {
          icon: "🔐",
          title: "Generate cryptographic proof",
          text: "A unique hash is created and linked to a verifiable record.",
        },
        {
          icon: "📄",
          title: "Receive your certificate",
          text: "Download the PDF certificate with QR Code and public verification.",
        },
      ],

      aboutTitle: "Who is behind GuardianChain?",
      aboutText:
        "GuardianChain was created to provide accessible, privacy-first and independently verifiable digital proof infrastructure for creators, developers, professionals and businesses worldwide.",
      aboutText2:
        "The platform was designed around a simple principle: your files should remain under your control.",
      aboutText3:
        "GuardianChain never uploads or stores the original file. Only the cryptographic fingerprint (hash) is registered and anchored to public blockchain records.",
      aboutText4:
        "Our goal is to make digital evidence more accessible, transparent and independently verifiable for the modern internet.",
      trustItems: [
        "Privacy-first architecture",
        "No file upload",
        "Independent verification",
        "Public blockchain records",
        "Secure payment via Stripe",
      ],

      certificateTitle: "See the certificate you receive",
      certificateText:
        "Each registration generates a verifiable certificate with cryptographic hash, QR Code and public validation.",

      useCasesTitle: "Perfect for protecting",
      useCasesText:
        "Use GuardianChain to create proof of existence, authorship and integrity for important digital files.",
      useCases: [
        "AI-generated content",
        "Artwork & Design",
        "Music & Audio",
        "Contracts & Documents",
        "Photography",
        "Research & Ideas",
        "Developers & Source Files",
        "Professional proposals & deliveries",
      ],

      switchToPt: "PT",
      switchToEn: "EN",
    },
  }[lang]

  return (
    <div style={styles.page}>
      <div style={styles.langSwitch}>
        <Link
          to="/?lang=pt"
          style={{
            ...styles.langLink,
            opacity: lang === "pt" ? 1 : 0.7,
            fontWeight: lang === "pt" ? "700" : "400",
          }}
        >
          {t.switchToPt}
        </Link>

        <span style={styles.langDivider}>|</span>

        <Link
          to="/?lang=en"
          style={{
            ...styles.langLink,
            opacity: lang === "en" ? 1 : 0.7,
            fontWeight: lang === "en" ? "700" : "400",
          }}
        >
          {t.switchToEn}
        </Link>
      </div>

      <h1 style={styles.title}>{t.title}</h1>

      <p style={styles.subtitle}>{t.subtitle}</p>

      <p style={styles.note}>{t.note}</p>

      <div style={styles.features}>
        <span>🔒 {t.feature1}</span>
        <span>⛓ {t.feature2}</span>
        <span>🌐 {t.feature3}</span>
        <span>📄 {t.feature4}</span>
      </div>

      <div style={styles.card}>
        <p style={styles.priceTitle}>{t.priceTitle}</p>

        <h2 style={styles.price}>{t.price}</h2>

        <p>{t.pay}</p>

        <p style={styles.secure}>{t.secure1}</p>
        <p style={styles.secure}>{t.secure2}</p>
        <p style={styles.secure}>{t.secure3}</p>

        <Link to={`/register?lang=${lang}`}>
          <button style={styles.buttonPrimary}>{t.register}</button>
        </Link>

        <Link to={`/verify?lang=${lang}`}>
          <button style={styles.buttonSecondary}>{t.verify}</button>
        </Link>
      </div>

      <section style={styles.howSection}>
        <h2 style={styles.howTitle}>{t.howTitle}</h2>

        <p style={styles.howText}>{t.howText}</p>

        <div style={styles.howGrid}>
          {t.howSteps.map((step, index) => (
            <div key={step.title} style={styles.howCard}>
              <div style={styles.howNumber}>{index + 1}</div>
              <div style={styles.howIcon}>{step.icon}</div>
              <h3 style={styles.howCardTitle}>{step.title}</h3>
              <p style={styles.howCardText}>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.aboutSection}>
        <h2 style={styles.aboutTitle}>{t.aboutTitle}</h2>

        <p style={styles.aboutText}>{t.aboutText}</p>
        <p style={styles.aboutText}>{t.aboutText2}</p>
        <p style={styles.aboutText}>{t.aboutText3}</p>
        <p style={styles.aboutText}>{t.aboutText4}</p>

        <div style={styles.trustGrid}>
          {t.trustItems.map((item) => (
            <div key={item} style={styles.trustCard}>
              <span style={styles.trustCheck}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <div style={styles.certificateSection}>
        <h2 style={styles.certificateTitle}>{t.certificateTitle}</h2>

        <p style={styles.certificateText}>{t.certificateText}</p>

        <img
          src={certificatePreview}
          alt="GuardianChain Certificate Preview"
          style={styles.certificateImage}
        />
      </div>

      <section style={styles.useCasesSection}>
        <h2 style={styles.useCasesTitle}>{t.useCasesTitle}</h2>

        <p style={styles.useCasesText}>{t.useCasesText}</p>

        <div style={styles.useCasesGrid}>
          {t.useCases.map((item) => (
            <div key={item} style={styles.useCaseCard}>
              <span style={styles.useCaseCheck}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <Link to={`/register?lang=${lang}`}>
          <button style={styles.finalCta}>{t.register}</button>
        </Link>
      </section>

      <Footer />
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    textAlign: "center",
    padding: "30px 20px 60px",
    background: "linear-gradient(180deg,#5a60d1,#3b3fa3)",
    color: "white",
  },

  langSwitch: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginBottom: "40px",
  },

  langLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
  },

  langDivider: {
    opacity: 0.8,
  },

  title: {
    fontSize: "42px",
    marginBottom: "20px",
  },

  subtitle: {
    fontSize: "20px",
    marginBottom: "10px",
  },

  note: {
    opacity: 0.9,
    marginBottom: "20px",
  },

  features: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "40px",
  },

  card: {
    background: "#f3f3f3",
    color: "#111",
    maxWidth: "480px",
    margin: "0 auto",
    padding: "30px",
    borderRadius: "14px",
  },

  priceTitle: {
    opacity: 0.8,
  },

  price: {
    fontSize: "42px",
    margin: "10px 0",
  },

  secure: {
    fontSize: "14px",
    marginTop: "6px",
    opacity: 0.9,
  },

  buttonPrimary: {
    width: "100%",
    marginTop: "20px",
    padding: "14px",
    background: "#4b4fbf",
    border: "none",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
  },

  buttonSecondary: {
    width: "100%",
    marginTop: "10px",
    padding: "14px",
    background: "#6366f1",
    border: "none",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
  },

  howSection: {
    maxWidth: "1100px",
    margin: "80px auto 0",
    padding: "20px",
  },

  howTitle: {
    fontSize: "32px",
    marginBottom: "12px",
  },

  howText: {
    maxWidth: "720px",
    margin: "0 auto 40px",
    opacity: 0.92,
    lineHeight: "1.6",
  },

  howGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
  },

  howCard: {
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "20px",
    padding: "28px 22px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
  },

  howNumber: {
    width: "36px",
    height: "36px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#4b4fbf",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    margin: "0 auto 16px",
  },

  howIcon: {
    fontSize: "32px",
    marginBottom: "14px",
  },

  howCardTitle: {
    fontSize: "20px",
    marginBottom: "10px",
  },

  howCardText: {
    opacity: 0.92,
    lineHeight: "1.6",
    fontSize: "15px",
  },

  aboutSection: {
    maxWidth: "980px",
    margin: "80px auto 0",
    padding: "40px 24px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "22px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
  },

  aboutTitle: {
    fontSize: "32px",
    marginBottom: "24px",
  },

  aboutText: {
    maxWidth: "820px",
    margin: "0 auto 18px",
    lineHeight: "1.7",
    opacity: 0.94,
    fontSize: "16px",
  },

  trustGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginTop: "36px",
  },

  trustCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "14px",
    textAlign: "left",
  },

  trustCheck: {
    width: "22px",
    height: "22px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#4338ca",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    flexShrink: 0,
  },

  certificateSection: {
    marginTop: "80px",
    textAlign: "center",
  },

  certificateTitle: {
    fontSize: "32px",
    marginBottom: "14px",
  },

  certificateText: {
    maxWidth: "760px",
    margin: "0 auto 30px",
    opacity: 0.92,
    lineHeight: "1.6",
  },

  certificateImage: {
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

  useCasesSection: {
    maxWidth: "980px",
    margin: "80px auto 0",
    padding: "34px 22px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "22px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
  },

  useCasesTitle: {
    fontSize: "32px",
    margin: "0 0 12px",
  },

  useCasesText: {
    maxWidth: "720px",
    margin: "0 auto 28px",
    opacity: 0.92,
    lineHeight: "1.6",
  },

  useCasesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    marginBottom: "28px",
  },

  useCaseCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textAlign: "left",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "14px",
    color: "#ffffff",
    fontSize: "15px",
  },

  useCaseCheck: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "22px",
    height: "22px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#4b4fbf",
    fontWeight: "800",
    flexShrink: 0,
  },

  finalCta: {
    padding: "15px 24px",
    background: "#ffffff",
    color: "#4338ca",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "15px",
  },
}