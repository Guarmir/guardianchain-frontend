import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import i18n from "../i18n"
import Footer from "../components/Footer"

export default function Faq() {
  const [params] = useSearchParams()

  const langParam = params.get("lang")
  const lang = langParam === "pt" ? "pt" : "en"

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
  }, [lang])

  const faqs =
    lang === "pt"
      ? [
          {
            q: "O que é GuardianChain?",
            a: "GuardianChain é uma plataforma de prova digital que permite registrar a existência de um arquivo através de um hash criptográfico com timestamp verificável.",
          },
          {
            q: "O que é blockchain?",
            a: "Blockchain é um registro digital distribuído que armazena informações de forma imutável.",
          },
          {
            q: "O que a plataforma registra?",
            a: "A plataforma registra apenas o hash criptográfico, timestamp e dados de verificação. O arquivo original nunca é enviado.",
          },
          {
            q: "O que é a Polygon?",
            a: "Polygon é uma rede blockchain compatível com Ethereum que oferece transações rápidas e de baixo custo.",
          },
          {
            q: "O que é um hash?",
            a: "Um hash é uma impressão digital criptográfica gerada a partir de um arquivo. Qualquer alteração no arquivo gera um hash diferente.",
          },
          {
            q: "O que pode ser registrado?",
            a: "Documentos, imagens, fotografias, músicas, vídeos, códigos fonte, contratos, PDFs, apresentações, pesquisas, designs e outros arquivos digitais.",
          },
        ]
      : [
          {
            q: "What is GuardianChain?",
            a: "GuardianChain is a digital proof platform that allows anyone to register the existence of a file using a cryptographic hash with a verifiable timestamp.",
          },
          {
            q: "What is blockchain?",
            a: "Blockchain is a distributed digital ledger that stores information in an immutable way.",
          },
          {
            q: "What does the platform register?",
            a: "The platform registers only the cryptographic hash, timestamp, and verification data. The original file is never uploaded.",
          },
          {
            q: "What is Polygon?",
            a: "Polygon is a blockchain network compatible with Ethereum that offers fast and low-cost transactions.",
          },
          {
            q: "What is a hash?",
            a: "A hash is a cryptographic fingerprint generated from a file. Any change in the file produces a different hash.",
          },
          {
            q: "What can be registered?",
            a: "Documents, images, photographs, music files, videos, source code, contracts, PDFs, presentations, research, designs, and other digital files.",
          },
        ]

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          {lang === "pt" ? "Dúvidas frequentes" : "Frequently Asked Questions"}
        </h1>

        {faqs.map((item, index) => (
          <div key={index} style={styles.item}>
            <h3 style={styles.question}>{item.q}</h3>
            <p style={styles.answer}>{item.a}</p>
          </div>
        ))}
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

  title: {
    textAlign: "center",
    marginBottom: "30px",
  },

  item: {
    marginBottom: "26px",
  },

  question: {
    marginBottom: "8px",
  },

  answer: {
    lineHeight: "1.7",
  },
}
