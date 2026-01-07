import { useEffect, useState } from "react";
import { JsonRpcProvider, ethers } from "ethers";
import { useSearchParams } from "react-router-dom";

const CONTRACT = "0xef89BC5D33D6E65C47131a0331CcAF7e780Dc985";
const RPC = "https://polygon-rpc.com";

export default function Verify() {
  const [searchParams] = useSearchParams();
  const hashFromUrl = searchParams.get("hash");

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function verify(hash) {
    try {
      setError("");
      setLoading(true);

      const provider = new JsonRpcProvider(RPC);

      const eventSignature = ethers.id(
        "ProofRegistered(address,bytes32,uint256)"
      );

      const logs = await provider.getLogs({
        address: CONTRACT,
        topics: [
          eventSignature,
          null,
          "0x" + hash
        ],
        fromBlock: 0,
        toBlock: "latest",
      });

      if (logs.length === 0) {
        throw new Error("not found");
      }

      const log = logs[0];

      const decoded = ethers.AbiCoder.defaultAbiCoder().decode(
        ["address", "bytes32", "uint256"],
        log.data
      );

      setData({
        author: decoded[0],
        hash,
        date: new Date(Number(decoded[2]) * 1000).toLocaleString(),
        txHash: log.transactionHash,
      });
    } catch (err) {
      console.error(err);
      setError("Registro não encontrado ou inválido.");
    } finally {
      setLoading(false);
    }
  }

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

      {loading && <p>Verificando registro...</p>}

      {error && <p style={styles.error}>{error}</p>}

      {data && (
        <div style={styles.card}>
          <h3>Registro Confirmado</h3>
          <p><strong>Hash:</strong> {data.hash}</p>
          <p><strong>Autor:</strong> {data.author}</p>
          <p><strong>Data:</strong> {data.date}</p>

          <a
            href={`https://polygonscan.com/tx/${data.txHash}`}
            target="_blank"
            rel="noreferrer"
            style={styles.link}
          >
            Ver transação no Polygonscan
          </a>
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
