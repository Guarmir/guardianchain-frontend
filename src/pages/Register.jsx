import { useState } from "react"
import { ethers } from "ethers"
import { useTranslation } from "react-i18next"
import i18n from "../i18n"

export default function Register() {

  const { t } = useTranslation()

  const [fileName, setFileName] = useState("")
  const [hash, setHash] = useState("")

  async function handleFile(event) {

    const file = event.target.files[0]

    if (!file) return

    setFileName(file.name)

    const buffer = await file.arrayBuffer()

    const generatedHash = ethers.keccak256(new Uint8Array(buffer))

    setHash(generatedHash)

  }

  async function handleCheckout() {

    if (!hash) return

    const language = i18n.language

    const response = await fetch("/api/create-checkout-session", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        hash,
        language
      })

    })

    const data = await response.json()

    window.location.href = data.url

  }

  return (

    <div style={styles.page}>

      <div style={styles.card}>

        <h1 style={styles.title}>
          {t("register.title")}
        </h1>

        <p style={styles.subtitle}>
          {t("register.subtitle")}
        </p>

        <input
          type="file"
          onChange={handleFile}
          style={styles.fileInput}
        />

        {fileName && (

          <p style={styles.fileName}>
            {t("register.fileSelected")}: <b>{fileName}</b>
          </p>

        )}

        {hash && (

          <>
            <p style={styles.hashLabel}>
              {t("register.hash")}
            </p>

            <textarea
              value={hash}
              readOnly
              style={styles.hashBox}
            />

            <button
              style={styles.button}
              onClick={handleCheckout}
            >
              {t("register.button")}
            </button>

          </>

        )}

        <p style={styles.info}>
          {t("register.info")}
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