import { Link } from "react-router-dom";

function Landing() {
  return (
    <div
      style={{
        padding: "3rem",
        maxWidth: "720px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
        GuardianChain
      </h1>

      <h2 style={{ fontWeight: "500", marginBottom: "1.5rem" }}>
        Prove que sua criação existia antes.
      </h2>

      <p style={{ marginBottom: "1.5rem", lineHeight: "1.6" }}>
        GuardianChain é um cartório digital on-chain que registra o hash do seu
        arquivo na blockchain Polygon, criando uma evidência pública,
        imutável e verificável de autoria e data.
      </p>

      <ul style={{ textAlign: "left", display: "inline-block", marginBottom: "1.5rem" }}>
        <li>🔒 Seu conteúdo nunca é exposto</li>
        <li>⛓️ Registro permanente em blockchain</li>
        <li>🌐 Verificação pública via link ou QR Code</li>
        <li>🕒 Prova criptográfica de precedência</li>
      </ul>

      {/* Preço */}
      <p style={{ marginTop: "1rem", fontSize: "1.1rem" }}>
        <span
          style={{
            textDecoration: "line-through",
            marginRight: "8px",
            color: "#777",
          }}
        >
          US$10.00
        </span>
        <strong style={{ fontSize: "1.4rem" }}>US$7.00</strong>
        <span
          style={{
            marginLeft: "6px",
            fontSize: "0.9rem",
            color: "#555",
          }}
        >
          (valor atual por registro)
        </span>
      </p>

      <Link to="/register">
        <button
          style={{
            marginTop: "1.5rem",
            padding: "0.8rem 1.8rem",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Registrar prova agora
        </button>
      </Link>

      <div style={{ marginTop: "3rem", fontSize: "0.85rem" }}>
        <Link to="/terms">Termos</Link> |{" "}
        <Link to="/privacy">Privacidade</Link> |{" "}
        <Link to="/refund-policy">Política de Reembolso</Link>
      </div>
    </div>
  );
}

export default Landing;