import { useEffect, useState } from "react";
import { JsonRpcProvider, Contract } from "ethers";
import { useSearchParams } from "react-router-dom";
import abi from "../contracts/GuardianChain";

const CONTRACT = "0xef89BC5D33D6E65C47131a0331CcAF7e780Dc985";
const RPC = "https://polygon-rpc.com";

export default function Verify() {
  const [searchParams] = useSearchParams();
  const hashFromUrl = searchParams.get("hash");

  const [hash, setHash] = useState(hashFromUrl || "");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function verify(h) {
    try {
      setError("");
      setLoading(true);

      const provider = new JsonRpcProvider(RPC);
      const contract = new Contract(CONTRACT, abi, provider);

      const [author, timestamp] = await contract.getProof("0x" + h);

      setData({
        author,
        date: new Date(Number(timestamp) * 1000).toLocaleString(),
        hash: h,
      });
    } catch (err) {
      console.error(err);
      setError("Registro não encontrado ou inválido.");
    } finally {
      setLoading(false);
    }
  }

  // 🔥 VERIFICA AUTOMATICAMENTE SE VEIO DO UPLOAD
  useEffect(() => {
    if (hashFromUrl) {
      verify(hashFromUrl);
    }
  }, [hashFromUrl]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Certificado de Registro Digital</h1>
      <p style={styles.subtitle}>
        Documento de comprovação de existência digital registrado em blockchain.
      </p>

      {/* INPUT SÓ APARECE SE NÃO VEIO HASH NA URL */}
      {!hashFromUrl && (
        <>
          <input
            style={styles.input}
            placeholder="Cole aqui o hash do arquivo"
            value={hash}
            onChange={(e) => setHash(e.target.value)}
          />

          <button style={styles.button} onClick={() => verify(hash)}>
            Verificar Registro
          </button>
        </>
      )}

      {loading && <p>Verificando registro...</p>}

      {error && <p style={styles.error}>{error}</p>}

      {data && (
        <div style={styles.card}>
          <h3>Registro Confirmado</h3>
          <p><strong>Hash:</strong> {data.hash}</p>
          <p><strong>Autor:</strong> {data.author}</p>
          <p><strong>Data:</strong> {data.date}</p>

          <a
            href={`https://polygonscan.com/address/${CONTRACT}`}
            target="_blank"
            rel="noreferrer"
            style={styles.link}
          >
            Ver contrato no blockchain
          </a>

          {/* Aqui entra o botão de PDF depois */}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "720px",
    margin: "50px auto",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  title: {
    fontSize: "28px",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "16px",
    marginBottom: "30px",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    marginTop: "15px",
    padding: "14px 24px",
    fontSize: "16px",
    backgroundColor: "#1e40af",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  error: {
    color: "#d32f2f",
    marginTop: "12px",
  },
  card: {
    marginTop: "30px",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "#fafafa",
  },
  link: {
    display: "inline-block",
    marginTop: "12px",
    color: "#1e40af",
    fontWeight: "bold",
  },
};
