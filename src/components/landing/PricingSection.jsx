import { Link } from "react-router-dom"

export default function PricingSection({ lang, products = [] }) {
  const content = {
    pt: {
      eyebrow: "Escolha como começar",
      title: "Crie sua prova digital",
      subtitle:
        "Comece com um registro avulso. Em breve, você também poderá escolher pacotes com vários registros.",
      oneTime: "Pagamento único",
      package: "Pacote de registros",
      cta: "Criar minha prova digital",
      securePayment: "Pagamento seguro processado pelo Stripe",
      noSubscription: "Sem assinatura mensal",
    },

    en: {
      eyebrow: "Choose how to start",
      title: "Create your digital proof",
      subtitle:
        "Start with a single record. Soon, you will also be able to choose packages containing multiple records.",
      oneTime: "One-time payment",
      package: "Record package",
      cta: "Create my digital proof",
      securePayment: "Secure payment processed by Stripe",
      noSubscription: "No monthly subscription",
    },
  }

  const t = content[lang] || content.en

  if (!Array.isArray(products) || products.length === 0) {
    return null
  }

  return (
    <section style={styles.section}>
      <p style={styles.eyebrow}>{t.eyebrow}</p>

      <h2 style={styles.title}>{t.title}</h2>

      <p style={styles.subtitle}>{t.subtitle}</p>

      <div style={styles.grid}>
        {products.map((product) => (
          <article key={product.id} style={styles.card}>
            <p style={styles.paymentType}>
              {product.type === "single" ? t.oneTime : t.package}
            </p>

            <h3 style={styles.productName}>{product.name}</h3>

            <p style={styles.price}>{product.priceLabel}</p>

            <p style={styles.credits}>{product.creditsLabel}</p>

            <p style={styles.description}>{product.description}</p>

            <Link
              to={`/register?lang=${lang}&product=${product.id}`}
              style={styles.ctaLink}
            >
              {t.cta}
            </Link>
          </article>
        ))}
      </div>

      <div style={styles.trustRow}>
        <span>🔒 {t.securePayment}</span>
        <span>✓ {t.noSubscription}</span>
      </div>
    </section>
  )
}

const styles = {
  section: {
    maxWidth: "1040px",
    margin: "80px auto 0",
    padding: "42px 22px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "24px",
    boxShadow: "0 22px 55px rgba(0,0,0,0.2)",
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
    maxWidth: "720px",
    margin: "0 auto 32px",
    fontSize: "17px",
    lineHeight: "1.7",
    opacity: 0.94,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
    maxWidth: "920px",
    margin: "0 auto",
  },

  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "30px 24px",
    background: "#ffffff",
    color: "#1f2937",
    borderRadius: "20px",
    boxShadow: "0 18px 42px rgba(0,0,0,0.2)",
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
    fontSize: "24px",
    lineHeight: "1.3",
  },

  price: {
    margin: "0",
    color: "#312e81",
    fontSize: "44px",
    fontWeight: "900",
    letterSpacing: "-1.5px",
  },

  credits: {
    margin: "6px 0 18px",
    color: "#4b5563",
    fontSize: "15px",
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
    padding: "15px 22px",
    background: "#4f46e5",
    color: "#ffffff",
    borderRadius: "12px",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "900",
    boxSizing: "border-box",
    boxShadow: "0 12px 28px rgba(79,70,229,0.28)",
  },

  trustRow: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "18px",
    marginTop: "24px",
    fontSize: "14px",
    fontWeight: "800",
    opacity: 0.94,
  },
}