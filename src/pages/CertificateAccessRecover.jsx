import {
  useState,
} from "react"

import {
  Link,
  useSearchParams,
} from "react-router-dom"

const CONTENT = {
  pt: {
    requestTitle:
      "Recuperar acesso",
    requestText:
      "Informe a Evidence Key™. Se o certificado estiver apto para recuperação, enviaremos instruções ao e-mail cadastrado.",
    evidence:
      "Evidence Key™",
    send:
      "Enviar instruções",
    sending:
      "Enviando...",
    sent:
      "Solicitação recebida",
    sentText:
      "Se o certificado estiver apto para recuperação, as instruções serão enviadas ao e-mail cadastrado.",

    recoverTitle:
      "Crie uma nova Chave de Acesso",
    recoverText:
      "Informe seu Código de Recuperação e escolha uma nova Chave de Acesso.",
    recoveryCode:
      "Código de Recuperação",
    newKey:
      "Nova Chave de Acesso",
    confirmKey:
      "Confirmar nova chave",
    recover:
      "Alterar Chave de Acesso",
    recovering:
      "Alterando chave...",
    mismatch:
      "As duas chaves não são iguais.",
    invalidKey:
      "A nova chave deve ter pelo menos 14 caracteres, maiúscula, minúscula, número e caractere especial.",
    invalidRecovery:
      "O link ou Código de Recuperação é inválido, expirou ou não está mais disponível.",

    successTitle:
      "Chave alterada com sucesso",
    successText:
      "As sessões anteriores foram invalidadas. Agora guarde seu novo Código de Recuperação.",
    newRecovery:
      "Novo Código de Recuperação",
    warning:
      "Este código será mostrado somente agora. Guarde-o em um local separado da Chave de Acesso.",
    saved:
      "Eu salvei meu novo Código de Recuperação.",
    finish:
      "Concluir",
    access:
      "Acessar certificado",
    home:
      "Página inicial",
  },

  en: {
    requestTitle:
      "Recover access",
    requestText:
      "Enter the Evidence Key™. If the certificate is eligible for recovery, instructions will be sent to the registered email address.",
    evidence:
      "Evidence Key™",
    send:
      "Send instructions",
    sending:
      "Sending...",
    sent:
      "Request received",
    sentText:
      "If the certificate is eligible for recovery, instructions will be sent to the registered email address.",

    recoverTitle:
      "Create a new Access Key",
    recoverText:
      "Enter your Recovery Code and choose a new Access Key.",
    recoveryCode:
      "Recovery Code",
    newKey:
      "New Access Key",
    confirmKey:
      "Confirm new Access Key",
    recover:
      "Change Access Key",
    recovering:
      "Changing key...",
    mismatch:
      "The two keys do not match.",
    invalidKey:
      "The new key must contain at least 14 characters, uppercase, lowercase, a number and a special character.",
    invalidRecovery:
      "The recovery link or Recovery Code is invalid, expired or no longer available.",

    successTitle:
      "Access Key changed successfully",
    successText:
      "Previous sessions were invalidated. Now save your new Recovery Code.",
    newRecovery:
      "New Recovery Code",
    warning:
      "This code will only be displayed now. Keep it somewhere separate from your Access Key.",
    saved:
      "I saved my new Recovery Code.",
    finish:
      "Finish",
    access:
      "Access certificate",
    home:
      "Home",
  },
}

function validKey(
  value,
) {
  return (
    value.length >= 14 &&
    value.length <= 128 &&
    /[a-z]/.test(value) &&
    /[A-Z]/.test(value) &&
    /[0-9]/.test(value) &&
    /[^A-Za-z0-9]/.test(
      value,
    )
  )
}

