import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/router"

export default function Register() {

  const { t, i18n } = useTranslation()
  const router = useRouter()

  const [file, setFile] = useState(null)
  const [hash, setHash] = useState(null)
  const [loading, setLoading] = useState(false)

  async function generateHash(file) {

    const buffer = await file.arrayBuffer()

    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)

    const hashArray = Array.from(new Uint8Array(hashBuffer))

    const hashHex = hashArray
      .map(b => b.toString(16).padStart(2, "0"))
      .join("")

    setHash(hashHex)

    return hashHex
  }

  async function handleFile(e) {

    const selected = e.target.files[0]

    if (!selected) return

    setFile(selected)

    await generateHash(selected)

  }

  async function handleRegister() {

    if (!hash) return alert("File hash not generated")

    setLoading(true)

    const language = i18n.language || "en"

    try {

      const res = await fetch("/api/create-checkout-session", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          hash: hash,
          language: language
        })

      })

      const data = await res.json()

      const stripe = await import("@stripe/stripe-js")
      const stripeClient = await stripe.loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
      )

      await stripeClient.redirectToCheckout({
        sessionId: data.id
      })

    } catch (err) {

      console.error(err)
      alert("Payment initialization failed")

    }

    setLoading(false)

  }

  return (

    <div style={{ maxWidth: 600, margin: "50px auto", textAlign: "center" }}>

      <h1>{t("register_title") || "Register File"}</h1>

      <p>
        {t("register_description") ||
          "Select a file to generate a blockchain proof of existence."}
      </p>

      <input type="file" onChange={handleFile} />

      {hash && (

        <div style={{ marginTop: 20 }}>

          <p>
            <strong>SHA256:</strong>
          </p>

          <p style={{ wordBreak: "break-all" }}>{hash}</p>

        </div>

      )}

      <button
        onClick={handleRegister}
        disabled={!hash || loading}
        style={{
          marginTop: 30,
          padding: "12px 24px",
          fontSize: 16,
          cursor: "pointer"
        }}
      >

        {loading
          ? t("processing") || "Processing..."
          : t("pay_and_register") || "Pay & Register"}

      </button>

    </div>

  )

}