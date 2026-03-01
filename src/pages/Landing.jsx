import { Link } from "react-router-dom";

function Landing() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0D47A1, #1968D8)",
        fontFamily: "Arial, sans-serif",
        color: "white"
      }}
    >
      {/* HEADER */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 60px",
          boxSizing: "border-box",
          background: "rgba(0,0,0,0.15)",
          backdropFilter: "blur(8px)",
          zIndex: 1000
        }}
      >
        {/* LOGO */}
        <img
          src="/logo.png"
          alt="GuardianChain"
          style={{
            height: "55px",
            objectFit: "contain"
          }}
        />

        {/* IDIOMA */}
        <div>
          <button
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border: "none",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            PT
          </button>

          <button
            style={{
              marginLeft: "10px",
              padding: "6px 14px",
              borderRadius: "20px",
              border: "none",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            EN
          </button>
        </div>
      </header>

      {/* HERO */}
      <section
        style={{
          paddingTop: "180px",
          textAlign: "center",
          maxWidth: "900px",
          margin: "0 auto",
          paddingLeft: "20px",
          paddingRight: "20px"
        }}
      >
        <h1 style={{ fontSize: "3rem", fontWeight: "700" }}>
          Cartório Digital On-Chain
        </h1>

        <h2
          style={{
            marginTop: "1rem",
            fontWeight: "400",
            fontSize: "1.4rem"
          }}
        >
          Prova pública e permanente de autoria e anterioridade.
        </h2>

        <p
          style={{
            marginTop: "2rem",
            lineHeight: "1.8",
            fontSize: "1.1rem"
          }}
        >
          GuardianChain registra o hash criptográfico do seu arquivo na
          blockchain Polygon, criando uma evidência pública, imutável e
          verificável sem expor o conteúdo original.
        </p>

        {/* BENEFÍCIOS */}
        <div style={{ marginTop: "2.5rem", lineHeight: "2" }}>
          <div>🔒 Conteúdo permanece privado</div>
          <div>⛓ Registro permanente em blockchain</div>
          <div>🌐 Verificação pública via link ou QR Code</div>
          <div>🕒 Prova criptográfica de precedência</div>
        </div>

        {/* CARD PREÇO */}
        <div
          style={{
            marginTop: "4rem",
            background: "white",
            color: "#404854",
            padding: "3rem",
            borderRadius: "20px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
            display: "inline-block",
            minWidth: "340px"
          }}
        >
          <div style={{ fontSize: "0.9rem", color: "#999" }}>
            Registro individual
          </div>

          <div style={{ marginTop: "1rem" }}>
            <span
              style={{
                textDecoration: "line-through",
                marginRight: "12px",
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

          <div style={{ marginTop: "6px", fontSize: "0.9rem" }}>
            Valor atual por registro
          </div>

          <Link to="/register">
            <button
              style={{
                marginTop: "2rem",
                width: "100%",
                padding: "1rem",
                background: "#1968D8",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Registrar prova agora
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Landing;