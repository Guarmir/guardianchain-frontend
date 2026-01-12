import { useState } from "react";

const BACKEND_URL = "https://guardianchain-backend.onrender.com";

async function generateHash(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function Upload() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  async function payWithStripe() {
    if (!file) {
      setMsg("Selecione um arquivo primeiro.");
      return;
    }

    setMsg("Gerando hash do arquivo...");
    const proofHash = await generateHash(file);

    setMsg("Iniciando pagamento...");

    const res = await fetch(`${BACKEND_URL}/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proofHash })
    });

    const data = await res.json();
    window.location.href = data.url;
  }

  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h1>Register Digital Proof</h1>

      <input type="file" onChange={e => setFile(e.target.files[0])} />

      <button onClick={payWithStripe} style={{ marginTop: 20 }}>
        Pay & Register on Blockchain – $3
      </button>

      {msg && <p>{msg}</p>}
    </div>
  );
}
