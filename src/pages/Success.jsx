import {
  Link,
  useSearchParams,
} from "react-router-dom"

import {
  useEffect,
} from "react"

export default function Success() {
  const [params] =
    useSearchParams()

  const langParam =
    params.get("lang")

  const lang =
    langParam === "pt"
      ? "pt"
      : "en"

  const sessionId =
    params.get(
      "session_id",
    )

  useEffect(() => {
    if (
      typeof window.gtag !==
        "function"
    ) {
      return
    }

    /*
     * Do not report a fixed US$ 8 value here anymore:
     * GuardianChain now has multiple commercial packages.
     * The exact revenue value will be connected to the
     * selected product separately.
     */
    window.gtag(
      "event",
      "purchase",
      {
        transaction_id:
          sessionId ||
          "unknown",
      },
    )

    window.gtag(
      "event",
      "conversion",
      {
        send_to:
          "AW-18086374211/9ucuCKWmhKEcEMPWoLBD",

        transaction_id:
          sessionId ||
          "",
      },
    )
  }, [
    sessionId,
  ])

  const content = {
    pt: {
      eyebrow:
        "Pagamento confirmado",

      title:
        "Seu registro foi criado",

      description:
        "Seu certificado está sendo preparado com proteção de acesso.",

      email:
        "Enviamos para o e-mail utilizado na compra um link seguro para criar sua Chave de Acesso.",

      securityTitle:
        "O certificado não é enviado como PDF aberto",

      security:
        "Primeiro você cria sua Chave de Acesso privada. Depois, a Evidence Key™ e essa chave serão necessárias para acessar, visualizar ou baixar o certificado.",

      emailTip:
        "Se não encontrar a mensagem, verifique também a pasta de spam ou lixo eletrônico.",

      access:
        "Acessar certificado",

      another:
        "Registrar outro arquivo",

      home:
        "Página inicial",

      privacy:
        "Seu arquivo original permanece privado e não é armazenado pela GuardianChain.",
    },

    en: {
      eyebrow:
        "Payment confirmed",

      title:
        "Your record was created",

      description:
        "Your certificate is being prepared with access protection.",

      email:
        "We sent a secure link to the email address used for the purchase so you can create your Access Key.",

      securityTitle:
        "The certificate is not sent as an open PDF",

      security:
        "First you create your private Access Key. After that, the Evidence Key™ and this key will be required to access, view or download the certificate.",

      emailTip:
        "If you cannot find the message, also check your spam or junk folder.",

      access:
        "Access certificate",

      another:
        "Register another file",

      home:
        "Home",

      privacy:
        "Your original file remains private and is never stored by GuardianChain.",
    },
  }

  const t =
    content[lang]

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.successIcon}>
          ✓
        </div>

        <p style={styles.eyebrow}>
          {t.eyebrow}
        </p>

        <h1 style={styles.title}>
          {t.title}
        </h1>

        <p style={styles.description}>
          {t.description}
        </p>

        <div style={styles.emailBox}>
          <strong>
            📧 {t.email}
          </strong>

          <p style={styles.emailTip}>
            {t.emailTip}
          </p>
        </div>

        <div style={styles.securityBox}>
          <strong>
            🔐 {t.securityTitle}
          </strong>

          <p style={styles.securityText}>
            {t.security}
          </p>
        </div>

        <Link
          to={`/certificate-access?lang=${lang}`}
          style={styles.primaryLink}
        >
          {t.access}
        </Link>

        <Link
          to={`/register?lang=${lang}`}
          style={styles.secondaryLink}
        >
          {t.another}
        </Link>

        <Link
          to={`/?lang=${lang}`}
          style={styles.homeLink}
        >
          {t.home}
        </Link>

        <p style={styles.privacy}>
          🔒 {t.privacy}
        </p>
      </section>
    </main>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent:
      "center",
    alignItems:
      "center",
    padding: "40px 18px",
    boxSizing:
      "border-box",
    background:
      "linear-gradient(180deg,#6366f1 0%,#4f46e5 48%,#312e81 100%)",
  },

  card: {
    width: "100%",
    maxWidth: "620px",
    padding: "40px 30px",
    borderRadius: "24px",
    background: "#ffffff",
    color: "#111827",
    boxSizing:
      "border-box",
    boxShadow:
      "0 24px 60px rgba(0,0,0,0.25)",
  },

  successIcon: {
    width: "62px",
    height: "62px",
    display: "flex",
    alignItems:
      "center",
    justifyContent:
      "center",
    margin: "0 auto 18px",
    borderRadius: "50%",
    background: "#ecfdf5",
    color: "#047857",
    fontSize: "32px",
    fontWeight: "900",
  },

  eyebrow: {
    margin: "0 0 10px",
    color: "#4f46e5",
    textAlign: "center",
    textTransform:
      "uppercase",
    letterSpacing: "1px",
    fontSize: "13px",
    fontWeight: "900",
  },

  title: {
    margin: "0 0 16px",
    textAlign: "center",
    fontSize: "34px",
    lineHeight: "1.2",
  },

  description: {
    margin: "0 auto 26px",
    color: "#4b5563",
    textAlign: "center",
    fontSize: "16px",
    lineHeight: "1.7",
  },

  emailBox: {
    marginBottom: "18px",
    padding: "17px",
    border:
      "1px solid #c7d2fe",
    borderRadius: "14px",
    background: "#eef2ff",
    color: "#312e81",
    lineHeight: "1.6",
  },

  emailTip: {
    margin: "8px 0 0",
    color: "#4b5563",
    fontSize: "13px",
  },

  securityBox: {
    marginBottom: "24px",
    padding: "17px",
    borderRadius: "14px",
    background: "#f9fafb",
    color: "#374151",
  },

  securityText: {
    margin: "8px 0 0",
    fontSize: "14px",
    lineHeight: "1.65",
  },

  primaryLink: {
    display: "block",
    width: "100%",
    padding: "15px 18px",
    borderRadius: "12px",
    background: "#4f46e5",
    color: "#ffffff",
    textAlign: "center",
    textDecoration: "none",
    fontWeight: "900",
    boxSizing: "border-box",
  },

  secondaryLink: {
    display: "block",
    width: "100%",
    marginTop: "12px",
    padding: "14px 18px",
    border:
      "1px solid #c7d2fe",
    borderRadius: "12px",
    background: "#eef2ff",
    color: "#3730a3",
    textAlign: "center",
    textDecoration: "none",
    fontWeight: "800",
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
    lineHeight: "1.6",
  },
}