import { useEffect, useState } from "react"
import {
  Link,
  useSearchParams,
} from "react-router-dom"

import {
  DEFAULT_PRODUCT_ID,
  getProductById,
} from "../data/productCatalog.js"

import {
  generateFileHash,
} from "../utils/generateFileHash.js"

export default function Register() {
  const [params] = useSearchParams()

  const getInitialLang = () => {
    const langParam = params.get("lang")

    if (langParam === "pt") return "pt"
    if (langParam === "en") return "en"

    const savedLang =
      localStorage.getItem(
        "guardianchain_lang",
      )

    if (
      savedLang === "pt" ||
      savedLang === "en"
    ) {
      return savedLang
    }

    const browserLang =
      navigator.language ||
      navigator.userLanguage ||
      ""

    if (
      browserLang
        .toLowerCase()
        .startsWith("pt")
    ) {
      return "pt"
    }

    return "en"
  }

  const lang = getInitialLang()

  const requestedProductId =
    params.get("product") ||
    DEFAULT_PRODUCT_ID

  const selectedProduct =
    getProductById(
      requestedProductId,
      lang,
    ) ||
    getProductById(
      DEFAULT_PRODUCT_ID,
      lang,
    )

  const [fileHash, setFileHash] =
    useState("")

  const [fileName, setFileName] =
    useState("")

  const [ownerName, setOwnerName] =
    useState("")

  const [ownerEmail, setOwnerEmail] =
    useState("")

  const [ownerType, setOwnerType] =
    useState("individual")

  const [
    acceptedDeclaration,
    setAcceptedDeclaration,
  ] = useState(false)

  const [hashingFile, setHashingFile] =
    useState(false)

  const [loading, setLoading] =
    useState(false)

  useEffect(() => {
    if (
      typeof window.gtag === "function"
    ) {
      window.gtag(
        "event",
        "register_page_view",
        {
          product_id:
            selectedProduct?.id ||
            DEFAULT_PRODUCT_ID,
        },
      )
    }
  }, [selectedProduct?.id])

  const text = {
    pt: {
      home: "Início",
      badge:
        "Registro verificável permanente",
      title: "Registrar prova digital",
      subtitle:
        "Gere uma prova permanente do seu arquivo, vinculada ao titular declarado e entregue em certificado PDF.",
      privacy:
        "Seu arquivo nunca é enviado. Apenas a impressão digital SHA-256 é gerada no seu navegador.",
      selectedProduct:
        "Produto selecionado",
      choose: "Escolher arquivo",
      hashing:
        "Gerando impressão digital...",
      selected:
        "Arquivo selecionado",
      noFile:
        "Nenhum arquivo escolhido",
      hashGenerated:
        "Impressão digital SHA-256 gerada com segurança",
      hashError:
        "Não foi possível gerar a impressão digital do arquivo. Tente novamente.",
      holder:
        "Titular do certificado",
      name:
        "Nome completo ou razão social",
      email:
        "E-mail do titular",
      individual:
        "Pessoa física",
      company: "Empresa",
      declaration:
        "Declaro, sob minha responsabilidade, que sou o autor, titular ou possuo direito legítimo sobre o conteúdo representado por esta prova.",
      pay:
        "Gerar certificado e pagar",
      loading:
        "Redirecionando para pagamento...",
      required:
        "Preencha todos os dados, escolha um arquivo e aceite a declaração.",
      checkoutError:
        "Erro ao iniciar pagamento. Se estiver testando localmente, faça o teste final no site publicado ou usando vercel dev.",
      trustTitle:
        "O que você recebe",
      trust1:
        "Certificado PDF com titular declarado",
      trust2:
        "QR Code para verificação pública",
      trust3:
        "Impressão digital SHA-256 do arquivo",
      trust4:
        "Evidence Key™ exclusiva",
      securePayment:
        "Pagamento seguro via Stripe",
    },

    en: {
      home: "Home",
      badge:
        "Permanent verifiable record",
      title:
        "Register digital proof",
      subtitle:
        "Generate permanent proof for your file, linked to the declared holder and delivered as a PDF certificate.",
      privacy:
        "Your file is never uploaded. Only the SHA-256 fingerprint is generated in your browser.",
      selectedProduct:
        "Selected product",
      choose: "Choose file",
      hashing:
        "Generating file fingerprint...",
      selected:
        "Selected file",
      noFile:
        "No file selected",
      hashGenerated:
        "SHA-256 fingerprint securely generated",
      hashError:
        "The file fingerprint could not be generated. Please try again.",
      holder:
        "Certificate holder",
      name:
        "Full name or company name",
      email:
        "Holder email",
      individual: "Individual",
      company: "Company",
      declaration:
        "I declare, under my own responsibility, that I am the author, owner, or have legitimate rights over the content represented by this proof.",
      pay:
        "Generate certificate and pay",
      loading:
        "Redirecting to payment...",
      required:
        "Fill in all details, choose a file, and accept the declaration.",
      checkoutError:
        "Error starting payment. If you are testing locally, run the final checkout test on the published site or using vercel dev.",
      trustTitle:
        "What you receive",
      trust1:
        "PDF certificate with declared holder",
      trust2:
        "QR Code for public verification",
      trust3:
        "SHA-256 file fingerprint",
      trust4:
        "Exclusive Evidence Key™",
      securePayment:
        "Secure payment powered by Stripe",
    },
  }

  const t = text[lang]

  const handleFileChange =
    async (event) => {
      const file =
        event.target.files?.[0]

      if (!file) return

      setFileName(file.name)
      setFileHash("")
      setHashingFile(true)

      try {
        const hash =
          await generateFileHash(file)

        setFileHash(hash)
      } catch (error) {
        console.error(
          "File hash error:",
          error,
        )

        setFileName("")
        setFileHash("")

        alert(t.hashError)
      } finally {
        setHashingFile(false)
      }
    }

  const handleCheckout = async () => {
    if (
      !fileHash ||
      !fileName ||
      !ownerName ||
      !ownerEmail ||
      !acceptedDeclaration ||
      !selectedProduct
    ) {
      alert(t.required)
      return
    }

    if (
      typeof window.gtag === "function"
    ) {
      window.gtag(
        "event",
        "create_proof_click",
        {
          product_id:
            selectedProduct.id,
        },
      )

      window.gtag(
        "event",
        "begin_checkout",
        {
          currency:
            selectedProduct.currency,
          value:
            selectedProduct.priceInCents /
            100,
          product_id:
            selectedProduct.id,
        },
      )
    }

    setLoading(true)

    try {
      const response = await fetch(
        "/api/create-checkout-session",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            hash: fileHash,
            fileName,
            language: lang,
            ownerName,
            ownerEmail,
            ownerType,

            ownershipDeclaration:
              acceptedDeclaration,

            productId:
              selectedProduct.id,
          }),
        },
      )

      const rawText =
        await response.text()

      const data = rawText
        ? JSON.parse(rawText)
        : {}

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Checkout error",
        )
      }

      if (!data.url) {
        throw new Error(
          "Stripe checkout URL not returned",
        )
      }

      window.location.href =
        data.url
    } catch (error) {
      console.error(
        "Checkout error:",
        error,
      )

      alert(t.checkoutError)
      setLoading(false)
    }
  }

  const actionDisabled =
    loading ||
    hashingFile ||
    !selectedProduct?.checkoutEnabled

  return (
    <main style={styles.page}>
      <section style={styles.wrapper}>
        <div style={styles.topBar}>
          <Link
            to={`/?lang=${lang}`}
            style={styles.homeLink}
          >
            ← {t.home}
          </Link>

          <div style={styles.langPill}>
            <Link
              to={`/register?lang=pt&product=${encodeURIComponent(
                selectedProduct?.id ||
                  DEFAULT_PRODUCT_ID,
              )}`}
              style={styles.langLink}
            >
              PT
            </Link>

            <span
              style={styles.langDivider}
            >
              |
            </span>

            <Link
              to={`/register?lang=en&product=${encodeURIComponent(
                selectedProduct?.id ||
                  DEFAULT_PRODUCT_ID,
              )}`}
              style={styles.langLink}
            >
              EN
            </Link>
          </div>
        </div>

        <div style={styles.grid}>
          <div style={styles.left}>
            <div style={styles.badge}>
              🛡️ {t.badge}
            </div>

            <h1 style={styles.title}>
              {t.title}
            </h1>

            <p style={styles.subtitle}>
              {t.subtitle}
            </p>

            <div style={styles.privacyBox}>
              <span
                style={
                  styles.privacyIcon
                }
              >
                🔒
              </span>

              <span>{t.privacy}</span>
            </div>

            <div style={styles.trustBox}>
              <h2 style={styles.trustTitle}>
                {t.trustTitle}
              </h2>

              <div style={styles.trustItem}>
                ✓ {t.trust1}
              </div>

              <div style={styles.trustItem}>
                ✓ {t.trust2}
              </div>

              <div style={styles.trustItem}>
                ✓ {t.trust3}
              </div>

              <div style={styles.trustItem}>
                ✓ {t.trust4}
              </div>
            </div>
          </div>

          <section style={styles.card}>
            <p style={styles.productLabel}>
              {t.selectedProduct}
            </p>

            <h2 style={styles.productName}>
              {selectedProduct?.name}
            </h2>

            <div style={styles.priceBox}>
              <span style={styles.price}>
                {
                  selectedProduct
                    ?.priceLabel
                }
              </span>

              <span style={styles.priceNote}>
                {
                  selectedProduct
                    ?.creditsLabel
                }
              </span>
            </div>

            <p style={styles.productDescription}>
              {
                selectedProduct
                  ?.description
              }
            </p>

            <p style={styles.securePayment}>
              🔐 {t.securePayment}
            </p>

            <label style={styles.fileLabel}>
              {hashingFile
                ? t.hashing
                : t.choose}

              <input
                type="file"
                onChange={
                  handleFileChange
                }
                disabled={hashingFile}
                style={{
                  display: "none",
                }}
              />
            </label>

            <p style={styles.fileText}>
              {fileName
                ? `${t.selected}: ${fileName}`
                : t.noFile}
            </p>

            {fileHash && (
              <div style={styles.hashBox}>
                <strong>
                  {t.hashGenerated}
                </strong>

                <span>{fileHash}</span>
              </div>
            )}

            <h2 style={styles.sectionTitle}>
              {t.holder}
            </h2>

            <input
              style={styles.input}
              type="text"
              placeholder={t.name}
              value={ownerName}
              onChange={(event) =>
                setOwnerName(
                  event.target.value,
                )
              }
            />

            <input
              style={styles.input}
              type="email"
              placeholder={t.email}
              value={ownerEmail}
              onChange={(event) =>
                setOwnerEmail(
                  event.target.value,
                )
              }
            />

            <select
              style={styles.input}
              value={ownerType}
              onChange={(event) =>
                setOwnerType(
                  event.target.value,
                )
              }
            >
              <option value="individual">
                {t.individual}
              </option>

              <option value="company">
                {t.company}
              </option>
            </select>

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={
                  acceptedDeclaration
                }
                onChange={(event) =>
                  setAcceptedDeclaration(
                    event.target.checked,
                  )
                }
              />

              <span>
                {t.declaration}
              </span>
            </label>

            <button
              style={{
                ...styles.button,

                opacity:
                  actionDisabled
                    ? 0.75
                    : 1,

                cursor:
                  actionDisabled
                    ? "not-allowed"
                    : "pointer",
              }}
              onClick={handleCheckout}
              disabled={actionDisabled}
              type="button"
            >
              {loading
                ? t.loading
                : t.pay}
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

  wrapper: {
    maxWidth: "1120px",
    margin: "0 auto",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "42px",
  },

  homeLink: {
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "700",
  },

  langPill: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 14px",
    background:
      "rgba(255,255,255,0.12)",
    border:
      "1px solid rgba(255,255,255,0.18)",
    borderRadius: "999px",
  },

  langLink: {
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "14px",
  },

  langDivider: {
    opacity: 0.7,
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "1fr 460px",
    gap: "44px",
    alignItems: "start",
  },

  left: {
    paddingTop: "26px",
  },

  badge: {
    display: "inline-block",
    padding: "8px 14px",
    background:
      "rgba(255,255,255,0.12)",
    border:
      "1px solid rgba(255,255,255,0.18)",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: "700",
    marginBottom: "24px",
  },

  title: {
    fontSize: "46px",
    lineHeight: "1.08",
    margin: "0 0 18px",
    maxWidth: "620px",
  },

  subtitle: {
    fontSize: "18px",
    lineHeight: "1.6",
    opacity: 0.94,
    maxWidth: "620px",
    marginBottom: "22px",
  },

  privacyBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    maxWidth: "620px",
    padding: "16px 18px",
    background:
      "rgba(255,255,255,0.1)",
    border:
      "1px solid rgba(255,255,255,0.16)",
    borderRadius: "16px",
    lineHeight: "1.5",
  },

  privacyIcon: {
    flexShrink: 0,
  },

  trustBox: {
    marginTop: "28px",
    maxWidth: "620px",
    padding: "24px",
    background:
      "rgba(255,255,255,0.08)",
    border:
      "1px solid rgba(255,255,255,0.14)",
    borderRadius: "20px",
  },

  trustTitle: {
    margin: "0 0 16px",
    fontSize: "22px",
  },

  trustItem: {
    marginBottom: "10px",
    fontSize: "15px",
    opacity: 0.95,
  },

  card: {
    background: "#ffffff",
    color: "#111827",
    borderRadius: "24px",
    padding: "30px",
    boxShadow:
      "0 28px 70px rgba(0,0,0,0.35)",
  },

  productLabel: {
    margin: "0 0 6px",
    textAlign: "center",
    color: "#6366f1",
    fontSize: "13px",
    fontWeight: "900",
    letterSpacing: "0.7px",
    textTransform: "uppercase",
  },

  productName: {
    margin: "0 0 8px",
    textAlign: "center",
    color: "#111827",
    fontSize: "23px",
  },

  priceBox: {
    display: "flex",
    alignItems: "baseline",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "10px",
  },

  price: {
    fontSize: "38px",
    fontWeight: "900",
    color: "#312e81",
  },

  priceNote: {
    fontSize: "14px",
    color: "#6b7280",
  },

  productDescription: {
    margin: "0 auto 12px",
    textAlign: "center",
    color: "#4b5563",
    fontSize: "14px",
    lineHeight: "1.55",
  },

  securePayment: {
    textAlign: "center",
    color: "#4b5563",
    fontSize: "14px",
    marginBottom: "22px",
  },

  fileLabel: {
    display: "block",
    width: "100%",
    textAlign: "center",
    padding: "15px",
    background: "#4b4fbf",
    color: "#ffffff",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "800",
    marginBottom: "12px",
    boxSizing: "border-box",
  },

  fileText: {
    fontSize: "14px",
    color: "#4b5563",
    textAlign: "center",
    marginBottom: "18px",
    wordBreak: "break-word",
  },

  hashBox: {
    padding: "14px",
    background: "#f3f4f6",
    border:
      "1px solid #e5e7eb",
    borderRadius: "14px",
    marginBottom: "22px",
    fontSize: "13px",
    wordBreak: "break-all",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  sectionTitle: {
    fontSize: "22px",
    margin: "22px 0 16px",
    color: "#111827",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 15px",
    borderRadius: "12px",
    border:
      "1px solid #d1d5db",
    marginBottom: "12px",
    fontSize: "15px",
    outline: "none",
  },

  checkboxRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#374151",
    margin: "10px 0 20px",
  },

  button: {
    width: "100%",
    padding: "16px",
    background: "#4338ca",
    color: "#ffffff",
    border: "none",
    borderRadius: "14px",
    fontSize: "16px",
    fontWeight: "900",
    cursor: "pointer",
  },
}