import { useState } from "react"
import { ethers } from "ethers"

export default function Register() {

  const [fileName, setFileName] = useState("")
  const [hash, setHash] = useState("")

  async function handleFile(event) {

    const file = event.target.files[0]

    if (!file) return

    setFileName(file.name)

    const buffer = await file.arrayBuffer()

    const hash = ethers.keccak256(new Uint8Array(buffer))

    setHash(hash)

  }

  return (

    <div style={styles.page}>

      <div style={styles.card}>

        <h1 style={styles.title}>
          Registrar prova digital
        </h1>

        <p style={styles.subtitle}>
          Selecione um arquivo para gerar uma prova criptográfica.
        </p>

        <input
          type="file"
          onChange={handleFile}
          style={styles.fileInput}
        />

        {fileName && (

          <p style={styles.fileName}>
            Arquivo selecionado: <b>{fileName}</b>
          </p>

        )}

        {hash && (

          <>
            <p style={styles.hashLabel}>
              Hash gerado automaticamente
            </p>

            <textarea
              value={hash}
              readOnly
              style={styles.hashBox}
            />

            <button style={styles.button}>
              Prosseguir para pagamento
            </button>
          </>

        )}

        <p style={styles.info}>
          O conteúdo do arquivo nunca é enviado ao servidor.
          Apenas o hash criptográfico é utilizado.
        </p>

      </div>

    </div>

  )
}

const styles = {

  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg,#4c5bd4,#3949ab)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px"
  },

  card: {
    background: "white",
    padding: "40px",
    borderRadius: "14px",
    width: "420px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)"
  },

  title: {
    fontSize: "28px",
    marginBottom: "10px"
  },

  subtitle: {
    fontSize: "14px",
    marginBottom: "20px",
    color: "#666"
  },

  fileInput: {
    marginBottom: "20px"
  },

  fileName: {
    fontSize: "14px",
    marginBottom: "10px"
  },

  hashLabel: {
    fontSize: "14px",
    marginBottom: "8px"
  },

  hashBox: {
    width: "100%",
    height: "80px",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontFamily: "monospace",
    marginBottom: "20px"
  },

  button: {
    background: "#3949ab",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
    marginBottom: "15px"
  },

  info: {
    fontSize: "12px",
    color: "#777"
  }

}