import { useState } from "react";
import { JsonRpcProvider, Contract } from "ethers";
import { jsPDF } from "jspdf";
import abi from "../contracts/GuardianChain";

const CONTRACT = "0xef89BC5D33D6E65C47131a0331CcAF7e780Dc985";
const RPC = "https://polygon-rpc.com";

export default function Verify() {
  const [hash, setHash] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  async function verify() {
    try {
      setError("");
      setData(null);

      if (!hash || hash.length < 10) {
        setError("Informe um hash válido.");
        return;
      }

      const provider = new JsonRpcProvider(RPC);
      const contract = new Contract(CONTRACT, abi, provider);

      const [author, timestamp] = await contract.getProof("0x" + hash);

      setData({
        author,
        date: new Date(Number(timestamp) * 1000).toUTCString(),
        hash,
      });
    } catch (err) {
      console.error(err);
      setError("Registro não encontrado ou inválido.");
    }
  }

  function gerarPDF() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("GuardianChain", 20, 20);

    doc.setFontSize(14);
    doc.text("Certificado de Registro Digital", 20, 30);

    doc.setFontSize(11);
    doc.text(`Hash do Documento (SHA-256):`, 20, 45);
    doc.text(data.hash, 20, 52);

    doc.text(`Autor (endereço):`, 20, 65);
    doc.text(data.author, 20, 72);

    doc.text(`Data e Hora do Registro (UTC):`, 20, 85);
    doc.text(data.date, 20, 92);

    doc.text(`Rede Blockchain: Polygon`, 20, 105);
    doc.text(`Endereço do Contrato:`, 20, 115);
    doc.text(CONTRACT, 20, 122);

    doc.line(20, 130, 190, 130);

    doc.setFontSize(10);
    doc.text(
      "Este certificado comprova a existência do hash criptográfico acima registrado em blockchain pública na data e hora indicadas.",
      20,
      140,
      { maxWidth: 170 }
    );

    doc.text(
      "O conteúdo original do arquivo não é armazenado, transmitido ou revelado. Apenas o hash criptográfico é registrado, preservando a confidencialidade do titular.",
      20,
      155,
      { maxWidth: 170 }
    );

    doc.text(
      "Este certificado não constitui, por si só, reconhecimento legal de autoria ou titularidade, devendo ser interpretado como evidência técnica complementar.",
      20,
      172,
      { maxWidth: 170 }
    );

    doc.setFontSize(9);
    doc.text(
      "Documento gerado automaticamente pelo GuardianChain.",
      20,
      190
    );

    const fileName = `guardianchain-certificado-${data.hash.slice(0, 8)}.pdf`;
    doc.save(fileName);
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Certificado de Registro Digital</h1>
      <p style={styles.subtitle}>
        Documento de comprovação de existência digital registrado em blockchain.
      </p>

      <input
        style={styles.input}
        placeholder="Cole aqui o hash do arquivo"
        value={hash}
        onChange={(e) => setHash(e.target.value)}
      />

      <button style={styles.button} onClick={verify}>
        Verificar Registro
      </button>

      {error && <p style={styles.error}>{error}</p>}

      {data && (
        <div style={styles.card}>
          <h3>Registro Confirmado</h3>
          <p><strong>Hash:</strong> {data.hash}</p>
          <p><strong>Autor:</strong> {data.author}</p>
          <p><strong>Data:</strong> {data.date}</p>

          <button style={styles.pdfButton} onClick={gerarPDF}>
            Baixar Certificado em PDF
          </button>

          <a
            href={`https://polygonscan.com/address/${CONTRACT}`}
            target="_blank"
            rel="noreferrer"
            style={styles.link}
          >
            Ver contrato no blockchain
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
  pdfButton: {
    marginTop: "16px",
    padding: "12px 20px",
    fontSize: "15px",
    backgroundColor: "#065f46",
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
    marginTop: "14px",
    color: "#1e40af",
    fontWeight: "bold",
  },
};