export default function CertificateAccessRecover() {
  const [params] =
    useSearchParams()

  const lang =
    params.get("lang") === "pt"
      ? "pt"
      : "en"

  const t =
    CONTENT[lang]

  const recoveryToken =
    String(
      params.get("token") ||
        "",
    ).trim()

  const [
    evidenceKey,
    setEvidenceKey,
  ] =
    useState(
      params.get("evidenceKey") ||
        "",
    )

  const [
    recoveryCode,
    setRecoveryCode,
  ] =
    useState("")

  const [
    newKey,
    setNewKey,
  ] =
    useState("")

  const [
    confirmKey,
    setConfirmKey,
  ] =
    useState("")

  const [
    newRecoveryCode,
    setNewRecoveryCode,
  ] =
    useState("")

  const [
    recoveredEvidenceKey,
    setRecoveredEvidenceKey,
  ] =
    useState("")

  const [
    acknowledged,
    setAcknowledged,
  ] =
    useState(false)

  const [
    status,
    setStatus,
  ] =
    useState(
      recoveryToken
        ? "recover"
        : "request",
    )

  const [
    error,
    setError,
  ] =
    useState("")

  async function requestRecovery(
    event,
  ) {
    event.preventDefault()

    setError("")

    if (!evidenceKey.trim()) {
      return
    }

    setStatus("sending")

    try {
      const response =
        await fetch(
          "/api/certificate-access-recovery-request",
          {
            method: "POST",

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

      setStatus("sent")
    } catch {
      setError(
        lang === "pt"
          ? "Não foi possível processar a solicitação."
          : "The request could not be processed.",
      )

      setStatus("request")
    }
  }

  async function handleRecovery(
    event,
  ) {
    event.preventDefault()

    setError("")

    if (!validKey(newKey)) {
      setError(
        t.invalidKey,
      )
      return
    }

    if (
      newKey !==
      confirmKey
    ) {
      setError(
        t.mismatch,
      )
      return
    }

    setStatus(
      "recovering",
    )

    try {
      const response =
        await fetch(
          "/api/certificate-access-recovery",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                recoveryToken,
                recoveryCode,
                newAccessKey:
                  newKey,
              }),
          },
        )

      const payload =
        await response.json()
          .catch(() => ({}))

      if (
        !response.ok ||
        !payload.recovered
      ) {
        throw new Error(
          payload.error ||
            t.invalidRecovery,
        )
      }

      setNewRecoveryCode(
        payload.recoveryCode,
      )

      setRecoveredEvidenceKey(
        payload.certificate
          ?.evidenceKey ||
          "",
      )

      setNewKey("")
      setConfirmKey("")
      setRecoveryCode("")

      window.history.replaceState(
        {},
        "",
        `/certificate-access/recover?lang=${lang}`,
      )

      setStatus("success")
    } catch {
      setError(
        t.invalidRecovery,
      )

      setStatus("recover")
    }
  }

  if (
    status === "sent"
  ) {
    return (
      <Page>
        <h1>{t.sent}</h1>

        <p>{t.sentText}</p>

        <Link
          to={`/?lang=${lang}`}
          style={styles.link}
        >
          {t.home}
        </Link>
      </Page>
    )
  }

  if (
    status === "success"
  ) {
    const accessUrl =
      `/certificate-access?lang=${lang}` +
      (
        recoveredEvidenceKey
          ? `&evidenceKey=${encodeURIComponent(
              recoveredEvidenceKey,
            )}`
          : ""
      )

    return (
      <Page>
        <h1>
          {t.successTitle}
        </h1>

        <p>
          {t.successText}
        </p>

        <div style={styles.warning}>
          {t.warning}
        </div>

        <div style={styles.codeBox}>
          <span>
            {t.newRecovery}
          </span>

          <strong>
            {newRecoveryCode}
          </strong>
        </div>

        <label style={styles.check}>
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(event) =>
              setAcknowledged(
                event.target.checked,
              )
            }
          />

          {t.saved}
        </label>

        {acknowledged && (
          <Link
            to={accessUrl}
            style={styles.primaryLink}
          >
            {t.access}
          </Link>
        )}
      </Page>
    )
  }

  if (
    !recoveryToken
  ) {
    return (
      <Page>
        <h1>
          {t.requestTitle}
        </h1>

        <p>
          {t.requestText}
        </p>

        <form
          onSubmit={requestRecovery}
          style={styles.form}
        >
          <label style={styles.label}>
            {t.evidence}

            <input
              value={evidenceKey}
              onChange={(event) =>
                setEvidenceKey(
                  event.target.value,
                )
              }
              style={styles.input}
            />
          </label>

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <button
            style={styles.button}
            disabled={
              status ===
              "sending"
            }
          >
            {status ===
            "sending"
              ? t.sending
              : t.send}
          </button>
        </form>
      </Page>
    )
  }

  return (
    <Page>
      <h1>
        {t.recoverTitle}
      </h1>

      <p>
        {t.recoverText}
      </p>

      <form
        onSubmit={
          handleRecovery
        }
        style={styles.form}
      >
        <label style={styles.label}>
          {t.recoveryCode}

          <input
            value={recoveryCode}
            onChange={(event) =>
              setRecoveryCode(
                event.target.value,
              )
            }
            autoComplete="off"
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          {t.newKey}

          <input
            type="password"
            value={newKey}
            onChange={(event) =>
              setNewKey(
                event.target.value,
              )
            }
            autoComplete="new-password"
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          {t.confirmKey}

          <input
            type="password"
            value={confirmKey}
            onChange={(event) =>
              setConfirmKey(
                event.target.value,
              )
            }
            autoComplete="new-password"
            style={styles.input}
          />
        </label>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <button
          style={styles.button}
          disabled={
            status ===
            "recovering"
          }
        >
          {status ===
          "recovering"
            ? t.recovering
            : t.recover}
        </button>
      </form>
    </Page>
  )
}

