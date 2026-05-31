import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Link, useSearchParams } from "react-router-dom"

export default function Register() {
  const [params] = useSearchParams()

  const getInitialLang = () => {
    const langParam = params.get("lang")

    if (langParam === "pt") return "pt"
    if (langParam === "en") return "en"

    const savedLang = localStorage.getItem("guardianchain_lang")
    if (savedLang === "pt" || savedLang === "en") return savedLang

    const browserLang = navigator.language || navigator.userLanguage || ""
    if (browserLang.toLowerCase().startsWith("pt")) return "pt"

    return "en"
  }

  const lang = getInitialLang()

  const [fileHash, setFileHash] = useState("")
  const [fileName, setFileName] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [ownerEmail, setOwnerEmail] = useState("")
  const [ownerType, setOwnerType] = useState("individual")
  const [acceptedDeclaration, setAcceptedDeclaration] = useState(false)
  const [loading, setLoading] = useState(false)

  // Analytics - entrada na página register
  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "register_page_view")
    }
  }, [])

  const text = {
    pt: {
      home: "Início",
      badge: "Registro verificável em blockchain",
      title: "Registrar prova digital",
      subtitle:
        "Gere uma prova criptográfica do seu arquivo, vinculada ao titular declarado e entregue em certificado PDF.",
      privacy: "Seu arquivo nunca é enviado. Apenas o hash criptográfico é gerado no seu navegador.",
      choose: "Escolher arquivo",
      selected: "Arquivo selecionado",
      noFile: "Nenhum arquivo escolhido",
      hashGenerated: "Hash gerado com segurança",
      holder: "Titular do certificado",
      name: "Nome completo ou razão social",
      email: "E-mail do titular",
      type: "Tipo de titular",
      individual: "Pessoa física",
      company: "Empresa",
      declaration:
        "Declaro, sob minha responsabilidade, que sou o autor, titular ou possuo direito legítimo sobre o conteúdo representado por este hash.",
      pay: "Gerar certificado e pagar",
      loading: "Redirecionando para pagamento...",
      required: "Preencha todos os dados, escolha um arquivo e aceite a declaração.",
      trustTitle: "O que você recebe",
      trust1: "Certificado PDF com titular declarado",
      trust2: "QR Code para verificação pública",
      trust3: "Hash criptográfico do arquivo",
      trust4: "Registro verificável e permanente",
      price: "R$ 19,90",
      priceNote: "pagamento único",
      securePayment: "Pagamento seguro via Stripe",
    },
    en: {
      home: "Home",
      badge: "Verifiable blockchain record",
      title: "Register digital proof",
      subtitle:
        "Generate cryptographic proof for your file, linked to the declared holder and delivered as a PDF certificate.",
      privacy: "Your file is never uploaded. Only the cryptographic hash is generated in your browser.",
      choose: "Choose file",
      selected: "Selected file",
      noFile: "No file selected",
      hashGenerated: "Hash securely generated",
      holder: "Certificate holder",
      name: "Full name or company name",
      email: "Holder email",
      type: "Holder type",
      individual: "Individual",
      company: "Company",
      declaration:
        "I declare, under my own responsibility, that I am the author, owner, or have legitimate rights over the content represented by this hash.",
      pay: "Generate certificate and pay",
      loading: "Redirecting to payment...",
      required: "Fill in all details, choose a file, and accept the declaration.",
      trustTitle: "What you receive",
      trust1: "PDF certificate with declared holder",
      trust2: "QR Code for public verification",
      trust3: "Cryptographic file hash",
      trust4: "Verifiable permanent record",
      price: "US$ 4",
      priceNote: "one-time payment",
      securePayment: "Secure payment powered by Stripe",
    }
  }

  const t = text[lang]

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setFileName(file.name)

    const buffer = await file.arrayBuffer()
    const hash = ethers.keccak256(new Uint8Array(buffer))
    setFileHash(hash)
  }

  const handleCheckout = async () => {
    if (!fileHash || !fileName || !ownerName || !ownerEmail || !acceptedDeclaration) {
      alert(t.required)
      return
    }

    // Analytics - clique no CTA
    if (typeof window.gtag === "function") {
      window.gtag("event", "create_proof_click")
    }

    // Analytics - início do checkout
    if (typeof window.gtag === "function") {
      window.gtag("event", "begin_checkout")
    }

    setLoading(true)

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          hash: fileHash,
          fileName,
          language: lang,
          ownerName,
          ownerEmail,
          ownerType,
          ownershipDeclaration: acceptedDeclaration
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Checkout error")
      }

      window.location.href = data.url
    } catch (error) {
      console.error(error)
      alert("Erro ao iniciar pagamento. Tente novamente.")
      setLoading(false)
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.topBar}>
          <Link to={`/?lang=${lang}`} style={styles.homeLink}>
            ← {t.home}
          </Link>

          <div style={styles.langPill}>
            <Link to="/register?lang=pt" style={styles.langLink}>
              PT
            </Link>
            <span style={styles.langDivider}>|</span>
            <Link to="/register?lang=en" style={styles.langLink}>
              EN
            </Link>
          </div>
        </div>

        <div style={styles.heroContent}>
          <div style={styles.left}>
            <div style={styles.badge}>⛓ {t.badge}</div>

            <h1 style={styles.title}>{t.title}</h1>
            <p style={styles.subtitle}>{t.subtitle}</p>

            <div style={styles.privacyBox}>
              <span style={styles.privacyIcon}>🔒</span>
              <span>{t.privacy}</span>
            </div>
          </div>

          <section style={styles.card}>
            <label style={styles.fileLabel}>
              {t.choose}
              <input type="file" onChange={handleFileChange} style={{ display: "none" }} />
            </label>

            <p style={styles.fileText}>
              {fileName ? `${t.selected}: ${fileName}` : t.noFile}
            </p>

            {fileHash && (
              <div style={styles.hashBox}>
                <strong>{t.hashGenerated}</strong>
                <span>{fileHash}</span>
              </div>
            )}

            <h2 style={styles.sectionTitle}>{t.holder}</h2>

            <input
              style={styles.input}
              type="text"
              placeholder={t.name}
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />

            <input
              style={styles.input}
              type="email"
              placeholder={t.email}
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
            />

            <select
              style={styles.input}
              value={ownerType}
              onChange={(e) => setOwnerType(e.target.value)}
            >
              <option value="individual">{t.individual}</option>
              <option value="company">{t.company}</option>
            </select>

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={acceptedDeclaration}
                onChange={(e) => setAcceptedDeclaration(e.target.checked)}
              />
              <span>{t.declaration}</span>
            </label>

            <button
              style={{
                ...styles.button,
                opacity: loading ? 0.75 : 1,
                cursor: loading ? "not-allowed" : "pointer"
              }}
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? t.loading : t.pay}
            </button>
          </section>
        </div>
      </section>
    </main>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(129,140,248,0.35), transparent 32%), linear-gradient(180deg,#111827,#312e81 55%,#4338ca)",
    color: "#ffffff",
    padding: "24px 18px 56px",
  },
}