import { Link } from "react-router-dom";

function Landing() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0D47A1, #1968D8, #2F80ED)",
        color: "white",
        fontFamily: "Arial, sans-serif"
      }}
    >
      {/* HEADER FIXO */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "25px 60px",
          boxSizing: "border-box",
          backdropFilter: "blur(6px)",
          background: "rgba(13, 71, 161, 0.35)",
          zIndex: 1000
        }}
      >
        {/* LOGO */}
        <img
          src="/logo.png"
          alt="GuardianChain"
          style={{
            height: "75px",
            objectFit: "contain"
          }}
        />

        {/* BOTÕES IDIOMA */}
        <div>
          <button
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            PT
          </button>
          <button
            style={{
              marginLeft: "10px",
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            EN
          </button>
        </div>
      </div>

      {/* HERO */}
      <div
        style={{
          paddingTop: "200px",
          textAlign: "center",
          paddingLeft: "20px",
          paddingRight: "20px"
        }}
      >
        <h1
          style={{
            fontSize: "2.8rem",
            fontWeight: "700"
          }}
        >
          Cartório Digital On-Chain
        </h1>

        <h2
          style={{
            marginTop: "1rem",
            fontWeight: "400",
            maxWidth: "750px",
            marginLeft: "auto",
            marginRight: "auto"
          }}
        >
          Prova pública e permanente de autoria e anterioridade.
        </h2>

        <p
          style={{
            maxWidth: "800px",
            margin: "2rem auto",
            lineHeight: "1.7",
            fontSize: "1.05rem"
          }}
        >
          GuardianChain registra o hash criptográfico do seu arquivo na
          blockchain Polygon, criando uma evidência pública, imutável
          e verificável sem expor o conteúdo original.
        </p>

        {/* BENEFÍCIOS */}
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            maxWidth: "600px",
            margin: "2rem auto",
            lineHeight: "1.9",
            fontSize: "1.1rem"
          }}
        >
          <li>🔒 Conteúdo permanece privado</li>
          <li>⛓️ Registro permanente em blockchain</li>
          <li>🌐 Verificação pública via link ou QR Code</li>
          <li>🕒 Prova criptográfica de precedência</li>
        </ul>

        {/* CARD DE PREÇO */}
        <div
          style={{
            marginTop: "3.5rem",
            padding: "3rem",
            backgroundColor: "white",
            borderRadius: "22px",
            display: "inline-block",
            boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
            color: "#404854",
            minWidth: "320px"
          }}
        >
          <div style={{ fontSize: "0.95rem", color: "#CBD1D6" }}>
            Registro individual
          </div>

          <div style={{ marginTop: "1rem" }}>
            <span
              style={{
                textDecoration: "line-through",
                marginRight: "12px",
                fontSize: "1.4rem",
                color: "#999"
              }}
            >
              US$12.00
            </span>

            <span
              style={{
                fontSize: "3rem",
                fontWeight: "700",
                color: "#0D47A1"
              }}
            >
              US$9.00
            </span>
          </div>

          <div style={{ fontSize: "0.9rem", marginTop: "8px" }}>
            Valor atual por registro
          </div>

          <Link to="/register">
            <button
              style={{
                marginTop: "2rem",
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

        {/* FOOTER */}
        <div
          style={{
            marginTop: "4rem",
            fontSize: "0.95rem"
          }}
        >
          <Link to="/about" style={{ color: "white", marginRight: "20px" }}>
            Sobre
          </Link>
          <Link to="/terms" style={{ color: "white", marginRight: "20px" }}>
            Termos
          </Link>
          <Link to="/privacy" style={{ color: "white", marginRight: "20px" }}>
            Privacidade
          </Link>
          <Link to="/refund-policy" style={{ color: "white" }}>
            Política de Reembolso
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;