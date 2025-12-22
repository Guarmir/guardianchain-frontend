import { useState } from "react";
import "./App.css";

function App() {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);

  async function connectWallet() {
    try {
      if (!window.ethereum) {
        setError("MetaMask não detectado");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar carteira");
    }
  }

  return (
    <div className="app">
      <h1>GuardianChain</h1>
      <p>Prove que seu trabalho existia antes.</p>

      {account ? (
        <p>Carteira conectada: {account}</p>
      ) : (
        <button onClick={connectWallet}>Registrar prova agora</button>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
