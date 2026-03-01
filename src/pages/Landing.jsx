import { Link } from "react-router-dom";

function Landing() {
  return (
    <div style={{ padding: "3rem", maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
        GuardianChain
      </h1>

      <h2 style={{ fontWeight: "500", marginBottom: "1.5rem" }}>
        Prove que sua criação existia antes.
      </h2>

      <p style={{ marginBottom: "1.5rem", fontSize: "1.05rem" }}>
        GuardianChain é um protocolo digital de prova de existência que registra
        o hash do seu arquivo na blockchain Polygon, criando uma evidência
        pública, imutável e verificável de autoria e data.
      </p>

      <ul style={{ textAlign: "left", display: "inline-block", marginBottom: "2rem" }}>
        <li>🔒 Seu conteúdo nunca é exposto</li>
        <li>⛓️ Registro permanente em blockchain</li>
        <li>🌐 Verificação pública via link ou QR Code</li>
        <li>🕒 Prova criptográfica de anterioridade</li>
      </ul>

      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{ margin: 0, fontSize: "1rem" }}>
          <span style={{ textDecoration: "line-through", color: "#888" }}>
            US$10.00
          </span>{" "}
          <strong style={{ fontSize: "1.3rem", color: "#000" }}>
            US$7.00
          </strong>{" "}
          <span style={{ fontSize: "0.9rem", color: "#555" }}>
            (oferta de lançamento)
          </span>
        </p>
      </div>

      <Link to="/register">
        <button
          style={{
            marginTop: "1rem",
            padding: "0.8rem 2rem",
            fontSize: "1rem",
            cursor: "pointer"
          }}
        >
          Registrar prova agora
        </button>
      </Link>

      <div style={{ marginTop: "3rem", fontSize: "0.85rem" }}>
        <Link to="/terms">Terms</Link> |{" "}
        <Link to="/privacy">Privacy</Link> |{" "}
        <Link to="/refund-policy">Refund Policy</Link>
      </div>
    </div>
  );
}

export default Landing;