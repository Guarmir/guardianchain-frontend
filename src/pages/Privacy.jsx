import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import i18n from "../i18n"
import Footer from "../components/Footer"

export default function Privacy() {
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
        <h1>{lang === "pt" ? "Política de Privacidade" : "Privacy Policy"}</h1>

        {lang === "pt" ? (
          <>
            <p>GuardianChain foi projetado para minimizar a coleta de dados.</p>
            <p>A plataforma opera com os seguintes princípios:</p>
            <ul style={styles.list}>
              <li>O arquivo original nunca é enviado.</li>
              <li>Apenas o hash criptográfico é processado.</li>
              <li>Nenhum arquivo é armazenado na plataforma.</li>
            </ul>

            <p>Informações coletadas podem incluir:</p>
            <ul style={styles.list}>
              <li>endereço de email para envio do certificado</li>
              <li>logs técnicos necessários para a operação do sistema</li>
            </ul>

            <p>A plataforma não vende nem compartilha dados pessoais com terceiros.</p>
          </>
        ) : (
          <>
            <p>GuardianChain is designed to minimize data collection.</p>
            <p>The platform operates under the following principles:</p>
            <ul style={styles.list}>
              <li>The original file is never uploaded.</li>
              <li>Only the cryptographic hash is processed.</li>
              <li>No file is stored on the platform.</li>
            </ul>

            <p>Information collected may include:</p>
            <ul style={styles.list}>
              <li>email address for certificate delivery</li>
              <li>technical logs required for system operation</li>
            </ul>

            <p>The platform does not sell or share personal data with third parties.</p>
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
    lineHeight: "1.8",
  },

  list: {
    paddingLeft: "20px",
  },
}
