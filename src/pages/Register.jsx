import { useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

const CONTRACT_ADDRESS = "0xef89BC5D33D6E65C47131a0331CcAF7e780Dc985";
const RPC_URL = "https://polygon-rpc.com";

export default function Register() {
  const [hash, setHash] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function register() {
    try {
      setMsg("");
      setLoading(true);

      if (!hash || hash.length < 10) {
        setMsg("Informe um hash válido.");
        setLoading(false);
        return;
      }

      const provider = new ethers.JsonRpcProvider(RPC_URL);

      const privateKey = import.meta.env.VITE_GUARDIANCHAIN_PRIVATE_KEY;
      const wallet = new ethers.Wallet(privateKey, provider);

      const abi = [
        {
          inputs: [
            { internalType: "bytes32", name: "proofHash", type: "bytes32" }
          ],
          name: "registerProof",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        }
      ];

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        abi,
        wallet
      );

      const tx = await contract.registerProof("0x" + hash);
      await tx.wait();

      setMsg("Registro realizado com sucesso!");

      // 🔴 REDIRECT AUTOMÁTICO PARA VERIFY
      navigate("/verify?hash=" + hash);

    } catch (err) {
      console.error(err);
      setMsg("Erro ao registrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <h1>Registrar Prova</h1>

      <input
        style={styles.input}
        placeholder="Cole aqui o hash do arquivo"
        value={hash}
        onChange={(e) => setHash(e.target.value)}
      />

      <button style={styles.button} onClick={register} disabled={loading}>
        {loading ? "Registrando..." : "Registrar"}
      </button>

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
  msg: {
    marginTop: "15px",
    fontWeight: "bold",
  },
};
