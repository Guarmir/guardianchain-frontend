import { Link, useSearchParams } from "react-router-dom"

export default function Footer() {
  const [params] = useSearchParams()

  const langParam = params.get("lang")
  const lang = langParam === "pt" ? "pt" : "en"

  return (
    <footer style={styles.footer}>
      <div style={styles.links}>
        <Link to={`/about?lang=${lang}`} style={styles.link}>
          {lang === "pt" ? "Sobre" : "About"}
        </Link>

        <Link to={`/faq?lang=${lang}`} style={styles.link}>
          {lang === "pt" ? "Dúvidas frequentes" : "FAQ"}
        </Link>

        <Link to={`/terms?lang=${lang}`} style={styles.link}>
          {lang === "pt" ? "Termos de uso" : "Terms of Use"}
        </Link>

        <Link to={`/privacy?lang=${lang}`} style={styles.link}>
          {lang === "pt" ? "Política de privacidade" : "Privacy Policy"}
        </Link>

        <Link to={`/support?lang=${lang}`} style={styles.link}>
          {lang === "pt" ? "Suporte" : "Support"}
        </Link>
      </div>

      <p style={styles.copy}>© 2026 GuardianChain</p>
    </footer>
  )
}

const styles = {
  footer: {
    width: "100%",
    marginTop: "60px",
    paddingTop: "30px",
    paddingBottom: "10px",
    borderTop: "1px solid rgba(255,255,255,0.25)",
    textAlign: "center",
  },

  links: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "18px",
    marginBottom: "14px",
  },

  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "14px",
    opacity: 0.95,
  },

  copy: {
    fontSize: "13px",
    opacity: 0.8,
    color: "white",
  },
}