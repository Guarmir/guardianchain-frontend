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
  const [loading, setLoading] = useState(false);

  async function payWithStripe() {
    if (!file) {
      setMsg("Please select a file first.");
      return;
    }

    try {
      setLoading(true);
      setMsg("Generating file hash...");

      const proofHash = await generateHash(file);

      setMsg("Redirecting to secure payment...");

      const res = await fetch(`${BACKEND_URL}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proofHash })
      });

      const data = await res.json();
      window.location.href = data.url;

    } catch (err) {
      console.error(err);
      setMsg("Error starting payment. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <h1>Register Digital Proof</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ marginBottom: 10 }}
      />

      <p style={styles.status}>
        {file ? (
          <>Selected file: <b>{file.name}</b></>
        ) : (
          "No file selected"
        )}
      </p>

      <button
        onClick={payWithStripe}
        style={styles.button}
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay & Register on Blockchain – $3"}
      </button>

      {msg && <p style={styles.msg}>{msg}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 520,
    margin: "80px auto",
    textAlign: "center",
    fontFamily: "Arial, sans-serif"
  },
  status: {
    margin: "12px 0",
    color: "#444"
  },
  button: {
    marginTop: 16,
    padding: "14px 22px",
    fontSize: 16,
    borderRadius: 6,
    border: "none",
    background: "#1e40af",
    color: "#fff",
    cursor: "pointer"
  },
  msg: {
    marginTop: 16,
    fontWeight: "bold"
  }
};
