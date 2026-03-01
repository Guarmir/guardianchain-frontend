import { Link } from "react-router-dom";

function Landing() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0D47A1, #1968D8, #2F80ED)",
        color: "white"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          boxSizing: "border-box"
        }}
      >
        {/* LOGO LEFT */}
        <img
          src="/logo.png"
          alt="GuardianChain"
          style={{ height: "45px" }}
        />

        {/* LANGUAGE */}
        <div>
          <button>PT</button>
          <button style={{ marginLeft: "10px" }}>EN</button>
        </div>
      </div>

      {/* HERO */}
      <div
        style={{
          paddingTop: "140px",
          textAlign: "center",
          paddingLeft: "20px",
          paddingRight: "20px"
        }}
      >
        <h1 style={{ fontSize: "2.7rem", fontWeight: "700" }}>
          Cartório Digital On-Chain
        </h1>

        <h2
          style={{
            marginTop: "1rem",
            fontWeight: "400",
            maxWidth: "700px",
            marginLeft: "auto",
            marginRight: "auto"
          }}
        >
          Prova pública e permanente de autoria e anterioridade.
        </h2>

        <p
          style={{
            maxWidth: "750px",
            margin: "2rem auto",
            lineHeight: "1.6"
          }}
        >
          GuardianChain registra o hash criptográfico do seu arquivo na
          blockchain Polygon, criando uma evidência pública, imutável
          e verificável sem expor o conteúdo original.
        </p>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            maxWidth: "600px",
            margin: "2rem auto",
            lineHeight: "1.8",
            fontSize: "1.05rem"
          }}
        >
          <li>🔒 Conteúdo permanece privado</li>
          <li>⛓️ Registro permanente em blockchain</li>
          <li>🌐 Verificação pública via link ou QR Code</li>
          <li>🕒 Prova criptográfica de precedência</li>
        </ul>

        {/* CARD PREÇO */}
        <div
          style={{
            marginTop: "3rem",
            padding: "2.5rem",
            backgroundColor: "white",
            borderRadius: "20px",
            display: "inline-block",
            boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
            color: "#404854",
            minWidth: "300px"
          }}
        >
          <div style={{ fontSize: "0.9rem", color: "#CBD1D6" }}>
            Registro individual
          </div>

          <div style={{ marginTop: "0.8rem" }}>
            <span
              style={{
                textDecoration: "line-through",
                marginRight: "10px",
                fontSize: "1.3rem",
                color: "#999"
              }}
            >
              US$12.00
            </span>

            <span
              style={{
                fontSize: "2.8rem",
                fontWeight: "700",
                color: "#0D47A1"
              }}
            >
              US$9.00
            </span>
          </div>

          <div style={{ fontSize: "0.85rem", marginTop: "8px" }}>
            Valor atual por registro
          </div>

          <Link to="/register">
            <button
              style={{
                marginTop: "1.8rem",
                padding: "1rem 2.5rem",
                fontSize: "1rem",
                backgroundColor: "#1968D8",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
                width: "100%"
              }}
            >
              Registrar prova agora
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;