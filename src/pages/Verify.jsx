import { useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import guardianChainAbi from "../contracts/GuardianChain";

const CONTRACT_ADDRESS = "0xef89BC5D33D6E65C47131a0331CcAF7e780Dc985";

export default function Verify() {
  const [hash, setHash] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function verify() {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(CONTRACT_ADDRESS, guardianChainAbi, provider);

      const filter = contract.filters.ProofRegistered(null, hash);
      const events = await contract.queryFilter(filter);

      if (events.length === 0) {
        setResult(null);
        setError("Nenhum registro encontrado para este hash.");
        return;
      }

      const event = events[0];

      setResult({
        author: event.args.author,
        timestamp: new Date(Number(event.args.timestamp) * 1000).toLocaleString(),
      });

      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erro ao consultar a blockchain.");
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "4rem auto" }}>
      <h1>Verificar Registro</h1>

      <input
        type="text"
        placeholder="Cole o hash aqui"
        value={hash}
        onChange={(e) => setHash(e.target.value)}
        style={{ width: "100%", padding: "8px" }}
      />

      <button onClick={verify} style={{ marginTop: 12 }}>
        Verificar
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <p><strong>Autor:</strong> {result.author}</p>
          <p><strong>Data:</strong> {result.timestamp}</p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
