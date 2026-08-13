import {
  Link,
} from "react-router-dom"

export default function PricingSection({
  lang,
  products = [],
}) {
  const content = {
    pt: {
      eyebrow:
        "Escolha como começar",

      title:
        "Escolha sua opção de registro",

      subtitle:
        "Faça um registro avulso ou escolha um pacote para reduzir o valor por prova digital.",

      protectionEyebrow:
        "Proteção de acesso",

      protectionTitle:
        "Seu certificado é entregue com acesso protegido",

      protectionDescription:
        "Após o pagamento, você recebe por e-mail um link seguro para criar sua Chave de Acesso. O certificado não é enviado como PDF aberto.",

      protectionFlow: [
        "Pagamento",
        "Evidence Key™",
        "Chave de Acesso",
        "Código de Recuperação",
        "Acesso ao certificado",
      ],

      protectionPrivacy:
        "Sua Chave de Acesso é privada. A GuardianChain não consegue consultá-la ou revelá-la. Se você esquecer a chave, poderá criar uma nova usando o e-mail cadastrado e seu Código de Recuperação.",

      oneTime:
        "Registro avulso",

      package:
        "Pacote de registros",

      ctaSingle:
        "Criar minha prova digital",

      ctaPackage:
        "Escolher este pacote",

      securePayment:
        "Pagamento seguro processado pelo Stripe",

      noSubscription:
        "Sem assinatura mensal",

      credits:
        "Os créditos podem ser utilizados conforme sua necessidade.",
    },

    en: {
      eyebrow:
        "Choose how to start",

      title:
        "Choose your registration option",

      subtitle:
        "Create a single record or choose a package to reduce the cost per digital proof.",

      protectionEyebrow:
        "Protected access",

      protectionTitle:
        "Your certificate is delivered with protected access",

      protectionDescription:
        "After payment, you receive a secure email link to create your Access Key. The certificate is not sent as an open PDF.",

      protectionFlow: [
        "Payment",
        "Evidence Key™",
        "Access Key",
        "Recovery Code",
        "Certificate access",
      ],

      protectionPrivacy:
        "Your Access Key is private. GuardianChain cannot retrieve or reveal it. If you forget your key, you can create a new one using your registered email and Recovery Code.",

      oneTime:
        "Single record",

      package:
        "Record package",

      ctaSingle:
        "Create my digital proof",

      ctaPackage:
        "Choose this package",

      securePayment:
        "Secure payment processed by Stripe",

      noSubscription:
        "No monthly subscription",

      credits:
        "Credits can be used whenever you need them.",
    },
  }

  const t =
    content[lang] ||
    content.en

  if (
    !Array.isArray(products) ||
    products.length === 0
  ) {
    return null
  }

  return (
    <section style={styles.section}>
      <p style={styles.eyebrow}>
        {t.eyebrow}
      </p>

      <h2 style={styles.title}>
        {t.title}
      </h2>

      <p style={styles.subtitle}>
        {t.subtitle}
      </p>

      <div style={styles.protectionBox}>
        <div style={styles.protectionHeader}>
          <div style={styles.protectionIcon}>
            🔐
          </div>

          <div style={styles.protectionHeaderText}>
            <p style={styles.protectionEyebrow}>
              {t.protectionEyebrow}
            </p>

            <h3 style={styles.protectionTitle}>
              {t.protectionTitle}
            </h3>

            <p style={styles.protectionDescription}>
              {t.protectionDescription}
            </p>
          </div>
        </div>

        <div style={styles.flow}>
          {t.protectionFlow.map(
            (step, index) => (
              <div
                key={step}
                style={styles.flowGroup}
              >
                <span style={styles.flowStep}>
                  {step}
                </span>

                {index <
                  t.protectionFlow.length -
                    1 && (
                  <span style={styles.flowArrow}>
                    →
                  </span>
                )}
              </div>
            ),
          )}
        </div>

        <div style={styles.privacyNote}>
          <span style={styles.privacyIcon}>
            ✓
          </span>

          <p style={styles.privacyText}>
            {t.protectionPrivacy}
          </p>
        </div>
      </div>

      <div style={styles.grid}>
        {products.map(
          (product) => (
            <article
              key={product.id}
              style={{
                ...styles.card,

                ...(product.highlighted
                  ? styles
                      .highlightedCard
                  : {}),
              }}
            >
              <p
                style={
                  styles.paymentType
                }
              >
                {product.type ===
                "single"
                  ? t.oneTime
                  : t.package}
              </p>

              <h3
                style={
                  styles.productName
                }
              >
                {product.name}
              </h3>

              <p style={styles.price}>
                {product.priceLabel}
              </p>

              <p style={styles.credits}>
                {
                  product.creditsLabel
                }
              </p>

              <p
                style={
                  styles.unitPrice
                }
              >
                {
                  product.unitPriceLabel
                }
              </p>

              <p
                style={
                  styles.description
                }
              >
                {product.description}
              </p>

              <Link
                to={`/register?lang=${lang}&product=${product.id}`}
                style={styles.ctaLink}
              >
                {product.type ===
                "single"
                  ? t.ctaSingle
                  : t.ctaPackage}
              </Link>
            </article>
          ),
        )}
      </div>

      <p style={styles.creditNote}>
        {t.credits}
      </p>

      <div style={styles.trustRow}>
        <span>
          🔒 {t.securePayment}
        </span>

        <span>
          ✓ {t.noSubscription}
        </span>
      </div>
    </section>
  )
}

