import { Link } from "react-router-dom";

function Landing() {
  return (
    <div
      style={{
        backgroundColor: "#F2F3F5",
        minHeight: "100vh",
        padding: "3rem 1rem",
        textAlign: "center"
      }}
    >
      <img
        src="/logo.png"
        alt="GuardianChain Logo"
        style={{ height: "70px", marginBottom: "1.5rem" }}
      />

      <div
        style={{
          display: "inline-block",
          padding: "6px 16px",
          backgroundColor: "#E6F0FF",
          color: "#0D47A1",
          borderRadius: "20px",
          fontSize: "0.8rem",
          fontWeight: "600",
          marginBottom: "1.5rem"
        }}
      >
        Registro imutável validado em blockchain
      </div>

      <h1 style={{ fontSize: "2.5rem", color: "#404854" }}>
        Cartório Digital On-Chain
      </h1>

      <h2 style={{ marginTop: "1rem", fontWeight: "400", color: "#404854" }}>
        Prova pública e permanente de autoria e anterioridade.
      </h2>

      <p style={{ maxWidth: "700px", margin: "1.5rem auto", color: "#404854" }}>
        GuardianChain registra o hash criptográfico do seu arquivo na
        blockchain Polygon, criando uma evidência pública, imutável
        e verificável sem expor o conteúdo original.
      </p>

      <ul style={{
        listStyle: "none",
        padding: 0,
        maxWidth: "500px",
        margin: "2rem auto",
        color: "#404854"
      }}>
        <li>🔒 Conteúdo permanece privado</li>
        <li>⛓️ Registro permanente em blockchain</li>
        <li>🌐 Verificação pública via link ou QR Code</li>
        <li>🕒 Prova criptográfica de precedência</li>
      </ul>

      {/* PREÇO */}
      <div
        style={{
          marginTop: "2rem",
          padding: "2rem",
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          display: "inline-block",
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
        }}
      >
        <div style={{ fontSize: "0.9rem", color: "#CBD1D6" }}>
          Registro individual
        </div>

        <div style={{ marginTop: "0.5rem" }}>
          <span
            style={{
              textDecoration: "line-through",
              marginRight: "10px",
              fontSize: "1.2rem",
              color: "#999"
            }}
          >
            US$12.00
          </span>

          <span
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#0D47A1"
            }}
          >
            US$9.00
          </span>
        </div>

        <div style={{ fontSize: "0.85rem", color: "#404854", marginTop: "6px" }}>
          Valor atual por registro
        </div>
      </div>

      <div>
        <Link to="/register">
          <button
            style={{
              marginTop: "2rem",
              padding: "1rem 2.5rem",
              fontSize: "1rem",
              backgroundColor: "#1968D8",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Registrar prova agora
          </button>
        </Link>
      </div>

      <div style={{ marginTop: "3rem", fontSize: "0.85rem", color: "#404854" }}>
        <Link to="/about">Sobre</Link> |{" "}
        <Link to="/terms">Termos</Link> |{" "}
        <Link to="/privacy">Privacidade</Link> |{" "}
        <Link to="/refund-policy">Política de Reembolso</Link>
      </div>
    </div>
  );
}

export default Landing;