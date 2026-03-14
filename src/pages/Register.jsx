import { useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

export default function Register() {
  const [params] = useSearchParams()
  const inputRef = useRef(null)

  const langParam = params.get("lang")
  const language = langParam === "pt" ? "pt" : "en"

  const [hash, setHash] = useState("")
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState("")

  async function generateHash(file) {
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))

    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")

    setHash(hashHex)
  }

  async function handleFile(e) {
    const file = e.target.files?.[0]

    if (!file) return

    setFileName(file.name)
    setHash("")

    try {
      await generateHash(file)
    } catch (error) {
      console.error("Hash generation error:", error)
      alert(
        language === "pt"
          ? "Erro ao gerar o hash do arquivo."
          : "Error generating the file hash."
      )
    }
  }

  async function handleRegister() {
    if (!hash) {
      alert(language === "pt" ? "Hash não gerado." : "Hash not generated.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hash,
          fileName,
          language,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || "Failed to create checkout session")
      }

      if (data?.url) {
        window.location.href = data.url
        return
      }

      if (data?.id) {
        const stripe = await stripePromise

        if (!stripe) {
          throw new Error("Stripe failed to initialize")
        }

        const result = await stripe.redirectToCheckout({
          sessionId: data.id,
        })

        if (result?.error) {
          throw new Error(result.error.message)
        }

        return
      }

      throw new Error("Invalid checkout response")
    } catch (err) {
      console.error("Checkout error:", err)

      alert(
        language === "pt"
          ? "Erro ao iniciar o pagamento."
          : "Error starting payment."
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
          {language === "pt"
            ? "Selecione um arquivo para gerar prova criptográfica."
            : "Select a file to generate a cryptographic proof."}
        </p>

        <input
          ref={inputRef}
          type="file"
          style={{ display: "none" }}
          onChange={handleFile}
        />

        <button
          onClick={() => inputRef.current?.click()}
          style={styles.secondary}
          type="button"
        >
          {language === "pt" ? "Selecionar arquivo" : "Select file"}
        </button>

        <p style={{ marginTop: "10px", wordBreak: "break-word" }}>
          {fileName
            ? fileName
            : language === "pt"
              ? "Nenhum arquivo selecionado"
              : "No file selected"}
        </p>

        {hash && (
          <textarea
            readOnly
            value={hash}
            style={styles.hashBox}
          />
        )}

        <button
          onClick={handleRegister}
          disabled={!hash || loading}
          style={{
            ...styles.primary,
            opacity: !hash || loading ? 0.7 : 1,
            cursor: !hash || loading ? "not-allowed" : "pointer",
          }}
          type="button"
        >
          {loading
            ? language === "pt"
              ? "Processando..."
              : "Processing..."
            : language === "pt"
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
    background: "linear-gradient(180deg,#4c5bd4,#3949ab)",
    padding: "20px",
  },

  card: {
    background: "white",
    padding: "40px",
    borderRadius: "14px",
    width: "420px",
    maxWidth: "100%",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
  },

  hashBox: {
    width: "100%",
    marginTop: "15px",
    height: "100px",
    resize: "none",
    padding: "10px",
    boxSizing: "border-box",
  },

  primary: {
    background: "#3949ab",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "8px",
    width: "100%",
    marginTop: "20px",
  },

  secondary: {
    background: "#eee",
    border: "none",
    padding: "10px 14px",
    borderRadius: "6px",
    marginTop: "10px",
    cursor: "pointer",
  },
}