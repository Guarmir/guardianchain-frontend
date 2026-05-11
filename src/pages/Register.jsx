import { useState } from "react"
import { ethers } from "ethers"
import { useSearchParams } from "react-router-dom"

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
      title: "Registrar prova digital",
      subtitle: "Seu arquivo nunca é enviado. Apenas o hash criptográfico é gerado no seu navegador.",
      choose: "Escolher arquivo",
      selected: "Arquivo selecionado",
      noFile: "Nenhum arquivo escolhido",
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
      required: "Preencha todos os dados, escolha um arquivo e aceite a declaração."
    },
    en: {
      title: "Register digital proof",
      subtitle: "Your file is never uploaded. Only the cryptographic hash is generated in your browser.",
      choose: "Choose file",
      selected: "Selected file",
      noFile: "No file selected",
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
      required: "Fill in all details, choose a file, and accept the declaration."
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
      <section style={styles.card}>
        <h1 style={styles.title}>{t.title}</h1>
        <p style={styles.subtitle}>{t.subtitle}</p>

        <label style={styles.fileLabel}>
          {t.choose}
          <input type="file" onChange={handleFileChange} style={{ display: "none" }} />
        </label>

        <p style={styles.fileText}>
          {fileName ? `${t.selected}: ${fileName}` : t.noFile}
        </p>

        {fileHash && (
          <div style={styles.hashBox}>
            <strong>Hash:</strong>
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
          style={styles.button}
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? t.loading : t.pay}
        </button>
      </section>
    </main>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "48px 20px",
    background: "#f7f8fb",
    display: "flex",
    justifyContent: "center"
  },
  card: {
    width: "100%",
    maxWidth: "720px",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "32px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
  },
  title: {
    fontSize: "32px",
    marginBottom: "10px"
  },
  subtitle: {
    color: "#555",
    marginBottom: "24px"
  },
  fileLabel: {
    display: "inline-block",
    padding: "12px 18px",
    background: "#111827",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer",
    marginBottom: "10px"
  },
  fileText: {
    color: "#444"
  },
  hashBox: {
    marginTop: "16px",
    padding: "14px",
    background: "#f1f5f9",
    borderRadius: "10px",
    wordBreak: "break-all",
    display: "grid",
    gap: "6px"
  },
  sectionTitle: {
    fontSize: "20px",
    marginTop: "28px",
    marginBottom: "14px"
  },
  input: {
    width: "100%",
    padding: "13px",
    marginBottom: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "15px"
  },
  checkboxRow: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
    margin: "14px 0 22px",
    color: "#333",
    lineHeight: "1.4"
  },
  button: {
    width: "100%",
    padding: "15px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer"
  }
}