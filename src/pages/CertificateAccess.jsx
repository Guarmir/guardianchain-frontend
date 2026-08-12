import {
  useState,
} from "react"

import {
  Link,
  useSearchParams,
} from "react-router-dom"

const CONTENT = {
  pt: {
    eyebrow: "Acesso protegido",
    title: "Acesse seu certificado",
    subtitle:
      "Informe a Evidence Key™ e sua Chave de Acesso privada.",
    evidenceLabel: "Evidence Key™",
    accessLabel: "Chave de Acesso",
    accessPlaceholder: "Digite sua Chave de Acesso",
    submit: "Acessar certificado",
    submitting: "Validando acesso...",
    success: "Acesso autorizado",
    successText:
      "Sua sessão segura foi criada. Você pode visualizar ou baixar o certificado pelos próximos minutos.",
    view: "Visualizar certificado",
    download: "Baixar certificado",
    forgot: "Esqueci minha Chave de Acesso",
    invalid:
      "Não foi possível autenticar o acesso. Confira os dados informados.",
    locked:
      "O acesso está temporariamente bloqueado após várias tentativas incorretas.",
    setup:
      "A proteção deste certificado ainda não foi configurada.",
    privacy:
      "A Evidence Key™ identifica a evidência, mas não substitui sua Chave de Acesso privada.",
    home: "Página inicial",
  },

  en: {
    eyebrow: "Protected access",
    title: "Access your certificate",
    subtitle:
      "Enter the Evidence Key™ and your private Access Key.",
    evidenceLabel: "Evidence Key™",
    accessLabel: "Access Key",
    accessPlaceholder: "Enter your Access Key",
    submit: "Access certificate",
    submitting: "Validating access...",
    success: "Access authorized",
    successText:
      "Your secure session has been created. You can view or download the certificate for the next few minutes.",
    view: "View certificate",
    download: "Download certificate",
    forgot: "I forgot my Access Key",
    invalid:
      "Access could not be authenticated. Check the information provided.",
    locked:
      "Access is temporarily locked after repeated incorrect attempts.",
    setup:
      "Certificate protection has not yet been configured.",
    privacy:
      "The Evidence Key™ identifies the evidence, but does not replace your private Access Key.",
    home: "Home",
  },
}

