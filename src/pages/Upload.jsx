import { useState } from "react"

const BACKEND_URL = "https://guardianchain-backend.onrender.com"

async function generateHash(file) {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)

  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export default function Upload() {
  const [file, setFile] = useState(null)
  const [msg, setMsg] = useState("")
  const [loading, setLoading] = useState(false)

  async function payWithStripe() {
    if (!file) {
      setMsg("Selecione um arquivo primeiro.")
      return
    }

    try {
      setLoading(true)
      setMsg("Gerando prova do arquivo...")

      const proofHash = await generateHash(file)

      setMsg("Redirecionando para pagamento seguro...")

      const res = await fetch(`${BACKEND_URL}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proofHash,
          fileName: file.name,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Erro ao criar sessão de pagamento.")
      }

      window.location.href = data.url
    } catch (err) {
      console.error(err)
      setMsg("Erro ao iniciar pagamento. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Register Digital Proof</h1>

      <p style={styles.subtitle}>
        Create a permanent digital proof certificate without uploading your original file.
      </p>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        style={styles.fileInput}
      />

      <p style={styles.status}>
        {file ? (
          <>
            Selected file: <b>{file.name}</b>
          </>
        ) : (
          "No file selected"
        )}
      </p>

      <div style={styles.priceBox}>
        <p style={styles.priceTitle}>Permanent digital proof certificate</p>
        <h2 style={styles.price}>US$ 8</h2>
        <p style={styles.priceNote}>one-time payment</p>
      </div>

      <button
        onClick={payWithStripe}
        style={{
          ...styles.stripeButton,
          opacity: loading ? 0.7 : 1,
          cursor: loading ? "not-allowed" : "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay securely with Card / Pix"}
      </button>

      <p style={styles.trustText}>
        Your original file never leaves your device.
      </p>

      {msg && <p style={styles.msg}>{msg}</p>}
    </div>
  )
}

const styles = {
  container: {
    maxWidth: 520,
    margin: "80px auto",
    padding: "30px 20px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },

  title: {
    fontSize: 32,
    marginBottom: 12,
    color: "#111827",
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 1.6,
    color: "#4b5563",
    marginBottom: 24,
  },

  fileInput: {
    marginBottom: 10,
  },

  status: {
    margin: "12px 0",
    color: "#444",
  },

  priceBox: {
    margin: "22px 0",
    padding: "20px",
    borderRadius: 12,
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
  },

  priceTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
  },

  price: {
    margin: "8px 0",
    fontSize: 38,
    color: "#111827",
  },

  priceNote: {
    margin: 0,
    color: "#6b7280",
  },

  stripeButton: {
    width: "100%",
    padding: "14px 22px",
    fontSize: 16,
    borderRadius: 8,
    border: "none",
    background: "#4b4fbf",
    color: "#fff",
    fontWeight: "700",
  },

  trustText: {
    marginTop: 14,
    fontSize: 14,
    color: "#4b5563",
  },

  msg: {
    marginTop: 16,
    fontWeight: "bold",
    color: "#111827",
  },
}