function Page({
  children,
}) {
  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.icon}>
          🔐
        </div>

        {children}
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
    background:
      "linear-gradient(180deg,#6366f1,#312e81)",
    boxSizing: "border-box",
  },

  card: {
    width: "100%",
    maxWidth: "620px",
    padding: "38px 30px",
    background: "#ffffff",
    color: "#111827",
    borderRadius: "24px",
    boxSizing: "border-box",
  },

  icon: {
    textAlign: "center",
    fontSize: "32px",
    marginBottom: "18px",
  },

  form: {
    display: "grid",
    gap: "18px",
    marginTop: "24px",
  },

  label: {
    display: "grid",
    gap: "8px",
    fontWeight: "800",
  },

  input: {
    width: "100%",
    padding: "14px",
    border:
      "1px solid #d1d5db",
    borderRadius: "11px",
    boxSizing: "border-box",
    fontSize: "16px",
  },

  button: {
    padding: "15px",
    border: "none",
    borderRadius: "12px",
    background: "#4f46e5",
    color: "#ffffff",
    fontWeight: "900",
    cursor: "pointer",
  },

  error: {
    padding: "14px",
    background: "#fef2f2",
    color: "#991b1b",
    borderRadius: "12px",
  },

  warning: {
    padding: "14px",
    margin: "20px 0",
    background: "#fffbeb",
    color: "#78350f",
    borderRadius: "12px",
  },

  codeBox: {
    display: "grid",
    gap: "8px",
    padding: "20px",
    background: "#eef2ff",
    borderRadius: "14px",
    textAlign: "center",
    overflowWrap: "anywhere",
  },

  check: {
    display: "flex",
    gap: "10px",
    margin: "20px 0",
  },

  primaryLink: {
    display: "block",
    padding: "15px",
    background: "#4f46e5",
    color: "#ffffff",
    borderRadius: "12px",
    textAlign: "center",
    textDecoration: "none",
    fontWeight: "900",
  },

  link: {
    color: "#4338ca",
  },
}