export default function CertificateAccess() {
  const [params] =
    useSearchParams()

  const lang =
    params.get("lang") === "pt"
      ? "pt"
      : "en"

  const t =
    CONTENT[lang]

  const [
    evidenceKey,
    setEvidenceKey,
  ] =
    useState(
      params.get("evidenceKey") || "",
    )

  const [
    accessKey,
    setAccessKey,
  ] =
    useState("")

  const [
    status,
    setStatus,
  ] =
    useState("idle")

  const [
    error,
    setError,
  ] =
    useState("")

  async function handleSubmit(
    event,
  ) {
    event.preventDefault()

    setError("")

    if (
      !evidenceKey.trim() ||
      !accessKey
    ) {
      setError(
        t.invalid,
      )

      return
    }

    setStatus(
      "loading",
    )

    try {
      const response =
        await fetch(
          "/api/certificate-access-login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials:
              "same-origin",

            body:
              JSON.stringify({
                evidenceKey,
                accessKey,
              }),
          },
        )

      const payload =
        await response.json()
          .catch(() => ({}))

      if (!response.ok) {
        if (
          response.status ===
          423
        ) {
          throw new Error(
            t.locked,
          )
        }

        if (
          response.status ===
          409
        ) {
          throw new Error(
            t.setup,
          )
        }

        throw new Error(
          t.invalid,
        )
      }

      if (
        !payload.authenticated
      ) {
        throw new Error(
          t.invalid,
        )
      }

      setEvidenceKey(
        payload.evidenceKey ||
          evidenceKey,
      )

      setAccessKey("")
      setStatus(
        "authenticated",
      )
    } catch (requestError) {
      setError(
        requestError?.message ||
          t.invalid,
      )

      setStatus(
        "idle",
      )
    }
  }

  function buildCertificateUrl(
    mode,
  ) {
    return (
      "/api/certificate-access-download" +
      `?evidenceKey=${encodeURIComponent(
        evidenceKey,
      )}` +
      `&lang=${lang}` +
      `&mode=${mode}`
    )
  }

  function handleView() {
    window.open(
      buildCertificateUrl(
        "view",
      ),
      "_blank",
      "noopener,noreferrer",
    )
  }

  function handleDownload() {
    window.location.href =
      buildCertificateUrl(
        "download",
      )
  }

  const recoveryUrl =
    `/certificate-access/recover?lang=${lang}` +
    (
      evidenceKey.trim()
        ? `&evidenceKey=${encodeURIComponent(
            evidenceKey.trim(),
          )}`
        : ""
    )

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.icon}>
          🔐
        </div>

        <p style={styles.eyebrow}>
          {t.eyebrow}
        </p>

        <h1 style={styles.title}>
          {status ===
          "authenticated"
            ? t.success
            : t.title}
        </h1>

        {status ===
        "authenticated" ? (
          <>
            <p style={styles.description}>
              {t.successText}
            </p>

            <div style={styles.evidenceBox}>
              <span style={styles.smallLabel}>
                Evidence Key™
              </span>

              <strong style={styles.evidence}>
                {evidenceKey}
              </strong>
            </div>

            <button
              type="button"
              onClick={handleView}
              style={styles.primaryButton}
            >
              {t.view}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              style={styles.secondaryButton}
            >
              {t.download}
            </button>
          </>
        ) : (
          <>
            <p style={styles.description}>
              {t.subtitle}
            </p>

            <form
              onSubmit={handleSubmit}
              style={styles.form}
            >
              <label style={styles.label}>
                {t.evidenceLabel}

                <input
                  type="text"
                  value={evidenceKey}
                  onChange={(event) =>
                    setEvidenceKey(
                      event.target.value,
                    )
                  }
                  autoComplete="off"
                  style={styles.input}
                />
              </label>

              <label style={styles.label}>
                {t.accessLabel}

                <input
                  type="password"
                  value={accessKey}
                  onChange={(event) =>
                    setAccessKey(
                      event.target.value,
                    )
                  }
                  placeholder={
                    t.accessPlaceholder
                  }
                  autoComplete="current-password"
                  style={styles.input}
                />
              </label>

              {error && (
                <div style={styles.errorBox}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  status ===
                  "loading"
                }
                style={styles.primaryButton}
              >
                {status ===
                "loading"
                  ? t.submitting
                  : t.submit}
              </button>
            </form>

            <Link
              to={recoveryUrl}
              style={styles.recoveryLink}
            >
              {t.forgot}
            </Link>
          </>
        )}

        <div style={styles.securityBox}>
          🔒 {t.privacy}
        </div>

        <Link
          to={`/?lang=${lang}`}
          style={styles.homeLink}
        >
          {t.home}
        </Link>
      </section>
    </main>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 18px",
    boxSizing: "border-box",
    background:
      "linear-gradient(180deg,#6366f1 0%,#4f46e5 48%,#312e81 100%)",
  },

  card: {
    width: "100%",
    maxWidth: "600px",
    padding: "38px 30px",
    background: "#ffffff",
    color: "#111827",
    borderRadius: "24px",
    boxSizing: "border-box",
    boxShadow:
      "0 24px 60px rgba(0,0,0,0.25)",
  },

  icon: {
    width: "58px",
    height: "58px",
    margin: "0 auto 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eef2ff",
    borderRadius: "18px",
    fontSize: "28px",
  },

  eyebrow: {
    margin: "0 0 10px",
    textAlign: "center",
    color: "#4f46e5",
    fontSize: "13px",
    fontWeight: "900",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },

  title: {
    margin: "0 0 16px",
    textAlign: "center",
    fontSize: "32px",
  },

  description: {
    margin: "0 auto 26px",
    textAlign: "center",
    color: "#4b5563",
    lineHeight: "1.7",
  },

  form: {
    display: "grid",
    gap: "18px",
  },

  label: {
    display: "grid",
    gap: "8px",
    color: "#374151",
    fontWeight: "800",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    padding: "14px 15px",
    border: "1px solid #d1d5db",
    borderRadius: "11px",
    boxSizing: "border-box",
    fontSize: "16px",
  },

  primaryButton: {
    width: "100%",
    marginTop: "8px",
    padding: "15px 18px",
    border: "none",
    borderRadius: "12px",
    background: "#4f46e5",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "900",
    cursor: "pointer",
  },

  secondaryButton: {
    width: "100%",
    marginTop: "12px",
    padding: "15px 18px",
    border: "1px solid #c7d2fe",
    borderRadius: "12px",
    background: "#eef2ff",
    color: "#3730a3",
    fontSize: "16px",
    fontWeight: "900",
    cursor: "pointer",
  },

  errorBox: {
    padding: "14px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "12px",
    color: "#991b1b",
  },

  recoveryLink: {
    display: "block",
    marginTop: "20px",
    textAlign: "center",
    color: "#4338ca",
    fontWeight: "800",
  },

  evidenceBox: {
    marginBottom: "18px",
    padding: "18px",
    background: "#eef2ff",
    borderRadius: "14px",
    textAlign: "center",
  },

  smallLabel: {
    display: "block",
    marginBottom: "7px",
    color: "#6b7280",
    fontSize: "12px",
    fontWeight: "800",
  },

  evidence: {
    color: "#312e81",
    overflowWrap: "anywhere",
  },

  securityBox: {
    marginTop: "26px",
    padding: "14px",
    background: "#f9fafb",
    borderRadius: "12px",
    color: "#6b7280",
    fontSize: "13px",
    lineHeight: "1.6",
  },

  homeLink: {
    display: "block",
    marginTop: "20px",
    textAlign: "center",
    color: "#4b5563",
  },
}