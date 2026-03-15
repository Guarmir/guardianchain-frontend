import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import i18n from "../i18n"
import Footer from "../components/Footer"

export default function About() {
  const [params] = useSearchParams()

  const langParam = params.get("lang")
  const lang = langParam === "pt" ? "pt" : "en"

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
  }, [lang])

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>{lang === "pt" ? "Sobre o GuardianChain" : "About GuardianChain"}</h1>

        {lang === "pt" ? (
          <>
            <p style={styles.text}>
              GuardianChain é uma infraestrutura digital de registro que permite
              comprovar a existência e integridade de arquivos digitais através
              de hash criptográfico com timestamp verificável.
            </p>

            <p style={styles.text}>
              Ao registrar a impressão criptográfica do arquivo, o sistema cria
              uma prova técnica verificável sem expor o conteúdo original.
            </p>

            <p style={styles.text}>
              O serviço foi projetado para criadores, desenvolvedores, empresas,
              pesquisadores, designers, profissionais jurídicos e qualquer pessoa
              que precise comprovar anterioridade e integridade digital.
            </p>
          </>
        ) : (
          <>
            <p style={styles.text}>
              GuardianChain is a digital registration infrastructure that allows
              users to prove the existence and integrity of digital files through
              cryptographic hashing with a verifiable timestamp.
            </p>

            <p style={styles.text}>
              By registering the cryptographic fingerprint of a file, the system
              creates a verifiable technical proof without exposing the original
              content.
            </p>

            <p style={styles.text}>
              The service is designed for creators, developers, companies,
              researchers, designers, legal professionals, and anyone who needs
              to prove digital prior existence and integrity.
            </p>
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg,#4c5bd4,#3949ab)",
    color: "white",
    padding: "60px 20px 80px",
  },

  card: {
    maxWidth: "900px",
    margin: "0 auto",
    background: "white",
    color: "#222",
    padding: "40px",
    borderRadius: "14px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
  },

  text: {
    marginTop: "1rem",
    lineHeight: "1.8",
  },
}
