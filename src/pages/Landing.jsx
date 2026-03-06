import { useNavigate } from "react-router-dom";

export default function Landing() {

  const navigate = useNavigate();

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#2f4fad,#3f6ae0)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        color: "white",
        paddingTop: "60px"
      }}
    >

      {/* LOGO */}

      <div style={{ marginBottom: "20px" }}>
        <img
          src="/logo.png"
          alt="GuardianChain"
          style={{
            height: "60px"
          }}
        />
      </div>

      {/* TÍTULO */}

      <h1
        style={{
          fontSize: "48px",
          marginBottom: "10px",
          textAlign: "center"
        }}
      >
        Registro Digital On-Chain
      </h1>

      <p
        style={{
          fontSize: "20px",
          marginBottom: "10px",
          textAlign: "center"
        }}
      >
        Prova pública e permanente de autoria e anterioridade.
      </p>

      <p
        style={{
          maxWidth: "700px",
          textAlign: "center",
          lineHeight: "1.5",
          opacity: "0.9"
        }}
      >
        A GuardianChain registra o hash criptográfico do seu arquivo na
        blockchain Polygon, criando uma prova pública, imutável e
        verificável de forma independente sem expor o conteúdo original.
      </p>

      {/* LISTA DE BENEFÍCIOS */}

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          marginTop: "30px",
          textAlign: "center",
          lineHeight: "2"
        }}
      >

        <li>🔒 Seu conteúdo permanece totalmente privado</li>

        <li>⛓ Registro permanente na blockchain</li>

        <li>🌐 Verificação pública via link ou QR Code</li>

        <li>⏱ Prova criptográfica de precedência</li>

      </ul>

      {/* CARD DE PREÇO */}

      <div
        style={{
          background: "white",
          color: "#333",
          padding: "40px",
          borderRadius: "12px",
          width: "320px",
          marginTop: "40px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
        }}
      >

        <p style={{ marginBottom: "10px" }}>
          Registro individual
        </p>

        <h2 style={{ marginBottom: "5px" }}>
          US$ 9,00
        </h2>

        <p
          style={{
            fontSize: "14px",
            color: "#666",
            marginBottom: "25px"
          }}
        >
          Valor atual por registro
        </p>

        <button
          onClick={() => navigate("/register")}
          style={{
            background: "#2f4fad",
            color: "white",
            border: "none",
            padding: "12px 22px",
            borderRadius: "6px",
            fontSize: "15px",
            cursor: "pointer"
          }}
        >
          Registrar prova agora
        </button>

      </div>

      {/* RODAPÉ */}

      <div
        style={{
          marginTop: "30px",
          fontSize: "14px"
        }}
      >

        <a
          href="#"
          style={{
            color: "white",
            marginRight: "10px"
          }}
        >
          Sobre
        </a>

        <a
          href="#"
          style={{
            color: "white",
            marginRight: "10px"
          }}
        >
          Termos
        </a>

        <a
          href="#"
          style={{
            color: "white"
          }}
        >
          Privacidade
        </a>

      </div>

    </div>

  );
}