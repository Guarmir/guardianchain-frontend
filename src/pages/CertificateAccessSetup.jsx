import {
  useMemo,
  useState,
} from "react"

import {
  Link,
  useSearchParams,
} from "react-router-dom"

const CONTENT = {
  pt: {
    eyebrow:
      "Proteção do certificado",

    title:
      "Crie sua Chave de Acesso",

    subtitle:
      "Esta chave protegerá a visualização e o download do seu certificado GuardianChain.",

    important:
      "A GuardianChain não poderá consultar ou revelar sua chave depois que ela for criada.",

    keyLabel:
      "Chave de Acesso",

    keyPlaceholder:
      "Crie uma chave segura",

    confirmLabel:
      "Confirmar Chave de Acesso",

    confirmPlaceholder:
      "Digite novamente sua chave",

    requirementsTitle:
      "Sua chave deve conter:",

    requirements: [
      "Pelo menos 14 caracteres",
      "Uma letra maiúscula",
      "Uma letra minúscula",
      "Um número",
      "Um caractere especial",
    ],

    submit:
      "Ativar proteção do certificado",

    submitting:
      "Configurando proteção...",

    mismatch:
      "As duas chaves não são iguais.",

    invalidKey:
      "A Chave de Acesso ainda não atende aos requisitos de segurança.",

    genericError:
      "Este link de configuração expirou, já foi utilizado ou não está mais disponível.",

    requestTitle:
      "Precisa de um novo link?",

    requestDescription:
      "Informe a Evidence Key™ do certificado. Se a configuração ainda estiver disponível, enviaremos um novo link ao e-mail cadastrado.",

    evidenceLabel:
      "Evidence Key™",

    requestButton:
      "Enviar novo link",

    requesting:
      "Enviando...",

    requestSuccess:
      "Solicitação recebida",

    requestSuccessDescription:
      "Se o certificado estiver apto para configuração, um novo link será enviado ao e-mail cadastrado.",

    recoveryEyebrow:
      "Proteção ativada",

    recoveryTitle:
      "Guarde seu Código de Recuperação",

    recoveryDescription:
      "Este código será necessário caso você esqueça sua Chave de Acesso. Ele será mostrado somente agora.",

    recoveryWarning:
      "Não envie este código por e-mail, mensagem ou junto com o certificado. Guarde-o em um local privado e seguro.",

    recoveryLabel:
      "Código de Recuperação",

    copy:
      "Copiar código",

    copied:
      "Código copiado",

    confirmation:
      "Eu salvei meu Código de Recuperação em um local seguro.",

    finish:
      "Concluir configuração",

    completeEyebrow:
      "Certificado protegido",

    completeTitle:
      "Proteção configurada com sucesso",

    completeDescription:
      "Sua Chave de Acesso foi configurada. A GuardianChain armazena somente os dados criptográficos necessários para validá-la.",

    completeRecovery:
      "O Código de Recuperação não será mostrado novamente. Caso seja utilizado em uma recuperação futura, um novo código será gerado.",

    access:
      "Acessar meu certificado",

    home:
      "Voltar à página inicial",

    privacy:
      "Seu arquivo original continua privado e não é armazenado pela GuardianChain.",
  },

  en: {
    eyebrow:
      "Certificate protection",

    title:
      "Create your Access Key",

    subtitle:
      "This key will protect access to viewing and downloading your GuardianChain certificate.",

    important:
      "GuardianChain will not be able to retrieve or reveal your key after it has been created.",

    keyLabel:
      "Access Key",

    keyPlaceholder:
      "Create a secure key",

    confirmLabel:
      "Confirm Access Key",

    confirmPlaceholder:
      "Enter your key again",

    requirementsTitle:
      "Your key must contain:",

    requirements: [
      "At least 14 characters",
      "One uppercase letter",
      "One lowercase letter",
      "One number",
      "One special character",
    ],

    submit:
      "Activate certificate protection",

    submitting:
      "Configuring protection...",

    mismatch:
      "The two access keys do not match.",

    invalidKey:
      "The Access Key does not yet meet the security requirements.",

    genericError:
      "This setup link has expired, has already been used, or is no longer available.",

    requestTitle:
      "Need a new link?",

    requestDescription:
      "Enter the certificate Evidence Key™. If setup is still available, a new link will be sent to the registered email address.",

    evidenceLabel:
      "Evidence Key™",

    requestButton:
      "Send new link",

    requesting:
      "Sending...",

    requestSuccess:
      "Request received",

    requestSuccessDescription:
      "If the certificate is eligible for setup, a new link will be sent to the registered email address.",

    recoveryEyebrow:
      "Protection activated",

    recoveryTitle:
      "Save your Recovery Code",

    recoveryDescription:
      "You will need this code if you ever forget your Access Key. It will only be displayed now.",

    recoveryWarning:
      "Do not send this code by email or message, and do not store it with the certificate. Keep it somewhere private and secure.",

    recoveryLabel:
      "Recovery Code",

    copy:
      "Copy code",

    copied:
      "Code copied",

    confirmation:
      "I saved my Recovery Code in a secure place.",

    finish:
      "Finish setup",

    completeEyebrow:
      "Certificate protected",

    completeTitle:
      "Protection configured successfully",

    completeDescription:
      "Your Access Key has been configured. GuardianChain stores only the cryptographic data required to validate it.",

    completeRecovery:
      "The Recovery Code will not be displayed again. If it is used for future recovery, a new code will be generated.",

    access:
      "Access my certificate",

    home:
      "Return to home",

    privacy:
      "Your original file remains private and is never stored by GuardianChain.",
  },
}

