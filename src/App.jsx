import { useState } from "react";
import { BrowserProvider, Contract, keccak256, toUtf8Bytes } from "ethers";
import { guardianChainAbi } from "./contract/guardianChainAbi";

const CONTRACT_ADDRESS = "0xef89BC5D33D6E65C47131a0331CcAF7e780Dc985";

export default function App() {
  const [wallet, setWallet] = useState(null);
  const [hash, setHash] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [signature, setSignature] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);

  async function connectWallet() {
    try {
      if (!window.ethereum) throw new Error("MetaMask não encontrada");

      await window.ethereum.request({ method: "eth_requestAccounts" });
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x89" }],
      });

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setWallet(await signer.getAddress());
      setError(null);
    } catch (e) {
      setError("Erro ao conectar carteira");
    }
  }

  async function generateHash(file) {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const fileHash = await generateHash(file);
    setHash(fileHash);
    setSignature(null);
    setTxHash(null);
  }

  async function signHash() {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const message = `GuardianChain Proof:\n${hash}`;
      const sig = await signer.signMessage(message);

      setSignature(sig);
      setError(null);
    } catch {
      setError("Assinatura cancelada");
    }
  }

  async function registerOnChain() {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new Contract(
        CONTRACT_ADDRESS,
        guardianChainAbi,
        signer
      );

      const proof = keccak256(
        toUtf8Bytes(wallet + hash + signature)
      );

      const tx = await contract.registerProof(proof);
      await tx.wait();

      setTxHash(tx.hash);
      setError(null);
    } catch (e) {
      console.error(e);
      setError("Falha ao registrar na blockchain");
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "4rem auto", fontFamily: "Arial" }}>
      <h1>GuardianChain</h1>

      {!wallet ? (
        <button onClick={connectWallet}>Conectar MetaMask</button>
      ) : (
        <>
          <p><strong>Carteira:</strong> {wallet}</p>

          <input type="file" onChange={handleFileChange} />

          {hash && (
            <>
              <p><strong>Hash SHA-256</strong></p>
              <textarea readOnly value={hash} rows={3} />
              <button onClick={signHash}>Assinar Hash</button>
            </>
          )}

          {signature && (
            <>
              <p><strong>Assinatura</strong></p>
              <textarea readOnly value={signature} rows={3} />
              <button onClick={registerOnChain}>
                Registrar na Blockchain
              </button>
            </>
          )}

          {txHash && (
            <p>
              ✅ Registrado! <br />
              Tx: {txHash}
            </p>
          )}
        </>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
