import { useEffect, useState } from "react";
import { JsonRpcProvider, ethers } from "ethers";
import { useSearchParams } from "react-router-dom";
import jsPDF from "jspdf";

const CONTRACT_ADDRESS = "0xef89BC5D33D6E65C47131a0331CcAF7e780Dc985";
const RPC_URL = "https://polygon-mainnet.infura.io/v3/5fc1b4a9dc394977b762ae15f1e7726d";
const BLOCK_LOOKBACK = 200000;

export default function Verify() {
  const [searchParams] = useSearchParams();
  const hashFromUrl = searchParams.get("hash");

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function verifyProof(hash) {
    try {
      setLoading(true);
      setError("");
      setData(null);

      const provider = new JsonRpcProvider(RPC_URL);

      const eventTopic = ethers.id(
        "ProofRegistered(address,bytes32,uint256)"
      );

      const latestBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(latestBlock - BLOCK_LOOKBACK, 0);

      const logs = await provider.getLogs({
        address: CONTRACT_ADDRESS,
        topics: [eventTopic, null, "0x" + hash],
        fromBlock,
        toBlock: latestBlock,
      });

      if (!logs || logs.length === 0) {
        throw new Error("Registro não encontrado");
      }

      const log = logs[0];

      const author = ethers.getAddress(
        "0x" + log.topics[1].slice(26)
      );

      const timestamp = Number(ethers.toBigInt(log.data));

      setData({
        author,
        hash,
        date: new Date(timestamp * 1000).toLocaleString(),
        txHash: log.transactionHash,
      });

    } catch (err) {
      console.error(err);
      setError("Registro não encontrado ou inválido.");
    } finally {
      setLoading(false);
    }
  }

  function generatePDF() {
    if (!data) return;

    const pdf = new jsPDF();

    pdf.setFont("Times", "Roman");

    pdf.setFontSize(18);
    pdf.text("CERTIFICADO DE REGISTRO DIGITAL", 105, 20, { align: "center" });

    pdf.setFontSize(12);
    pdf.text(
      "Este documento certifica que o hash abaixo foi registrado em blockchain pública,",
      20,
      40
    );
    pdf.text(
      "servindo como prova de existência, autoria e anterioridade temporal.",
      20,
      48
    );

    pdf.setFontSize(11);
    pdf.text("Hash do arquivo:", 20, 70);
    pdf.text(data.hash, 20, 78, { maxWidth: 170 });

    pdf.text(`Autor: ${data.author}`, 20, 98);
    pdf.text(`Data do registro: ${data.date}`, 20, 110);

    pdf.text("Transação:", 20, 130);
    pdf.text(data.txHash, 20, 138, { maxWidth: 170 });

    pdf.setFontSize(10);
    pdf.text(
      "Este certificado foi gerado automaticamente pelo GuardianChain.",
      20,
      180
    );
    pdf.text(
      "A veracidade pode ser confirmada publicamente na blockchain Polygon.",
      20,
      186
    );

    pdf.save("guardianchain-certificado.pdf");
  }

  useEffect(() => {
    if (hashFromUrl) {
      verifyProof(hashFromUrl);
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

          <p><strong>Hash:</strong></p>
          <p style={styles.mono}>{data.hash}</p>

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

          <button style={styles.pdfButton} onClick={generatePDF}>
            📄 Baixar Certificado em PDF
          </button>
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
    display: "block",
    marginTop: "12px",
    color: "#1e40af",
    fontWeight: "bold",
  },
  pdfButton: {
    marginTop: "20px",
    padding: "12px 20px",
    fontSize: "15px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  mono: {
    fontFamily: "monospace",
    fontSize: "13px",
    wordBreak: "break-all",
  },
};
