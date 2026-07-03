import { Link, useSearchParams } from "react-router-dom"
import Footer from "../components/Footer.jsx"
import certificatePreview from "../assets/certificate-preview.png"

export default function CertificateDemo() {
  const [params] = useSearchParams()

  const langParam = params.get("lang")
  const lang = langParam === "pt" ? "pt" : "en"

  const content = {
    pt: {
      back: "← Voltar para a página inicial",
      badge: "Demonstração do certificado",
      title: "Veja exatamente o que você recebe",
      subtitle:
        "Entenda como o certificado GuardianChain ajuda a comprovar a existência, a integridade e a data de criação de um arquivo digital.",
      cta: "Criar minha prova digital",
      verify: "Verificar certificado",

      anatomyTitle: "Anatomia do certificado",
      anatomyText:
        "Cada campo do certificado foi pensado para facilitar a conferência, o compartilhamento e a verificação pública da sua prova digital.",
      anatomyItems: [
        {
          number: "01",
          title: "Nome do arquivo",
          text: "Ajuda a identificar qual arquivo foi registrado.",
        },
        {
          number: "02",
          title: "Data e hora",
          text: "Mostra quando a prova digital foi criada.",
        },
        {
          number: "03",
          title: "Identificador exclusivo",
          text: "Facilita localizar e reconhecer o registro.",
        },
        {
          number: "04",
          title: "Hash criptográfico",
          text: "Funciona como uma impressão digital única do arquivo.",
        },
        {
          number: "05",
          title: "QR Code",
          text: "Abre rapidamente a página pública de verificação.",
        },
        {
          number: "06",
          title: "Link permanente",
          text: "Permite verificar o certificado mesmo sem o QR Code.",
        },
      ],

      useTitle: "Quando esse certificado pode ajudar?",
      useText:
        "Use o certificado como uma camada adicional de prova antes de compartilhar arquivos importantes.",
      useCases: [
        "Projetos enviados a clientes",
        "Contratos e documentos",
        "Conteúdo gerado por IA",
        "Código-fonte",
        "Fotografias",
        "Designs e artes",
        "Músicas e áudios",
        "Pesquisas e ideias",
      ],

      verifyTitle: "Como verificar",
      verifySteps: [
        "Abra o QR Code ou o link permanente",
        "Acesse a página pública de verificação",
        "Confira os dados do certificado",
        "Compare a impressão digital do arquivo",
      ],

      privacyTitle: "Seu arquivo nunca aparece aqui",
      privacyText:
        "O GuardianChain não armazena o conteúdo do seu arquivo. A prova é criada usando apenas uma impressão digital criptográfica, mantendo o documento original sob seu controle.",

      evidenceTitle: "Evidence Key™",
      evidenceBadge: "Em breve",
      evidenceText:
        "Um identificador simples para localizar, compartilhar e verificar sua prova digital sem depender de códigos longos.",

      finalTitle: "Proteja seus arquivos antes de compartilhá-los",
      finalText:
        "Crie uma prova digital simples, privada e verificável em poucos minutos.",
    },

    en: {
      back: "← Back to homepage",
      badge: "Certificate demonstration",
      title: "See exactly what you receive",
      subtitle:
        "Understand how the GuardianChain certificate helps prove the existence, integrity and creation date of a digital file.",
      cta: "Create my digital proof",
      verify: "Verify certificate",

      anatomyTitle: "Certificate anatomy",
      anatomyText:
        "Each certificate field is designed to make your digital proof easier to review, share and publicly verify.",
      anatomyItems: [
        {
          number: "01",
          title: "File name",
          text: "Helps identify which file was registered.",
        },
        {
          number: "02",
          title: "Date and time",
          text: "Shows when the digital proof was created.",
        },
        {
          number: "03",
          title: "Unique identifier",
          text: "Makes it easier to locate and recognize the record.",
        },
        {
          number: "04",
          title: "Cryptographic hash",
          text: "Works like a unique fingerprint of the file.",
        },
        {
          number: "05",
          title: "QR Code",
          text: "Quickly opens the public verification page.",
        },
        {
          number: "06",
          title: "Permanent link",
          text: "Allows certificate verification even without the QR Code.",
        },
      ],

      useTitle: "When can this certificate help?",
      useText:
        "Use the certificate as an additional proof layer before sharing important files.",
      useCases: [
        "Projects sent to clients",
        "Contracts and documents",
        "AI-generated content",
        "Source code",
        "Photography",
        "Designs and artwork",
        "Music and audio",
        "Research and ideas",
      ],

      verifyTitle: "How verification works",
      verifySteps: [
        "Open the QR Code or permanent link",
        "Access the public verification page",
        "Review the certificate data",
        "Compare the file fingerprint",
      ],

      privacyTitle: "Your file never appears here",
      privacyText:
        "GuardianChain does not store your file content. The proof is created using only a cryptographic fingerprint, keeping the original document under your control.",

      evidenceTitle: "Evidence Key™",
      evidenceBadge: "Coming soon",
      evidenceText:
        "A simple identifier to locate, share and verify your digital proof without relying on long technical codes.",

      finalTitle: "Protect your files before sharing them",
      finalText:
        "Create a simple, private and verifiable digital proof in just a few minutes.",
    },
  }

  const t = content[lang] || content.en

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <Link to={`/?lang=${lang}`} style={styles.backLink}>
          {t.back}
        </Link>

        <div style={styles.langSwitch}>
          <Link
            to="/certificate-demo?lang=pt"
            style={{
              ...styles.langLink,
              opacity: lang === "pt" ? 1 : 0.7,
              fontWeight: lang === "pt" ? "800" : "500",
            }}
          >
            PT
          </Link>

          <span style={styles.langDivider}>|</span>

          <Link
            to="/certificate-demo?lang=en"
            style={{
              ...styles.langLink,
              opacity: lang === "en" ? 1 : 0.7,
              fontWeight: lang === "en" ? "800" : "500",
            }}
          >
            EN
          </Link>
        </div>
      </div>

      <main style={styles.main}>
        <section style={styles.hero}>
          <span style={styles.badge}>{t.badge}</span>
          <h1 style={styles.title}>{t.title}</h1>
          <p style={styles.subtitle}>{t.subtitle}</p>

          <div style={styles.heroButtons}>
            <Link to={`/register?lang=${lang}`} style={styles.ctaLink}>
              <button style={styles.primaryButton}>{t.cta}</button>
            </Link>

            <Link to={`/verify?lang=${lang}`} style={styles.ctaLink}>
              <button style={styles.secondaryButton}>{t.verify}</button>
            </Link>
          </div>
        </section>

        <section style={styles.previewSection}>
          <div style={styles.imageWrapper}>
            <div style={styles.sampleRibbon}>SAMPLE</div>

            <img
              src={certificatePreview}
              alt="GuardianChain Certificate Preview"
              style={styles.image}
            />
          </div>

          <div style={styles.anatomyBox}>
            <h2 style={styles.sectionTitle}>{t.anatomyTitle}</h2>
            <p style={styles.text}>{t.anatomyText}</p>

            <div style={styles.anatomyGrid}>
              {t.anatomyItems.map((item) => (
                <div key={item.number} style={styles.anatomyCard}>
                  <span style={styles.number}>{item.number}</span>
                  <div>
                    <h3 style={styles.cardTitle}>{item.title}</h3>
                    <p style={styles.cardText}>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={styles.sectionBox}>
          <h2 style={styles.sectionTitle}>{t.useTitle}</h2>
          <p style={styles.textCenter}>{t.useText}</p>

          <div style={styles.useGrid}>
            {t.useCases.map((item) => (
              <div key={item} style={styles.useCard}>
                <span style={styles.check}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.stepsSection}>
          <h2 style={styles.sectionTitle}>{t.verifyTitle}</h2>

          <div style={styles.stepsGrid}>
            {t.verifySteps.map((step, index) => (
              <div key={step} style={styles.stepCard}>
                <div style={styles.stepNumber}>{index + 1}</div>
                <p style={styles.stepText}>{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.privacySection}>
          <div>
            <h2 style={styles.sectionTitle}>{t.privacyTitle}</h2>
            <p style={styles.text}>{t.privacyText}</p>
          </div>

          <div style={styles.privacyIcon}>🔒</div>
        </section>

        <section style={styles.evidenceSection}>
          <span style={styles.evidenceBadge}>{t.evidenceBadge}</span>
          <h2 style={styles.evidenceTitle}>{t.evidenceTitle}</h2>
          <p style={styles.textCenter}>{t.evidenceText}</p>
        </section>

        <section style={styles.finalCta}>
          <h2 style={styles.finalTitle}>{t.finalTitle}</h2>
          <p style={styles.finalText}>{t.finalText}</p>

          <Link to={`/register?lang=${lang}`} style={styles.ctaLink}>
            <button style={styles.finalButton}>{t.cta}</button>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "34px 20px 70px",
    background:
      "linear-gradient(180deg,#6366f1 0%, #4f46e5 45%, #312e81 100%)",
    color: "white",
  },

  topBar: {
    maxWidth: "1180px",
    margin: "0 auto 44px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "18px",
    flexWrap: "wrap",
  },

  backLink: {
    color: "white",
    textDecoration: "none",
    fontWeight: "800",
    opacity: 0.94,
  },

  langSwitch: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  langLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
  },

  langDivider: {
    opacity: 0.8,
  },

  main: {
    maxWidth: "1180px",
    margin: "0 auto",
  },

  hero: {
    textAlign: "center",
    marginBottom: "52px",
  },

  badge: {
    display: "inline-block",
    padding: "8px 14px",
    marginBottom: "18px",
    background: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: "800",
  },

  title: {
    maxWidth: "920px",
    margin: "0 auto 18px",
    fontSize: "52px",
    lineHeight: "1.08",
    fontWeight: "900",
    letterSpacing: "-1.3px",
  },

  subtitle: {
    maxWidth: "820px",
    margin: "0 auto",
    fontSize: "18px",
    lineHeight: "1.6",
    opacity: 0.94,
  },

  heroButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap",
    marginTop: "28px",
  },

  ctaLink: {
    textDecoration: "none",
  },

  primaryButton: {
    padding: "15px 26px",
    background: "#ffffff",
    color: "#4338ca",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "900",
    fontSize: "15px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
  },

  secondaryButton: {
    padding: "15px 26px",
    background: "rgba(255,255,255,0.14)",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.22)",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "900",
    fontSize: "15px",
  },

  previewSection: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px",
    alignItems: "center",
    padding: "34px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "26px",
    boxShadow: "0 22px 55px rgba(0,0,0,0.2)",
  },

  imageWrapper: {
    position: "relative",
    textAlign: "center",
  },

  sampleRibbon: {
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
    maxWidth: "500px",
    maxHeight: "640px",
    objectFit: "cover",
    objectPosition: "top",
    borderRadius: "18px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.36)",
    border: "1px solid rgba(255,255,255,0.16)",
    background: "#ffffff",
  },

  anatomyBox: {
    textAlign: "left",
  },

  sectionTitle: {
    fontSize: "31px",
    margin: "0 0 16px",
  },

  text: {
    fontSize: "16px",
    lineHeight: "1.7",
    opacity: 0.94,
    margin: "0 0 24px",
  },

  textCenter: {
    maxWidth: "760px",
    margin: "0 auto 28px",
    fontSize: "16px",
    lineHeight: "1.7",
    opacity: 0.94,
    textAlign: "center",
  },

  anatomyGrid: {
    display: "grid",
    gap: "13px",
  },

  anatomyCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    padding: "15px",
    background: "rgba(255,255,255,0.11)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "16px",
  },

  number: {
    minWidth: "42px",
    height: "42px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#4338ca",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "13px",
    flexShrink: 0,
  },

  cardTitle: {
    margin: "0 0 6px",
    fontSize: "17px",
  },

  cardText: {
    margin: 0,
    lineHeight: "1.55",
    opacity: 0.9,
    fontSize: "14px",
  },

  sectionBox: {
    marginTop: "34px",
    padding: "34px",
    textAlign: "center",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "24px",
  },

  useGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "13px",
  },

  useCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.11)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "14px",
    fontWeight: "700",
    textAlign: "left",
  },

  check: {
    width: "22px",
    height: "22px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#4338ca",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    flexShrink: 0,
  },

  stepsSection: {
    marginTop: "34px",
    padding: "34px",
    textAlign: "center",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "24px",
  },

  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "14px",
    marginTop: "20px",
  },

  stepCard: {
    padding: "22px 18px",
    background: "rgba(255,255,255,0.11)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "18px",
  },

  stepNumber: {
    width: "38px",
    height: "38px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#4338ca",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 14px",
    fontWeight: "900",
  },

  stepText: {
    margin: 0,
    lineHeight: "1.5",
    fontWeight: "700",
  },

  privacySection: {
    marginTop: "34px",
    padding: "34px",
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "24px",
    alignItems: "center",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "24px",
  },

  privacyIcon: {
    width: "94px",
    height: "94px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.14)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "44px",
  },

  evidenceSection: {
    marginTop: "34px",
    padding: "34px",
    textAlign: "center",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "24px",
  },

  evidenceBadge: {
    display: "inline-block",
    padding: "7px 12px",
    marginBottom: "14px",
    background: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "900",
  },

  evidenceTitle: {
    margin: "0 0 12px",
    fontSize: "32px",
    fontWeight: "900",
  },

  finalCta: {
    marginTop: "34px",
    padding: "42px 26px",
    textAlign: "center",
    background: "rgba(255,255,255,0.13)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "26px",
    boxShadow: "0 22px 55px rgba(0,0,0,0.2)",
  },

  finalTitle: {
    maxWidth: "760px",
    margin: "0 auto 14px",
    fontSize: "34px",
    lineHeight: "1.15",
    fontWeight: "900",
  },

  finalText: {
    maxWidth: "660px",
    margin: "0 auto 26px",
    lineHeight: "1.6",
    opacity: 0.94,
  },

  finalButton: {
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