function validateAccessKey(
  value,
) {
  const accessKey =
    String(value || "")

  return (
    accessKey.length >= 14 &&
    accessKey.length <= 128 &&
    /[a-z]/.test(accessKey) &&
    /[A-Z]/.test(accessKey) &&
    /[0-9]/.test(accessKey) &&
    /[^A-Za-z0-9]/.test(
      accessKey,
    )
  )
}

export default function CertificateAccessSetup() {
  const [params] =
    useSearchParams()

  const lang =
    params.get("lang") === "pt"
      ? "pt"
      : "en"

  const setupToken =
    useMemo(
      () =>
        String(
          params.get("token") ||
            "",
        ).trim(),
      [params],
    )

  const t =
    CONTENT[lang]

  const [
    accessKey,
    setAccessKey,
  ] =
    useState("")

  const [
    confirmationKey,
    setConfirmationKey,
  ] =
    useState("")

  const [
    evidenceKey,
    setEvidenceKey,
  ] =
    useState("")

  const [
    recoveryCode,
    setRecoveryCode,
  ] =
    useState("")

  const [
    acknowledged,
    setAcknowledged,
  ] =
    useState(false)

  const [
    copied,
    setCopied,
  ] =
    useState(false)

  const [
    status,
    setStatus,
  ] =
    useState(
      setupToken
        ? "setup"
        : "request",
    )

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
      !validateAccessKey(
        accessKey,
      )
    ) {
      setError(
        t.invalidKey,
      )

      return
    }

    if (
      accessKey !==
      confirmationKey
    ) {
      setError(
        t.mismatch,
      )

      return
    }

    setStatus(
      "submitting",
    )

    try {
      const response =
        await fetch(
          "/api/certificate-access-setup",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                setupToken,
                accessKey,
              }),
          },
        )

      const payload =
        await response.json()
          .catch(() => ({}))

      if (
        !response.ok ||
        !payload.configured ||
        !payload.recoveryCode
      ) {
        const message =
          String(
            payload.error ||
              "",
          )

        if (
          message.includes(
            "at least 14 characters",
          ) ||
          message.includes(
            "lowercase",
          ) ||
          message.includes(
            "uppercase",
          ) ||
          message.includes(
            "number",
          ) ||
          message.includes(
            "special character",
          )
        ) {
          throw new Error(
            message,
          )
        }

        setStatus(
          "request",
        )

        throw new Error(
          t.genericError,
        )
      }

      setRecoveryCode(
        payload.recoveryCode,
      )

      setEvidenceKey(
        payload.certificate
          ?.evidenceKey ||
          "",
      )

      setAccessKey("")
      setConfirmationKey("")

      window.history.replaceState(
        {},
        "",
        `/certificate-access/setup?lang=${lang}`,
      )

      setStatus(
        "recovery",
      )
    } catch (
      requestError
    ) {
      setError(
        requestError?.message ||
          t.genericError,
      )

      if (
        status ===
        "submitting"
      ) {
        setStatus(
          "request",
        )
      }
    }
  }

  async function handleRequestNewLink(
    event,
  ) {
    event.preventDefault()

    setError("")

    if (
      !evidenceKey.trim()
    ) {
      return
    }

    setStatus(
      "requesting",
    )

    try {
      const response =
        await fetch(
          "/api/certificate-access-setup-request",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                evidenceKey,
              }),
          },
        )

      if (!response.ok) {
        throw new Error()
      }

      setStatus(
        "request-sent",
      )
    } catch {
      setError(
        lang === "pt"
          ? "Não foi possível processar a solicitação."
          : "The request could not be processed.",
      )

      setStatus(
        "request",
      )
    }
  }

  async function handleCopy() {
    if (
      !recoveryCode
    ) {
      return
    }

    try {
      await navigator.clipboard.writeText(
        recoveryCode,
      )

      setCopied(true)

      window.setTimeout(
        () => {
          setCopied(false)
        },
        2000,
      )
    } catch {
      setCopied(false)
    }
  }

  if (
    status ===
    "complete"
  ) {
    const accessUrl =
      `/certificate-access?lang=${lang}` +
      (
        evidenceKey
          ? `&evidenceKey=${encodeURIComponent(
              evidenceKey,
            )}`
          : ""
      )

    return (
      <Page>
        <div style={styles.successIcon}>
          ✓
        </div>

        <p style={styles.eyebrow}>
          {t.completeEyebrow}
        </p>

        <h1 style={styles.title}>
          {t.completeTitle}
        </h1>

        <p style={styles.description}>
          {t.completeDescription}
        </p>

        <div style={styles.securityBox}>
          {t.completeRecovery}
        </div>

        <Link
          to={accessUrl}
          style={styles.primaryLink}
        >
          {t.access}
        </Link>

        <Link
          to={`/?lang=${lang}`}
          style={styles.homeLink}
        >
          {t.home}
        </Link>
      </Page>
    )
  }

  if (
    status ===
    "recovery"
  ) {
    return (
      <Page>
        <div style={styles.successIcon}>
          ✓
        </div>

        <p style={styles.eyebrow}>
          {t.recoveryEyebrow}
        </p>

        <h1 style={styles.title}>
          {t.recoveryTitle}
        </h1>

        <p style={styles.description}>
          {t.recoveryDescription}
        </p>

        <div style={styles.warningBox}>
          {t.recoveryWarning}
        </div>

        <div style={styles.recoveryBox}>
          <span style={styles.recoveryLabel}>
            {t.recoveryLabel}
          </span>

          <code style={styles.recoveryCode}>
            {recoveryCode}
          </code>

          <button
            type="button"
            onClick={handleCopy}
            style={styles.copyButton}
          >
            {copied
              ? t.copied
              : t.copy}
          </button>
        </div>

        <label style={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(event) =>
              setAcknowledged(
                event.target.checked,
              )
            }
          />

          <span>
            {t.confirmation}
          </span>
        </label>

        <button
          type="button"
          disabled={!acknowledged}
          onClick={() => {
            setRecoveryCode("")
            setStatus(
              "complete",
            )
          }}
          style={{
            ...styles.primaryButton,

            ...(!acknowledged
              ? styles.disabledButton
              : {}),
          }}
        >
          {t.finish}
        </button>
      </Page>
    )
  }

  if (
    status ===
    "request-sent"
  ) {
    return (
      <Page>
        <div style={styles.successIcon}>
          ✓
        </div>

        <h1 style={styles.title}>
          {t.requestSuccess}
        </h1>

        <p style={styles.description}>
          {t.requestSuccessDescription}
        </p>

        <Link
          to={`/?lang=${lang}`}
          style={styles.homeLink}
        >
          {t.home}
        </Link>
      </Page>
    )
  }

  if (
    status === "request" ||
    status === "requesting"
  ) {
    return (
      <Page>
        <div style={styles.lockIcon}>
          🔐
        </div>

        <h1 style={styles.title}>
          {t.requestTitle}
        </h1>

        <p style={styles.description}>
          {t.requestDescription}
        </p>

        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        <form
          onSubmit={handleRequestNewLink}
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

          <button
            type="submit"
            disabled={
              status ===
              "requesting"
            }
            style={styles.primaryButton}
          >
            {status ===
            "requesting"
              ? t.requesting
              : t.requestButton}
          </button>
        </form>
      </Page>
    )
  }

  return (
    <Page>
      <div style={styles.lockIcon}>
        🔐
      </div>

      <p style={styles.eyebrow}>
        {t.eyebrow}
      </p>

      <h1 style={styles.title}>
        {t.title}
      </h1>

      <p style={styles.description}>
        {t.subtitle}
      </p>

      <div style={styles.securityBox}>
        <strong>
          {lang === "pt"
            ? "Privacidade:"
            : "Privacy:"}
        </strong>

        <p style={styles.securityText}>
          {t.important}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={styles.form}
      >
        <label style={styles.label}>
          {t.keyLabel}

          <input
            type="password"
            value={accessKey}
            onChange={(event) =>
              setAccessKey(
                event.target.value,
              )
            }
            placeholder={
              t.keyPlaceholder
            }
            autoComplete="new-password"
            maxLength={128}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          {t.confirmLabel}

          <input
            type="password"
            value={confirmationKey}
            onChange={(event) =>
              setConfirmationKey(
                event.target.value,
              )
            }
            placeholder={
              t.confirmPlaceholder
            }
            autoComplete="new-password"
            maxLength={128}
            style={styles.input}
          />
        </label>

        <div style={styles.requirementsBox}>
          <strong>
            {t.requirementsTitle}
          </strong>

          <ul style={styles.requirements}>
            {t.requirements.map(
              (requirement) => (
                <li key={requirement}>
                  {requirement}
                </li>
              ),
            )}
          </ul>
        </div>

        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={
            status ===
            "submitting"
          }
          style={styles.primaryButton}
        >
          {status ===
          "submitting"
            ? t.submitting
            : t.submit}
        </button>
      </form>

      <p style={styles.privacy}>
        🔒 {t.privacy}
      </p>
    </Page>
  )
}

