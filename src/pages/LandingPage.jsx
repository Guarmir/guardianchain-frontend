import { Link, useSearchParams } from "react-router-dom"
import Footer from "../components/Footer.jsx"
import Hero from "../components/landing/Hero.jsx"
import certificatePreview from "../assets/certificate-preview.png"
import { landingContent } from "../data/landingContent.js"

export default function LandingPage() {
  const [params] = useSearchParams()

  const langParam = params.get("lang")
  const lang = langParam === "pt" ? "pt" : "en"

  const linkedinUrl = "https://www.linkedin.com/in/guardianchain/"
  const t = landingContent[lang]

  return (
    <div style={styles.page}>
      <div style={styles.langSwitch}>
        <Link
          to="/?lang=pt"
          style={{
            ...styles.langLink,
            opacity: lang === "pt" ? 1 : 0.7,
            fontWeight: lang === "pt" ? "700" : "400",
          }}
        >
          {t.switchToPt}
        </Link>

        <span style={styles.langDivider}>|</span>

        <Link
          to="/?lang=en"
          style={{
            ...styles.langLink,
            opacity: lang === "en" ? 1 : 0.7,
            fontWeight: lang === "en" ? "700" : "400",
          }}
        >
          {t.switchToEn}
        </Link>
      </div>

      <Hero t={t} lang={lang} />

      <section style={styles.riskSection}>
        <h2 style={styles.riskTitle}>{t.riskTitle}</h2>
        <p style={styles.riskText}>{t.riskText}</p>

        <div style={styles.riskGrid}>
          {t.riskItems.map((item) => (
            <div key={item} style={styles.riskCard}>
              <span style={styles.riskIcon}>!</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <Link to={`/register?lang=${lang}`}>
          <button style={styles.riskCta}>{t.register}</button>
        </Link>
      </section>

      <section style={styles.socialSection}>
        <h2 style={styles.socialTitle}>{t.socialTitle}</h2>
        <p style={styles.socialText}>{t.socialText}</p>

        <div style={styles.socialGrid}>
          {t.socialItems.map((item) => (
            <div key={item} style={styles.socialCard}>
              <span style={styles.socialCheck}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.howSection}>
        <h2 style={styles.howTitle}>{t.howTitle}</h2>
        <p style={styles.howText}>{t.howText}</p>

        <div style={styles.howGrid}>
          {t.howSteps.map((step, index) => (
            <div key={step.title} style={styles.howCard}>
              <div style={styles.howNumber}>{index + 1}</div>
              <div style={styles.howIcon}>{step.icon}</div>
              <h3 style={styles.howCardTitle}>{step.title}</h3>
              <p style={styles.howCardText}>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.aboutSection}>
        <h2 style={styles.aboutTitle}>{t.aboutTitle}</h2>
        <p style={styles.aboutText}>{t.aboutText}</p>
        <p style={styles.aboutText}>{t.aboutText2}</p>
        <p style={styles.aboutText}>{t.aboutText3}</p>
        <p style={styles.aboutText}>{t.aboutText4}</p>

        <div style={styles.trustGrid}>
          {t.trustItems.map((item) => (
            <div key={item} style={styles.trustCard}>
              <span style={styles.trustCheck}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.founderSection}>
        <h2 style={styles.founderTitle}>{t.founderTitle}</h2>
        <p style={styles.founderText}>{t.founderText}</p>
        <p style={styles.founderText}>{t.founderText2}</p>

        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.linkedinButton}
        >
          {t.founderButton}
        </a>
      </section>

      <section style={styles.independentSection}>
        <h2 style={styles.independentTitle}>{t.independentTitle}</h2>
        <p style={styles.independentText}>{t.independentText}</p>

        <div style={styles.independentGrid}>
          {t.independentItems.map((item) => (
            <div key={item} style={styles.independentCard}>
              <span style={styles.independentCheck}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.integritySection}>
        <h2 style={styles.integrityTitle}>{t.integrityTitle}</h2>
        <p style={styles.integrityText}>{t.integrityText}</p>
        <p style={styles.integrityText}>{t.integrityText2}</p>
        <p style={styles.integrityText}>{t.integrityText3}</p>

        <div style={styles.integrityGrid}>
          {t.integrityItems.map((item) => (
            <div key={item} style={styles.integrityCard}>
              <span style={styles.integrityCheck}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.securitySection}>
        <h2 style={styles.securityTitle}>{t.securityTitle}</h2>
        <p style={styles.securityText}>{t.securityText}</p>

        <div style={styles.securityGrid}>
          {t.securityItems.map((item) => (
            <div key={item} style={styles.securityCard}>
              <span style={styles.securityCheck}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <div style={styles.certificateSection}>
        <h2 style={styles.certificateTitle}>{t.certificateTitle}</h2>
        <p style={styles.certificateText}>{t.certificateText}</p>

        <img
          src={certificatePreview}
          alt="GuardianChain Certificate Preview"
          style={styles.certificateImage}
        />
      </div>

      <section style={styles.useCasesSection}>
        <h2 style={styles.useCasesTitle}>{t.useCasesTitle}</h2>
        <p style={styles.useCasesText}>{t.useCasesText}</p>

        <div style={styles.useCasesGrid}>
          {t.useCases.map((item) => (
            <div key={item} style={styles.useCaseCard}>
              <span style={styles.useCaseCheck}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <Link to={`/register?lang=${lang}`}>
          <button style={styles.finalCta}>{t.register}</button>
        </Link>
      </section>

      <Footer />
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    textAlign: "center",
    padding: "60px 20px 80px",
    background:
      "linear-gradient(180deg,#6366f1 0%, #4f46e5 45%, #312e81 100%)",
    color: "white",
  },

  langSwitch: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginBottom: "40px",
  },

  langLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
  },

  langDivider: {
    opacity: 0.8,
  },

  riskSection: {
    maxWidth: "980px",
    margin: "80px auto 0",
    padding: "40px 24px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "22px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
  },

  riskTitle: {
    fontSize: "32px",
    marginBottom: "14px",
  },

  riskText: {
    maxWidth: "760px",
    margin: "0 auto 30px",
    opacity: 0.94,
    lineHeight: "1.7",
    fontSize: "16px",
  },

  riskGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "14px",
    marginBottom: "28px",
  },

  riskCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textAlign: "left",
    padding: "15px 16px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "14px",
    color: "#ffffff",
    fontSize: "15px",
  },

  riskIcon: {
    width: "22px",
    height: "22px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#dc2626",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    flexShrink: 0,
  },

  riskCta: {
    padding: "15px 24px",
    background: "#ffffff",
    color: "#4338ca",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "900",
    fontSize: "15px",
  },

  socialSection: {
    maxWidth: "980px",
    margin: "80px auto 0",
    padding: "34px 22px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "22px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
  },

  socialTitle: {
    fontSize: "32px",
    marginBottom: "12px",
  },

  socialText: {
    maxWidth: "760px",
    margin: "0 auto 28px",
    opacity: 0.94,
    lineHeight: "1.7",
  },

  socialGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
  },

  socialCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textAlign: "left",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "14px",
    color: "#ffffff",
    fontSize: "15px",
  },

  socialCheck: {
    width: "22px",
    height: "22px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#4b4fbf",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    flexShrink: 0,
  },

  howSection: {
    maxWidth: "1100px",
    margin: "80px auto 0",
    padding: "20px",
  },

  howTitle: {
    fontSize: "32px",
    marginBottom: "12px",
  },

  howText: {
    maxWidth: "720px",
    margin: "0 auto 40px",
    opacity: 0.92,
    lineHeight: "1.6",
  },

  howGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
  },

  howCard: {
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "20px",
    padding: "28px 22px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
  },

  howNumber: {
    width: "36px",
    height: "36px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#4b4fbf",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    margin: "0 auto 16px",
  },

  howIcon: {
    fontSize: "32px",
    marginBottom: "14px",
  },

  howCardTitle: {
    fontSize: "20px",
    marginBottom: "10px",
  },

  howCardText: {
    opacity: 0.92,
    lineHeight: "1.6",
    fontSize: "15px",
  },

  aboutSection: {
    maxWidth: "980px",
    margin: "80px auto 0",
    padding: "40px 24px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "22px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
  },

  aboutTitle: {
    fontSize: "32px",
    marginBottom: "24px",
  },

  aboutText: {
    maxWidth: "820px",
    margin: "0 auto 18px",
    lineHeight: "1.7",
    opacity: 0.94,
    fontSize: "16px",
  },

  trustGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginTop: "36px",
  },

  trustCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "14px",
    textAlign: "left",
  },

  trustCheck: {
    width: "22px",
    height: "22px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#4338ca",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    flexShrink: 0,
  },

  founderSection: {
    maxWidth: "980px",
    margin: "80px auto 0",
    padding: "40px 24px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "22px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
  },

  founderTitle: {
    fontSize: "32px",
    marginBottom: "18px",
  },

  founderText: {
    maxWidth: "780px",
    margin: "0 auto 18px",
    lineHeight: "1.7",
    opacity: 0.94,
    fontSize: "16px",
  },

  linkedinButton: {
    display: "inline-block",
    marginTop: "18px",
    padding: "14px 22px",
    background: "#ffffff",
    color: "#4338ca",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "800",
  },

  independentSection: {
    maxWidth: "980px",
    margin: "80px auto 0",
    padding: "40px 24px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "22px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
  },

  independentTitle: {
    fontSize: "32px",
    marginBottom: "18px",
  },

  independentText: {
    maxWidth: "760px",
    margin: "0 auto 30px",
    lineHeight: "1.7",
    opacity: 0.94,
  },

  independentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },

  independentCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "14px",
    textAlign: "left",
  },

  independentCheck: {
    width: "22px",
    height: "22px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#4338ca",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    flexShrink: 0,
  },

  integritySection: {
    maxWidth: "980px",
    margin: "80px auto 0",
    padding: "40px 24px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "22px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
  },

  integrityTitle: {
    fontSize: "32px",
    marginBottom: "18px",
  },

  integrityText: {
    maxWidth: "820px",
    margin: "0 auto 18px",
    lineHeight: "1.7",
    opacity: 0.94,
    fontSize: "16px",
  },

  integrityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginTop: "34px",
  },

  integrityCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "14px",
    textAlign: "left",
  },

  integrityCheck: {
    width: "22px",
    height: "22px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#4338ca",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    flexShrink: 0,
  },

  securitySection: {
    maxWidth: "980px",
    margin: "80px auto 0",
    padding: "40px 24px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "22px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
  },

  securityTitle: {
    fontSize: "32px",
    marginBottom: "18px",
  },

  securityText: {
    maxWidth: "820px",
    margin: "0 auto 30px",
    lineHeight: "1.7",
    opacity: 0.95,
    fontSize: "16px",
  },

  securityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },

  securityCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "14px",
    textAlign: "left",
  },

  securityCheck: {
    width: "22px",
    height: "22px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#4338ca",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    flexShrink: 0,
  },

  certificateSection: {
    marginTop: "80px",
    textAlign: "center",
  },

  certificateTitle: {
    fontSize: "32px",
    marginBottom: "14px",
  },

  certificateText: {
    maxWidth: "760px",
    margin: "0 auto 30px",
    opacity: 0.92,
    lineHeight: "1.6",
  },

  certificateImage: {
    width: "100%",
    maxWidth: "620px",
    maxHeight: "520px",
    objectFit: "cover",
    objectPosition: "top",
    borderRadius: "18px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "#ffffff",
  },

  useCasesSection: {
    maxWidth: "980px",
    margin: "80px auto 0",
    padding: "34px 22px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "22px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
  },

  useCasesTitle: {
    fontSize: "32px",
    margin: "0 0 12px",
  },

  useCasesText: {
    maxWidth: "720px",
    margin: "0 auto 28px",
    opacity: 0.92,
    lineHeight: "1.6",
  },

  useCasesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    marginBottom: "28px",
  },

  useCaseCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textAlign: "left",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "14px",
    color: "#ffffff",
    fontSize: "15px",
  },

  useCaseCheck: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "22px",
    height: "22px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#4b4fbf",
    fontWeight: "800",
    flexShrink: 0,
  },

  finalCta: {
    padding: "15px 24px",
    background: "#ffffff",
    color: "#4338ca",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "15px",
  },
}