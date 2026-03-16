import { useState } from "react"
import { ethers } from "ethers"
import { useSearchParams } from "react-router-dom"

export default function Register() {
  const [params] = useSearchParams()
  const langParam = params.get("lang")
  const lang = langParam === "pt" ? "pt" : "en"

  const [fileHash, setFileHash] = useState("")
  const [fileName, setFileName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setFileName(file.name)

    const buffer = await file.arrayBuffer()
    const hash = ethers.keccak256(new Uint8Array(buffer))

    setFileHash(hash.replace("0x", ""))
  }

  const handleCheckout = async () => {
    if (!fileHash || loading) return

    try {
      setLoading(true)

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hash: fileHash,
          language: lang,
          fileName,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.url) {
        throw new Error(data?.error || "Failed to create checkout session")
      }

      window.location.href = data.url
    } catch (error) {
      console.error("Checkout error:", error)
      alert(
        lang === "pt"
          ? "Não foi possível iniciar o pagamento."
          : "Could not start payment."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>GuardianChain</h1>

        <p>
          {lang === "pt"
            ? "Selecione um arquivo para gerar prova criptográfica."
            : "Select a file to generate cryptographic proof."}
        </p>

        <input type="file" onChange={handleFileChange} />

        {fileName && <p>{fileName}</p>}

        {fileHash && (
          <textarea style={styles.hash} value={fileHash} readOnly />
        )}

        <p style={styles.legal}>
          {lang === "pt"
            ? "Ao continuar você concorda com nossos "
            : "By continuing you agree to our "}
          <a href={`/terms?lang=${lang}`}>{lang === "pt" ? "Termos" : "Terms"}</a>{" "}
          &{" "}
          <a href={`/refund?lang=${lang}`}>
            {lang === "pt" ? "Política de Reembolso" : "Refund Policy"}
          </a>
        </p>

        <button
          onClick={handleCheckout}
          disabled={!fileHash || loading}
          style={styles.button}
        >
          {loading
            ? lang === "pt"
              ? "Processando..."
              : "Processing..."
            : lang === "pt"
            ? "Pagar & Registrar"
            : "Pay & Register"}
        </button>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(180deg,#5a60d1,#3b3fa3)",
  },

  card: {
    background: "#f3f3f3",
    padding: "40px",
    borderRadius: "14px",
    textAlign: "center",
    width: "420px",
  },

  hash: {
    width: "100%",
    height: "80px",
    marginTop: "10px",
  },

  legal: {
    fontSize: "13px",
    marginTop: "15px",
    opacity: 0.8,
  },

  button: {
    marginTop: "20px",
    width: "100%",
    padding: "14px",
    background: "#4b4fbf",
    border: "none",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
  },
}