function Page({
  children,
}) {
  return (
    <main style={styles.page}>
      <section style={styles.card}>
        {children}
      </section>
    </main>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 18px",
    boxSizing: "border-box",
    background:
      "linear-gradient(180deg,#6366f1 0%,#4f46e5 48%,#312e81 100%)",
  },

  card: {
    width: "100%",
    maxWidth: "620px",
    padding: "38px 30px",
    boxSizing: "border-box",
    borderRadius: "24px",
    background: "#ffffff",
    color: "#1f2937",
    boxShadow:
      "0 24px 60px rgba(0,0,0,0.25)",
  },

  lockIcon: {
    width: "58px",
    height: "58px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 18px",
    borderRadius: "18px",
    background: "#eef2ff",
    fontSize: "28px",
  },

  successIcon: {
    width: "58px",
    height: "58px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 18px",
    borderRadius: "50%",
    background: "#ecfdf5",
    color: "#047857",
    fontSize: "30px",
    fontWeight: "900",
  },

  eyebrow: {
    margin: "0 0 10px",
    color: "#4f46e5",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontSize: "13px",
    fontWeight: "900",
  },

  title: {
    margin: "0 0 16px",
    textAlign: "center",
    color: "#111827",
    fontSize: "32px",
    lineHeight: "1.2",
  },

  description: {
    maxWidth: "520px",
    margin: "0 auto 24px",
    color: "#4b5563",
    textAlign: "center",
    fontSize: "16px",
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
    fontSize: "14px",
    fontWeight: "800",
  },

  input: {
    width: "100%",
    padding: "14px 15px",
    border: "1px solid #d1d5db",
    borderRadius: "11px",
    boxSizing: "border-box",
    fontSize: "16px",
  },

  securityBox: {
    marginBottom: "24px",
    padding: "16px",
    border: "1px solid #c7d2fe",
    borderRadius: "14px",
    background: "#eef2ff",
    color: "#312e81",
  },

  securityText: {
    margin: "6px 0 0",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  requirementsBox: {
    padding: "15px 17px",
    borderRadius: "12px",
    background: "#f9fafb",
    color: "#4b5563",
    fontSize: "14px",
  },

  requirements: {
    margin: "9px 0 0",
    paddingLeft: "20px",
    lineHeight: "1.7",
  },

  errorBox: {
    marginBottom: "16px",
    padding: "14px 16px",
    border: "1px solid #fecaca",
    borderRadius: "12px",
    background: "#fef2f2",
    color: "#991b1b",
  },

  primaryButton: {
    width: "100%",
    padding: "15px 18px",
    border: "none",
    borderRadius: "12px",
    background: "#4f46e5",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "900",
  },

  disabledButton: {
    opacity: 0.5,
    cursor: "not-allowed",
  },

  warningBox: {
    marginBottom: "22px",
    padding: "16px",
    border: "1px solid #fbbf24",
    borderRadius: "14px",
    background: "#fffbeb",
    color: "#78350f",
  },

  recoveryBox: {
    marginBottom: "22px",
    padding: "20px",
    border: "2px solid #c7d2fe",
    borderRadius: "16px",
    background: "#f5f7ff",
    textAlign: "center",
  },

  recoveryLabel: {
    display: "block",
    marginBottom: "10px",
    color: "#4b5563",
    fontSize: "13px",
    fontWeight: "900",
  },

  recoveryCode: {
    display: "block",
    marginBottom: "16px",
    color: "#312e81",
    overflowWrap: "anywhere",
    fontSize: "17px",
    fontWeight: "900",
  },

  copyButton: {
    padding: "10px 16px",
    border: "1px solid #c7d2fe",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#4338ca",
    cursor: "pointer",
    fontWeight: "800",
  },

  checkboxRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "20px",
    color: "#374151",
    fontSize: "14px",
  },

  primaryLink: {
    display: "block",
    width: "100%",
    padding: "15px",
    borderRadius: "12px",
    background: "#4f46e5",
    color: "#ffffff",
    textAlign: "center",
    textDecoration: "none",
    fontWeight: "900",
    boxSizing: "border-box",
  },

  homeLink: {
    display: "block",
    marginTop: "20px",
    color: "#4b5563",
    textAlign: "center",
  },

  privacy: {
    margin: "24px 0 0",
    color: "#6b7280",
    textAlign: "center",
    fontSize: "12px",
  },
}