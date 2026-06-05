import { useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import i18n from "../i18n"

export default function Verify() {
  const [params] = useSearchParams()

  const hash = params.get("hash")
  const langParam = params.get("lang")
  const lang = langParam === "pt" ? "pt" : "en"

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
  }, [lang])

  const text = {
    pt: {
      home: "Início",
      badge: "Verificação pública",
      title: "Verificação de prova digital",
      subtitle:
        "Esta página permite verificar publicamente o hash registrado e baixar o certificado associado.",
      validTitle: "Prova digital verificável",
      validText:
        "O hash abaixo representa uma impressão digital criptográfica do arquivo registrado. Se o arquivo original gerar o mesmo hash, sua integridade pode ser confirmada.",
      hashLabel: "Hash SHA-256",
      noHash: "Hash não informado na URL.",
      download: "Baixar certificado",
      registerAnother: "Registrar outro arquivo",
      trustTitle: "O que esta verificação confirma",
      trust1: "O hash informado está presente na URL de verificação",
      trust2: "O certificado pode ser baixado novamente",
      trust3: "A prova pode ser conferida pelo QR Code",
      trust4: "A integridade pode ser validada comparando o hash do arquivo",
      noticeTitle: "Aviso importante",
      notice:
        "O GuardianChain verifica o hash e o certificado associado. A plataforma não armazena o arquivo original e não valida o conteúdo interno do arquivo.",
      missing:
        "Para verificar uma prova, acesse esta página usando um link com hash válido.",
    },
    en: {
      home: "Home",
      badge: "Public verification",
      title: "Digital proof verification",
      subtitle:
        "This page allows public verification of the registered hash and download of the associated certificate.",
      validTitle: "Verifiable digital proof",
      validText:
        "The hash below represents a cryptographic fingerprint of the registered file. If the original file generates the same hash, its integrity can be confirmed.",
      hashLabel: "SHA-256 hash",
      noHash: "Hash was not provided in the URL.",
      download: "Download certificate",
      registerAnother: "Register another file",
      trustTitle: "What this verification confirms",
      trust1: "The provided hash is present in the verification URL",
      trust2: "The certificate can be downloaded again",
      trust3: "The proof can be checked through the QR Code",
      trust4: "Integrity can be validated by comparing the file hash",
      noticeTitle: "Important notice",
      notice:
        "GuardianChain verifies the hash and associated certificate. The platform does not store the original file and does not validate the internal content of the file.",
      missing:
        "To verify a proof, access this page using a link with a valid hash.",
    },
  }

  const t = text[lang]

  function download() {
    if (!hash) {
      alert(t.noHash)
      return
    }

    window.location.href = `/api/download-certificate?hash=${encodeURIComponent(
      hash
    )}&lang=${lang}`
  }

  function goToRegister() {
    window.location.href = `/register?lang=${lang}`
  }

  return (
    <main style={styles.page}>
      <section style={styles.wrapper}>
        <div style={styles.topBar}>
          <Link to={`/?lang=${lang}`} style={styles.homeLink}>
            ← {t.home}
          </Link>

          <div style={styles.langPill}>
            <Link to={`/verify${hash ? `?hash=${encodeURIComponent(hash)}&lang=pt` : "?lang=pt"}`} style={styles.langLink}>
              PT
            </Link>
            <span style={styles.langDivider}>|</span>
            <Link to={`/verify${hash ? `?hash=${encodeURIComponent(hash)}&lang=en` : "?lang=en"}`} style={styles.langLink}>
              EN
            </Link>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.badge}>🔎 {t.badge}</div>

          <h1 style={styles.title}>{t.title}</h1>

          <p style={styles.subtitle}>{t.subtitle}</p>

          {hash ? (
            <>
              <div style={styles.statusBox}>
                <div style={styles.statusIcon}>✓</div>
                <div>
                  <h2 style={styles.statusTitle}>{t.validTitle}</h2>
                  <p style={styles.statusText}>{t.validText}</p>
                </div>
              </div>

              <div style={styles.hashBox}>
                <p style={styles.hashLabel}>{t.hashLabel}</p>
                <p style={styles.hash}>{hash}</p>
              </div>

              <div style={styles.trustBox}>
                <h2 style={styles.trustTitle}>{t.trustTitle}</h2>

                <div style={styles.trustGrid}>
                  <div style={styles.trustItem}>✓ {t.trust1}</div>
                  <div style={styles.trustItem}>✓ {t.trust2}</div>
                  <div style={styles.trustItem}>✓ {t.trust3}</div>
                  <div style={styles.trustItem}>✓ {t.trust4}</div>
                </div>
              </div>

              <div style={styles.noticeBox}>
                <strong>{t.noticeTitle}</strong>
                <p>{t.notice}</p>
              </div>

              <button onClick={download} style={styles.primary} type="button">
                {t.download}
              </button>
            </>
          ) : (
            <>
              <div style={styles.warningBox}>
                <strong>{t.noHash}</strong>
                <p>{t.missing}</p>
              </div>
            </>
          )}

          <button onClick={goToRegister} style={styles.secondary} type="button">
            {t.registerAnother}
          </button>
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
    maxWidth: "920px",
    margin: "0 auto",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "34px",
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
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
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

  card: {
    background: "#ffffff",
    color: "#111827",
    borderRadius: "24px",
    padding: "36px",
    boxShadow: "0 28px 70px rgba(0,0,0,0.35)",
    textAlign: "center",
  },

  badge: {
    display: "inline-block",
    padding: "8px 14px",
    background: "#eef2ff",
    color: "#3730a3",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: "800",
    marginBottom: "18px",
  },

  title: {
    fontSize: "36px",
    lineHeight: "1.15",
    margin: "0 0 12px",
    color: "#111827",
  },

  subtitle: {
    maxWidth: "680px",
    margin: "0 auto 28px",
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#4b5563",
  },

  statusBox: {
    display: "flex",
    gap: "16px",
    textAlign: "left",
    alignItems: "flex-start",
    background: "#ecfdf5",
    border: "1px solid #bbf7d0",
    borderRadius: "18px",
    padding: "18px",
    marginBottom: "22px",
  },

  statusIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "999px",
    background: "#16a34a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    flexShrink: 0,
  },

  statusTitle: {
    margin: "0 0 6px",
    fontSize: "20px",
    color: "#065f46",
  },

  statusText: {
    margin: 0,
    color: "#166534",
    lineHeight: "1.5",
  },

  hashBox: {
    padding: "18px",
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    marginBottom: "24px",
    textAlign: "left",
  },

  hashLabel: {
    margin: "0 0 8px",
    fontWeight: "800",
    color: "#111827",
  },

  hash: {
    margin: 0,
    wordBreak: "break-all",
    fontFamily: "monospace",
    fontSize: "13px",
    color: "#374151",
  },

  trustBox: {
    textAlign: "left",
    marginBottom: "24px",
  },

  trustTitle: {
    fontSize: "22px",
    margin: "0 0 16px",
    color: "#111827",
  },

  trustGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "12px",
  },

  trustItem: {
    padding: "14px",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    color: "#374151",
    fontSize: "14px",
  },

  noticeBox: {
    textAlign: "left",
    padding: "16px",
    background: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: "16px",
    color: "#78350f",
    lineHeight: "1.5",
    marginBottom: "22px",
  },

  warningBox: {
    padding: "20px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "18px",
    color: "#991b1b",
    marginBottom: "22px",
  },

  primary: {
    background: "#4338ca",
    color: "#ffffff",
    border: "none",
    padding: "16px",
    borderRadius: "14px",
    width: "100%",
    fontWeight: "900",
    fontSize: "16px",
    cursor: "pointer",
  },

  secondary: {
    background: "#f3f4f6",
    color: "#111827",
    border: "1px solid #e5e7eb",
    padding: "14px",
    borderRadius: "14px",
    width: "100%",
    marginTop: "12px",
    cursor: "pointer",
    fontWeight: "800",
  },
}