import { useState } from "react";

const BACKEND_URL = "https://guardianchain-backend.onrender.com";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  // 💳 PIX / CARTÃO (STRIPE)
  async function registrarComStripe() {
    if (!file) {
      setMsg("Selecione um arquivo antes de continuar.");
      return;
    }

    try {
      setMsg("Redirecionando para pagamento...");

      const res = await fetch(
        `${BACKEND_URL}/create-checkout-session`,
        { method: "POST" }
      );

      const data = await res.json();

      if (!data.url) {
        throw new Error("URL de pagamento não recebida");
      }

      window.location.href = data.url;

    } catch (err) {
      console.error(err);
      setMsg("Erro ao iniciar pagamento.");
    }
  }

  // 🔐 CRIPTO (FUTURO – MetaMask)
  function registrarComCripto() {
    if (!file) {
      setMsg("Selecione um arquivo antes de continuar.");
      return;
    }

    setMsg("Pagamento com Cripto será ativado em breve.");
  }

  return (
    <div style={styles.container}>
      <h1>Registrar Prova Digital</h1>

      <p style={styles.text}>
        Seu arquivo é processado de forma segura para gerar uma impressão
        digital criptográfica. O conteúdo não é armazenado.
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

      <div style={{ marginTop: "20px" }}>
        <button
          style={styles.button}
          onClick={registrarComStripe}
        >
          Registrar com Pix / Cartão
        </button>

        <button
          style={{
            ...styles.button,
            backgroundColor: "#065f46",
            marginLeft: "10px",
          }}
          onClick={registrarComCripto}
        >
          Registrar pagando com Cripto
        </button>
      </div>

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
    marginTop: "10px",
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
