import { Link, useSearchParams } from "react-router-dom"
import Footer from "../components/Footer.jsx"

import Hero from "../components/landing/Hero.jsx"
import ProblemSection from "../components/landing/ProblemSection.jsx"
import ProfessionalSection from "../components/landing/ProfessionalSection.jsx"
import HowItWorks from "../components/landing/HowItWorks.jsx"
import AboutSection from "../components/landing/AboutSection.jsx"
import FounderSection from "../components/landing/FounderSection.jsx"
import IntegritySection from "../components/landing/IntegritySection.jsx"
import SecuritySection from "../components/landing/SecuritySection.jsx"
import CertificateSection from "../components/landing/CertificateSection.jsx"
import UseCasesSection from "../components/landing/UseCasesSection.jsx"
import TrustStrip from "../components/landing/TrustStrip.jsx"
import PricingSection from "../components/landing/PricingSection.jsx"

import { landingContent } from "../data/landingContent.js"
import { getLandingProducts } from "../data/productCatalog.js"

export default function LandingPage() {
  const [params] = useSearchParams()

  const langParam = params.get("lang")
  const lang = langParam === "pt" ? "pt" : "en"

  const t = landingContent[lang]
  const products = getLandingProducts(lang)

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

      <TrustStrip lang={lang} />

      <ProblemSection t={t} lang={lang} />

      <HowItWorks t={t} lang={lang} />

      <CertificateSection t={t} lang={lang} />

      <UseCasesSection t={t} lang={lang} />

      <SecuritySection t={t} lang={lang} />

      <FounderSection t={t} lang={lang} />

      <AboutSection t={t} lang={lang} />

      <ProfessionalSection t={t} lang={lang} />

      <PricingSection lang={lang} products={products} />

      <IntegritySection t={t} lang={lang} />

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
}