import { useState } from "react";

const BACKEND_URL = "https://guardianchain-backend.onrender.com";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  async function payWithStripe() {
    if (!file) {
      setMsg("Select a file first.");
      return;
    }

    const res = await fetch(`${BACKEND_URL}/create-checkout-session`, {
      method: "POST"
    });

    const data = await res.json();
    window.location.href = data.url;
  }

  function payWithCrypto() {
    setMsg("Crypto payment will be enabled next (MetaMask).");
  }

  return (
    <div style={styles.container}>
      <h1>Register Digital Proof</h1>

      <p style={styles.text}>
        Your file is securely processed to generate a cryptographic fingerprint.
        The content is not stored.
      </p>

      <input type="file" onChange={e => setFile(e.target.files[0])} />

      {file ? (
        <p>Selected file: <b>{file.name}</b></p>
      ) : (
        <p>No file selected</p>
      )}

      <button onClick={payWithStripe} style={styles.button}>
        Pay with Card / Pix – $3
      </button>

      <button
        onClick={payWithCrypto}
        style={{ ...styles.button, background: "#065f46" }}
      >
        Pay with Crypto – $3
      </button>

      {msg && <p style={{ marginTop: 20 }}>{msg}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: "80px auto",
    textAlign: "center",
    fontFamily: "Arial, sans-serif"
  },
  text: {
    marginBottom: 20
  },
  button: {
    marginTop: 20,
    padding: "14px 24px",
    fontSize: 16,
    color: "#fff",
    background: "#1e40af",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  }
};
