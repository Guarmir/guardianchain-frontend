import { useState } from "react"
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

            <div style={styles.trustBox}>
              <h3 style={styles.trustTitle}>{t.trustTitle}</h3>
              <div style={styles.trustGrid}>
                <div style={styles.trustItem}>📄 {t.trust1}</div>
                <div style={styles.trustItem}>🌐 {t.trust2}</div>
                <div style={styles.trustItem}>#️⃣ {t.trust3}</div>
                <div style={styles.trustItem}>🛡 {t.trust4}</div>
              </div>
            </div>

            <div style={styles.priceBox}>
              <strong style={styles.price}>{t.price}</strong>
              <span style={styles.priceNote}>{t.priceNote}</span>
              <span style={styles.securePayment}>{t.securePayment}</span>
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

  hero: {
    width: "100%",
    maxWidth: "1120px",
    margin: "0 auto",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "48px",
  },

  homeLink: {
    color: "#e0e7ff",
    textDecoration: "none",
    fontSize: "14px",
  },

  langPill: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "999px",
  },

  langLink: {
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "700",
  },

  langDivider: {
    opacity: 0.65,
  },

  heroContent: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "34px",
    alignItems: "start",
  },

  left: {
    paddingTop: "24px",
  },

  badge: {
    display: "inline-block",
    padding: "8px 12px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "999px",
    fontSize: "14px",
    marginBottom: "18px",
  },

  title: {
    fontSize: "44px",
    lineHeight: "1.05",
    margin: "0 0 16px",
    letterSpacing: "-1px",
  },

  subtitle: {
    fontSize: "18px",
    lineHeight: "1.55",
    color: "#e0e7ff",
    marginBottom: "20px",
  },

  privacyBox: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
    padding: "14px",
    background: "rgba(15,23,42,0.55)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "14px",
    color: "#eef2ff",
    lineHeight: "1.45",
  },

  privacyIcon: {
    flexShrink: 0,
  },

  trustBox: {
    marginTop: "22px",
    padding: "18px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "18px",
  },

  trustTitle: {
    margin: "0 0 14px",
    fontSize: "18px",
  },

  trustGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },

  trustItem: {
    fontSize: "14px",
    color: "#f8fafc",
    lineHeight: "1.4",
  },

  priceBox: {
    marginTop: "22px",
    display: "grid",
    gap: "4px",
  },

  price: {
    fontSize: "34px",
  },

  priceNote: {
    color: "#e0e7ff",
  },

  securePayment: {
    color: "#c7d2fe",
    fontSize: "14px",
  },

  card: {
    width: "100%",
    background: "rgba(255,255,255,0.96)",
    color: "#111827",
    borderRadius: "24px",
    padding: "30px",
    boxShadow: "0 24px 80px rgba(0,0,0,0.28)",
    border: "1px solid rgba(255,255,255,0.4)",
  },

  fileLabel: {
    display: "inline-block",
    padding: "13px 18px",
    background: "#111827",
    color: "#fff",
    borderRadius: "12px",
    cursor: "pointer",
    marginBottom: "10px",
    fontWeight: "700",
  },

  fileText: {
    color: "#4b5563",
    marginBottom: "14px",
  },

  hashBox: {
    marginTop: "16px",
    padding: "14px",
    background: "#eef2ff",
    border: "1px solid #c7d2fe",
    borderRadius: "14px",
    wordBreak: "break-all",
    display: "grid",
    gap: "6px",
    color: "#1e1b4b",
  },

  sectionTitle: {
    fontSize: "20px",
    marginTop: "28px",
    marginBottom: "14px",
  },

  input: {
    boxSizing: "border-box",
    width: "100%",
    padding: "14px",
    marginBottom: "12px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    outlineColor: "#6366f1",
    background: "#ffffff",
  },

  checkboxRow: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
    margin: "14px 0 22px",
    color: "#374151",
    lineHeight: "1.45",
  },

  button: {
    width: "100%",
    padding: "15px",
    background: "linear-gradient(90deg,#4f46e5,#6366f1)",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontSize: "16px",
    fontWeight: "800",
  },
}