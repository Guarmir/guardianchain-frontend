import { Link, useSearchParams } from "react-router-dom"
import Footer from "../components/Footer.jsx"

import DemoHero from "../components/certificate-demo/DemoHero.jsx"
import DemoPreview from "../components/certificate-demo/DemoPreview.jsx"
import DemoAnatomy from "../components/certificate-demo/DemoAnatomy.jsx"
import DemoUseCases from "../components/certificate-demo/DemoUseCases.jsx"
import DemoVerification from "../components/certificate-demo/DemoVerification.jsx"
import DemoPrivacy from "../components/certificate-demo/DemoPrivacy.jsx"
import DemoEvidenceKey from "../components/certificate-demo/DemoEvidenceKey.jsx"
import DemoCTA from "../components/certificate-demo/DemoCTA.jsx"

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
          title: "Evidence Key™",
          text: "Chave exclusiva incluída no certificado para facilitar identificação, conferência e compartilhamento.",
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
      evidenceBadge: "Incluída no certificado",
      evidenceText:
        "A Evidence Key™ é uma chave exclusiva do certificado GuardianChain. Ela facilita a identificação, conferência e compartilhamento da sua prova digital sem depender apenas de códigos longos.",

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
          title: "Evidence Key™",
          text: "Exclusive key included in the certificate to make identification, review and sharing easier.",
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
      evidenceBadge: "Included in the certificate",
      evidenceText:
        "Evidence Key™ is an exclusive GuardianChain certificate key. It makes your digital proof easier to identify, review and share without relying only on long technical codes.",

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
        <DemoHero t={t} lang={lang} />
        <DemoPreview lang={lang} />
        <DemoAnatomy t={t} />
        <DemoUseCases t={t} />
        <DemoVerification t={t} />
        <DemoPrivacy t={t} />
        <DemoEvidenceKey t={t} />
        <DemoCTA t={t} lang={lang} />
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
}