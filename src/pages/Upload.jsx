import { useState } from "react";

const BACKEND_URL = "https://guardianchain-backend.onrender.com";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  async function registrarComStripe() {
    if (!file) {
      setMsg("Selecione um arquivo antes de continuar.");
      return;
    }

    try {
      setMsg("Redirecting to payment...");

      const res = await fetch(
        `${BACKEND_URL}/create-checkout-session`,
        { method: "POST" }
      );

      const data = await res.json();

      if (!data.url) {
        throw new Error("Checkout URL not received");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setMsg("Payment error.");
    }
  }

  return (
    <div style={styles.container}>
      <h1>Register Digital Proof</h1>

      <p style={styles.text}>
        Your file is securely processed to generate a cryptographic fingerprint.
        The content is not stored.
      </p>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      {file && (
        <p style={styles.file}>
          Selected file: <strong>{file.name}</strong>
        </p>
      )}

      <button style={styles.button} onClick={registrarComStripe}>
        Register for $3.00
      </button>

      {msg && <p style={styles.msg}>{msg}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "80px auto",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center"
  },
  text: {
    marginBottom: "20px",
    color: "#444"
  },
  file: {
    marginTop: "10px",
    fontSize: "14px"
  },
  button: {
    marginTop: "20px",
    padding: "14px 24px",
    fontSize: "16px",
    backgroundColor: "#1e40af",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  msg: {
    marginTop: "15px",
    fontWeight: "bold"
  }
};
