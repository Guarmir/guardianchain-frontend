import { Link, useSearchParams } from "react-router-dom"
import Footer from "../components/Footer.jsx"
import certificatePreview from "../assets/certificate-preview.png"

export default function LandingPage() {
  const [params] = useSearchParams()

  const langParam = params.get("lang")
  const lang = langParam === "pt" ? "pt" : "en"

  const linkedinUrl = "https://www.linkedin.com/in/guardianchain/"

  const t = {
    pt: {
      title: "Proteja seu trabalho antes de compartilhar.",
      subtitle:
        "Gere uma prova permanente de autoria para arquivos, ideias, código-fonte e criações digitais — sem enviar o arquivo original.",
      note: "Seu arquivo original nunca sai do seu dispositivo.",

      feature1: "Seu arquivo permanece privado",
      feature2: "Prova permanente de autoria",
      feature3: "Verificação pública por QR Code",
      feature4: "Sem carteira cripto",

      priceTitle: "Certificado digital de prova permanente",
      price: "R$ 19,90",
      pay: "pagamento único",

      register: "Gerar meu certificado",
      verify: "Verificar certificado",

      secure1: "Gerado imediatamente após o pagamento",
      secure2: "Certificado verificável publicamente",
      secure3: "Verificação por QR Code incluída",
      secure4: "Seu arquivo original nunca é enviado",

      riskTitle: "O que pode acontecer sem uma prova?",
      riskText:
        "Na internet, arquivos são copiados, reenviados e contestados rapidamente. Sem uma prova independente, pode ser difícil demonstrar quando aquele conteúdo já existia.",
      riskItems: [
        "Conteúdo de IA repostado sem crédito",
        "Disputas sobre código-fonte antes do lançamento",
        "Clientes questionando datas de entrega",
        "Prints rejeitados como evidência fraca",
        "Perda de comprovação de autoria",
      ],

      socialTitle: "Criado para profissionais digitais",
      socialText:
        "GuardianChain foi pensado para criadores, desenvolvedores, freelancers, designers e profissionais que precisam preservar evidências digitais de forma simples.",
      socialItems: [
        "Criadores de conteúdo",
        "Desenvolvedores",
        "Designers",
        "Freelancers",
        "Profissionais e empresas",
      ],

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
          title: "Crie uma prova permanente",
          text: "Uma impressão digital única do arquivo é criada e vinculada a um registro verificável.",
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
        "O GuardianChain nunca faz upload ou armazena o arquivo original. Apenas a impressão digital criptográfica do arquivo é registrada e vinculada a registros públicos.",
      aboutText4:
        "Nosso objetivo é tornar a evidência digital mais acessível, transparente e verificável para a internet moderna.",
      trustItems: [
        "Arquitetura focada em privacidade",
        "Sem upload de arquivos",
        "Verificação independente",
        "Registros públicos verificáveis",
        "Pagamento seguro via Stripe",
      ],

      founderTitle: "Presença pública do fundador",
      founderText:
        "O GuardianChain é desenvolvido por Valderi Miranda, fundador do projeto, com foco em prova digital verificável, privacidade e proteção de arquivos digitais.",
      founderText2:
        "Você pode ver a presença pública do fundador no LinkedIn, acompanhar publicações sobre o projeto e verificar que existe uma pessoa real construindo a plataforma.",
      founderButton: "Ver perfil no LinkedIn",

      independentTitle: "Verificação independente",
      independentText:
        "Sua prova não depende apenas do GuardianChain. Cada registro pode ser verificado de forma independente usando o hash, QR Code e dados do certificado.",
      independentItems: [
        "Registros públicos verificáveis",
        "QR Code verificável",
        "Hash auditável",
        "Verificação independente",
      ],

      integrityTitle: "Integridade da prova",
      integrityText:
        "O GuardianChain cria uma prova permanente de que um arquivo específico existia em um momento específico.",
      integrityText2:
        "Se o arquivo for alterado depois, a verificação muda também — tornando alterações detectáveis.",
      integrityText3:
        "O GuardianChain não substitui cartório, perícia técnica ou validação judicial formal. Ele funciona como uma camada independente de evidência digital para reforçar autoria, existência e integridade.",
      integrityItems: [
        "Comprova existência do arquivo em uma data",
        "Comprova integridade por impressão digital do arquivo",
        "Permite verificação pública posterior",
        "Funciona como camada adicional de evidência",
      ],

      securityTitle: "Domínio oficial e aviso de segurança",
      securityText:
        "O domínio oficial do GuardianChain é guardianchain.online. A plataforma nunca solicita investimentos, transferências de criptomoedas, pagamentos para recuperação de fundos ou acesso à sua carteira cripto.",
      securityItems: [
        "Domínio oficial: guardianchain.online",
        "Não solicitamos investimentos",
        "Não fazemos recuperação de fundos",
        "Não pedimos acesso à carteira cripto",
      ],

      certificateTitle: "Veja o certificado que você recebe",
      certificateText:
        "Cada registro gera um certificado verificável com impressão digital do arquivo, QR Code e validação pública.",

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
      title: "Protect your work before sharing it.",
      subtitle:
        "Generate permanent proof of authorship for files, ideas, source code and digital creations — without uploading your original file.",
      note: "Your original file never leaves your device.",

      feature1: "Your file stays private",
      feature2: "Permanent proof of authorship",
      feature3: "Public QR Code verification",
      feature4: "No crypto wallet required",

      priceTitle: "Permanent digital proof certificate",
      price: "US$ 8",
      pay: "one-time payment",

      register: "Generate My Certificate",
      verify: "Verify certificate",

      secure1: "Generated instantly after payment",
      secure2: "Publicly verifiable certificate",
      secure3: "QR Code verification included",
      secure4: "Your original file is never uploaded",

      riskTitle: "What can happen without proof?",
      riskText:
        "On the internet, files are copied, reposted and disputed quickly. Without independent proof, it can be difficult to show when that content already existed.",
      riskItems: [
        "AI-generated content reposted without attribution",
        "Source code disputes before launch",
        "Clients questioning delivery dates",
        "Screenshots rejected as weak evidence",
        "Lost authorship claims",
      ],

      socialTitle: "Built for digital professionals",
      socialText:
        "GuardianChain is designed for creators, developers, freelancers, designers and professionals who need to preserve digital evidence in a simple way.",
      socialItems: [
        "Content creators",
        "Developers",
        "Designers",
        "Freelancers",
        "Professionals and businesses",
      ],

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
          title: "Create permanent proof",
          text: "A unique digital fingerprint is created and linked to a permanent verification record.",
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
        "GuardianChain never uploads or stores the original file. Only the file’s digital fingerprint is registered and linked to public verification records.",
      aboutText4:
        "Our goal is to make digital evidence more accessible, transparent and independently verifiable for the modern internet.",
      trustItems: [
        "Privacy-first architecture",
        "No file upload",
        "Independent verification",
        "Public verification records",
        "Secure payment via Stripe",
      ],

      founderTitle: "Public founder presence",
      founderText:
        "GuardianChain is developed by Valderi Miranda, founder of the project, focused on verifiable digital proof, privacy and digital file protection.",
      founderText2:
        "You can view the founder’s public LinkedIn profile, follow project updates and verify that there is a real person building the platform.",
      founderButton: "View LinkedIn profile",

      independentTitle: "Independent verification",
      independentText:
        "Your proof does not depend only on GuardianChain. Each record can be independently verified using the hash, QR Code and certificate data.",
      independentItems: [
        "Public verification records",
        "Verifiable QR Code",
        "Auditable hash",
        "Independent verification",
      ],

      integrityTitle: "Proof integrity",
      integrityText:
        "GuardianChain creates permanent proof that a specific file existed at a specific moment in time.",
      integrityText2:
        "If the file changes later, the verification changes too — making alterations detectable.",
      integrityText3:
        "GuardianChain does not replace notarization, forensic analysis or formal judicial validation. It works as an independent digital evidence layer to strengthen authorship, existence and integrity.",
      integrityItems: [
        "Proves file existence at a specific date",
        "Proves integrity through the file fingerprint",
        "Allows future public verification",
        "Works as an additional evidence layer",
      ],

      securityTitle: "Official domain and security notice",
      securityText:
        "The official GuardianChain domain is guardianchain.online. The platform never asks for investments, crypto transfers, fund recovery payments or access to your crypto wallet.",
      securityItems: [
        "Official domain: guardianchain.online",
        "We do not request investments",
        "We do not offer fund recovery",
        "We do not ask for wallet access",
      ],

      certificateTitle: "See the certificate you receive",
      certificateText:
        "Each registration generates a verifiable certificate with the file fingerprint, QR Code and public validation.",

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
        <Link to="/?lang=pt" style={{ ...styles.langLink, opacity: lang === "pt" ? 1 : 0.7, fontWeight: lang === "pt" ? "700" : "400" }}>
          {t.switchToPt}
        </Link>

        <span style={styles.langDivider}>|</span>

        <Link to="/?lang=en" style={{ ...styles.langLink, opacity: lang === "en" ? 1 : 0.7, fontWeight: lang === "en" ? "700" : "400" }}>
          {t.switchToEn}
        </Link>
      </div>

      <h1 style={styles.title}>{t.title}</h1>
      <p style={styles.subtitle}>{t.subtitle}</p>
      <p style={styles.note}>{t.note}</p>

      <div style={styles.features}>
        <span>🔒 {t.feature1}</span>
        <span>🛡️ {t.feature2}</span>
        <span>🌐 {t.feature3}</span>
        <span>✅ {t.feature4}</span>
      </div>

      <div style={styles.card}>
        <p style={styles.priceTitle}>{t.priceTitle}</p>
        <h2 style={styles.price}>{t.price}</h2>
        <p>{t.pay}</p>

        <p style={styles.secure}>✓ {t.secure1}</p>
        <p style={styles.secure}>✓ {t.secure2}</p>
        <p style={styles.secure}>✓ {t.secure3}</p>
        <p style={styles.secure}>✓ {t.secure4}</p>

        <Link to={`/register?lang=${lang}`}>
          <button style={styles.buttonPrimary}>{t.register}</button>
        </Link>

        <Link to={`/verify?lang=${lang}`}>
          <button style={styles.buttonSecondary}>{t.verify}</button>
        </Link>
      </div>

      <section style={styles.riskSection}>
        <h2 style={styles.riskTitle}>{t.riskTitle}</h2>
        <p style={styles.riskText}>{t.riskText}</p>

        <div style={styles.riskGrid}>
          {t.riskItems.map((item) => (
            <div key={item} style={styles.riskCard}>
              <span style={styles.riskIcon}>!</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <Link to={`/register?lang=${lang}`}>
          <button style={styles.riskCta}>{t.register}</button>
        </Link>
      </section>

      <section style={styles.socialSection}>
        <h2 style={styles.socialTitle}>{t.socialTitle}</h2>
        <p style={styles.socialText}>{t.socialText}</p>

        <div style={styles.socialGrid}>
          {t.socialItems.map((item) => (
            <div key={item} style={styles.socialCard}>
              <span style={styles.socialCheck}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

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

      <section style={styles.founderSection}>
        <h2 style={styles.founderTitle}>{t.founderTitle}</h2>
        <p style={styles.founderText}>{t.founderText}</p>
        <p style={styles.founderText}>{t.founderText2}</p>

        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" style={styles.linkedinButton}>
          {t.founderButton}
        </a>
      </section>

      <section style={styles.independentSection}>
        <h2 style={styles.independentTitle}>{t.independentTitle}</h2>
        <p style={styles.independentText}>{t.independentText}</p>

        <div style={styles.independentGrid}>
          {t.independentItems.map((item) => (
            <div key={item} style={styles.independentCard}>
              <span style={styles.independentCheck}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.integritySection}>
        <h2 style={styles.integrityTitle}>{t.integrityTitle}</h2>
        <p style={styles.integrityText}>{t.integrityText}</p>
        <p style={styles.integrityText}>{t.integrityText2}</p>
        <p style={styles.integrityText}>{t.integrityText3}</p>

        <div style={styles.integrityGrid}>
          {t.integrityItems.map((item) => (
            <div key={item} style={styles.integrityCard}>
              <span style={styles.integrityCheck}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.securitySection}>
        <h2 style={styles.securityTitle}>{t.securityTitle}</h2>
        <p style={styles.securityText}>{t.securityText}</p>

        <div style={styles.securityGrid}>
          {t.securityItems.map((item) => (
            <div key={item} style={styles.securityCard}>
              <span style={styles.securityCheck}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <div style={styles.certificateSection}>
        <h2 style={styles.certificateTitle}>{t.certificateTitle}</h2>
        <p style={styles.certificateText}>{t.certificateText}</p>

        <img src={certificatePreview} alt="GuardianChain Certificate Preview" style={styles.certificateImage} />
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
    padding: "60px 20px 80px",
    background: "linear-gradient(180deg,#6366f1 0%, #4f46e5 45%, #312e81 100%)",
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
    fontSize: "54px",
    fontWeight: "800",
    lineHeight: "1.1",
    marginBottom: "20px",
  },

  subtitle: {
    fontSize: "18px",
    marginBottom: "10px",
    maxWidth: "900px",
    marginLeft: "auto",
    marginRight: "auto",
    lineHeight: "1.5",
  },

  note: {
    opacity: 0.95,
    marginBottom: "20px",
    fontWeight: "600",
  },

  features: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "40px",
  },

  card: {
    background: "#ffffff",
    color: "#111",
    maxWidth: "480px",
    margin: "0 auto",
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
    border: "1px solid rgba(255,255,255,0.2)",
  },

  priceTitle: {
    opacity: 0.9,
    fontWeight: "700",
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
    fontSize: "16px",
    boxShadow: "0 10px 25px rgba(75,79,191,0.4)",
    transition: "0.2s",
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

  riskSection: {
    maxWidth: "980px",
    margin: "80px auto 0",
    padding: "40px 24px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "22px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
  },

  riskTitle: {
    fontSize: "32px",
    marginBottom: "14px",
  },

  riskText: {
    maxWidth: "760px",
    margin: "0 auto 30px",
    opacity: 0.94,
    lineHeight: "1.7",
    fontSize: "16px",
  },

  riskGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "14px",
    marginBottom: "28px",
  },

  riskCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textAlign: "left",
    padding: "15px 16px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "14px",
    color: "#ffffff",
    fontSize: "15px",
  },

  riskIcon: {
    width: "22px",
    height: "22px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#dc2626",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    flexShrink: 0,
  },

  riskCta: {
    padding: "15px 24px",
    background: "#ffffff",
    color: "#4338ca",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "900",
    fontSize: "15px",
  },

  socialSection: {
    maxWidth: "980px",
    margin: "80px auto 0",
    padding: "34px 22px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "22px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
  },

  socialTitle: {
    fontSize: "32px",
    marginBottom: "12px",
  },

  socialText: {
    maxWidth: "760px",
    margin: "0 auto 28px",
    opacity: 0.94,
    lineHeight: "1.7",
  },

  socialGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
  },

  socialCard: {
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

  socialCheck: {
    width: "22px",
    height: "22px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#4b4fbf",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    flexShrink: 0,
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

  founderSection: {
    maxWidth: "980px",
    margin: "80px auto 0",
    padding: "40px 24px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "22px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
  },

  founderTitle: {
    fontSize: "32px",
    marginBottom: "18px",
  },

  founderText: {
    maxWidth: "780px",
    margin: "0 auto 18px",
    lineHeight: "1.7",
    opacity: 0.94,
    fontSize: "16px",
  },

  linkedinButton: {
    display: "inline-block",
    marginTop: "18px",
    padding: "14px 22px",
    background: "#ffffff",
    color: "#4338ca",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "800",
  },

  independentSection: {
    maxWidth: "980px",
    margin: "80px auto 0",
    padding: "40px 24px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "22px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
  },

  independentTitle: {
    fontSize: "32px",
    marginBottom: "18px",
  },

  independentText: {
    maxWidth: "760px",
    margin: "0 auto 30px",
    lineHeight: "1.7",
    opacity: 0.94,
  },

  independentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },

  independentCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "14px",
    textAlign: "left",
  },

  independentCheck: {
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

  integritySection: {
    maxWidth: "980px",
    margin: "80px auto 0",
    padding: "40px 24px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "22px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
  },

  integrityTitle: {
    fontSize: "32px",
    marginBottom: "18px",
  },

  integrityText: {
    maxWidth: "820px",
    margin: "0 auto 18px",
    lineHeight: "1.7",
    opacity: 0.94,
    fontSize: "16px",
  },

  integrityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginTop: "34px",
  },

  integrityCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "14px",
    textAlign: "left",
  },

  integrityCheck: {
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

  securitySection: {
    maxWidth: "980px",
    margin: "80px auto 0",
    padding: "40px 24px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "22px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
  },

  securityTitle: {
    fontSize: "32px",
    marginBottom: "18px",
  },

  securityText: {
    maxWidth: "820px",
    margin: "0 auto 30px",
    lineHeight: "1.7",
    opacity: 0.95,
    fontSize: "16px",
  },

  securityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },

  securityCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "14px",
    textAlign: "left",
  },

  securityCheck: {
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