import { useState } from "react"

export default function Register() {

  const [hash, setHash] = useState("")
  const [fileName, setFileName] = useState("")

  async function generateHash(file) {

    const buffer = await file.arrayBuffer()

    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)

    const hashArray = Array.from(new Uint8Array(hashBuffer))

    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("")

    const fullHash = "0x" + hashHex

    setHash(fullHash)
    setFileName(file.name)

  }

  async function handleCheckout() {

    if (!hash) {

      alert("Selecione um arquivo primeiro")
      return

    }

    const response = await fetch("/api/create-checkout-session", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        hash
      })

    })

    const data = await response.json()

    const stripe = window.Stripe("pk_test_51SkLPvK4J089mMwmMDF2qmdzyzj6aPGVagvGoQnO0gaQ4vkkrTY68rcjhFlu56YznsF61oJ35TWXCVnXfouaSthv00pJPoWVKB")

    await stripe.redirectToCheckout({
      sessionId: data.id
    })

  }

  return (

    <div style={{
      maxWidth: "600px",
      margin: "auto",
      padding: "40px",
      textAlign: "center"
    }}>

      <h1>Registrar prova digital</h1>

      <p>Selecione um arquivo para gerar um hash criptográfico.</p>

      <input
        type="file"
        onChange={(e) => generateHash(e.target.files[0])}
      />

      {fileName && (

        <div style={{ marginTop: "20px" }}>

          <p>
            Arquivo selecionado: <b>{fileName}</b>
          </p>

          <p>Hash gerado automaticamente:</p>

          <textarea
            value={hash}
            readOnly
            style={{
              width: "100%",
              height: "100px"
            }}
          />

        </div>

      )}

      <button
        onClick={handleCheckout}
        style={{
          marginTop: "20px",
          padding: "12px 30px",
          background: "#4f46e5",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >

        Prosseguir para pagamento

      </button>

    </div>

  )

}