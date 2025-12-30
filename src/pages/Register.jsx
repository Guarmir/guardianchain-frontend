import { useState } from "react";
import { BrowserProvider, Contract, keccak256, toUtf8Bytes } from "ethers";
import guardianChainAbi from "../contracts/GuardianChain";

const CONTRACT_ADDRESS = "0xef89BC5D33D6E65C47131a0331CcAF7e780Dc985";

export default function Register() {
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState("");
  const [status, setStatus] = useState("");
  const [txHash, setTxHash] = useState("");

  async function handleFile(e) {
    const selected = e.target.files[0];
    if (!selected) return;

    const buffer = await selected.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hex = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    setHash(hex);
  }

  async function register() {
    try {
      if (!window.ethereum) {
        alert("MetaMask não encontrado");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new Contract(CONTRACT_ADDRESS, guardianChainAbi, signer);
      const tx = await contract.registerProof("0x" + hash);
      await tx.wait();

      setTxHash(tx.hash);
      setStatus("Registro concluído com sucesso!");
    } catch (err) {
      console.error(err);
      setStatus("Erro ao registrar.");
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "4rem auto" }}>
      <h1>Registrar Prova</h1>

      <input type="file" onChange={handleFile} />

      {hash && (
        <>
          <p><strong>Hash:</strong> {hash}</p>
          <button onClick={register}>Registrar na Blockchain</button>
        </>
      )}

      {txHash && (
        <p>
          <strong>Tx:</strong> {txHash}
        </p>
      )}

      {status && <p>{status}</p>}
    </div>
  );
}