const styles = {
  section: {
    maxWidth: "1180px",
    margin: "80px auto 0",
    padding: "42px 22px",
    background:
      "rgba(255,255,255,0.08)",
    border:
      "1px solid rgba(255,255,255,0.16)",
    borderRadius: "24px",
    boxShadow:
      "0 22px 55px rgba(0,0,0,0.2)",
  },

  eyebrow: {
    margin: "0 0 10px",
    fontSize: "14px",
    fontWeight: "900",
    letterSpacing: "1.1px",
    textTransform: "uppercase",
    opacity: 0.86,
  },

  title: {
    margin: "0 0 14px",
    fontSize: "36px",
    lineHeight: "1.2",
  },

  subtitle: {
    maxWidth: "760px",
    margin: "0 auto 30px",
    fontSize: "17px",
    lineHeight: "1.7",
    opacity: 0.94,
  },

  protectionBox: {
    maxWidth: "1040px",
    margin: "0 auto 34px",
    padding: "24px",
    background:
      "rgba(255,255,255,0.96)",
    color: "#1f2937",
    border:
      "1px solid rgba(199,210,254,0.95)",
    borderRadius: "20px",
    boxShadow:
      "0 16px 36px rgba(0,0,0,0.16)",
    boxSizing: "border-box",
  },

  protectionHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    textAlign: "left",
  },

  protectionIcon: {
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    background: "#eef2ff",
    borderRadius: "14px",
    fontSize: "24px",
  },

  protectionHeaderText: {
    flex: 1,
    minWidth: 0,
  },

  protectionEyebrow: {
    margin: "0 0 5px",
    color: "#4f46e5",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: "0.9px",
    textTransform: "uppercase",
  },

  protectionTitle: {
    margin: "0 0 8px",
    color: "#111827",
    fontSize: "21px",
    lineHeight: "1.35",
  },

  protectionDescription: {
    margin: 0,
    color: "#4b5563",
    fontSize: "15px",
    lineHeight: "1.65",
  },

  flow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "8px",
    margin: "22px 0",
    padding: "16px",
    background: "#f5f7ff",
    borderRadius: "14px",
  },

  flowGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  flowStep: {
    padding: "8px 11px",
    background: "#ffffff",
    color: "#312e81",
    border:
      "1px solid #c7d2fe",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "900",
    whiteSpace: "nowrap",
  },

  flowArrow: {
    color: "#6366f1",
    fontSize: "17px",
    fontWeight: "900",
  },

  privacyNote: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    padding: "14px 16px",
    background: "#ecfdf5",
    border:
      "1px solid #bbf7d0",
    borderRadius: "14px",
    textAlign: "left",
  },

  privacyIcon: {
    width: "22px",
    height: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    background: "#16a34a",
    color: "#ffffff",
    borderRadius: "50%",
    fontSize: "13px",
    fontWeight: "900",
  },

  privacyText: {
    margin: 0,
    color: "#166534",
    fontSize: "13px",
    lineHeight: "1.65",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    maxWidth: "1100px",
    margin: "0 auto",
    alignItems: "stretch",
  },

  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "30px 22px",
    background: "#ffffff",
    color: "#1f2937",
    border:
      "2px solid transparent",
    borderRadius: "20px",
    boxShadow:
      "0 18px 42px rgba(0,0,0,0.2)",
    boxSizing: "border-box",
  },

  highlightedCard: {
    border:
      "2px solid #c7d2fe",
    boxShadow:
      "0 22px 52px rgba(0,0,0,0.28)",
  },

  paymentType: {
    margin: "0 0 12px",
    color: "#6366f1",
    fontSize: "13px",
    fontWeight: "900",
    letterSpacing: "0.8px",
    textTransform: "uppercase",
  },

  productName: {
    margin: "0 0 14px",
    fontSize: "22px",
    lineHeight: "1.3",
  },

  price: {
    margin: 0,
    color: "#312e81",
    fontSize: "42px",
    fontWeight: "900",
    letterSpacing: "-1.5px",
  },

  credits: {
    margin: "6px 0 4px",
    color: "#374151",
    fontSize: "15px",
    fontWeight: "800",
  },

  unitPrice: {
    margin: "0 0 18px",
    color: "#6366f1",
    fontSize: "14px",
    fontWeight: "800",
  },

  description: {
    maxWidth: "430px",
    margin: "0 0 24px",
    color: "#4b5563",
    fontSize: "15px",
    lineHeight: "1.65",
  },

  ctaLink: {
    display: "inline-block",
    width: "100%",
    marginTop: "auto",
    padding: "15px 18px",
    background: "#4f46e5",
    color: "#ffffff",
    borderRadius: "12px",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "900",
    boxSizing: "border-box",
    boxShadow:
      "0 12px 28px rgba(79,70,229,0.28)",
  },

  creditNote: {
    maxWidth: "720px",
    margin: "26px auto 0",
    fontSize: "14px",
    lineHeight: "1.6",
    opacity: 0.92,
  },

  trustRow: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "18px",
    marginTop: "18px",
    fontSize: "14px",
    fontWeight: "800",
    opacity: 0.94,
  },
}