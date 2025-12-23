import { useState } from "react";

export default function App() {
  const [account, setAccount] = useState(null);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask não detectado");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccount(accounts[0]);
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>GuardianChain</h1>
      <p>Prove que seu trabalho existia antes.</p>

      {account ? (
        <p>Carteira conectada: {account}</p>
      ) : (
        <button onClick={connectWallet}>Registrar prova agora</button>
      )}
    </div>
  );
}
