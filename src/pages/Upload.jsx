import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "https://guardianchain-backend.onrender.com"; // ajuste se necessário

export default function Upload() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function generateHash(file) {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }

  async function handleRegister() {
    try {
      if (!file) {
        setMsg("Selecione um arquivo.");
        return;
      }

      setLoading(true);
      setMsg("Gerando impressão digital do arquivo...");

      const fileHash = await generateHash(file);

      setMsg("Registrando prova na blockchain...");

      const res = await fetch(`${BACKEND_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proofHash: fileHash })
      });

      if (!res.ok) {
        throw new Error("Erro ao registrar no backend");
      }

      navigate("/verify?hash=" + fileHash);

    } catch (err) {
      console.error(err);
      setMsg("Erro ao registrar prova.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <h1>Registrar Prova Digital</h1>

      <p style={styles.text}>
        Seu arquivo <strong>não será enviado</strong>.  
        Apenas uma impressão digital criptográfica será criada localmente.
      </p>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      {file && (
        <p style={styles.file}>
          Arquivo selecionado: <strong>{file.name}</strong>
        </p>
      )}

      <button
        style={styles.button}
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? "Processando..." : "Registrar Prova"}
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
    textAlign: "center",
  },
  text: {
    marginBottom: "20px",
    color: "#444",
  },
  file: {
    marginTop: "10px",
    fontSize: "14px",
  },
  button: {
    marginTop: "20px",
    padding: "14px 24px",
    fontSize: "16px",
    backgroundColor: "#1e40af",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  msg: {
    marginTop: "15px",
    fontWeight: "bold",
  },
};
