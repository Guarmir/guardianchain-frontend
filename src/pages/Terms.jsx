import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import i18n from "../i18n"
import Footer from "../components/Footer"

export default function Terms() {
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
        <h1>{lang === "pt" ? "Termos de Uso" : "Terms of Use"}</h1>

        {lang === "pt" ? (
          <>
            <p>GuardianChain fornece um serviço de prova digital baseado em hash criptográfico e registro de timestamp.</p>
            <p>Ao utilizar a plataforma, o usuário concorda com as seguintes condições:</p>
            <ol style={styles.list}>
              <li>O serviço registra apenas o hash criptográfico dos arquivos.</li>
              <li>O arquivo original nunca é enviado ou armazenado.</li>
              <li>O certificado gerado comprova a existência e integridade do arquivo no momento do registro.</li>
              <li>O serviço não garante direitos autorais ou propriedade legal.</li>
              <li>O usuário é responsável pelo conteúdo registrado.</li>
              <li>A plataforma não deve ser utilizada para atividades ilegais.</li>
              <li>O serviço pode ser atualizado ou melhorado a qualquer momento.</li>
              <li>O uso da plataforma implica aceitação destes termos.</li>
            </ol>
          </>
        ) : (
          <>
            <p>GuardianChain provides a digital proof service based on cryptographic hashing and timestamp registration.</p>
            <p>By using the platform, the user agrees to the following conditions:</p>
            <ol style={styles.list}>
              <li>The service registers only the cryptographic hash of files.</li>
              <li>The original file is never uploaded or stored.</li>
              <li>The certificate provides proof of existence and integrity at the moment of registration.</li>
              <li>The service does not guarantee copyright ownership or legal authorship.</li>
              <li>The user is solely responsible for the content registered.</li>
              <li>The platform must not be used for illegal activities.</li>
              <li>The service may be updated or improved at any time.</li>
              <li>Use of the platform implies acceptance of these terms.</li>
            </ol>
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
