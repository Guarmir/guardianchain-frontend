import { useSearchParams, useNavigate } from "react-router-dom";

export default function Success() {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const hash = searchParams.get("hash");

  function handleNewRegister() {
    navigate("/register");
  }

  function handleHome() {
    navigate("/");
  }

  function handleDownload() {
    if (!hash) return;
    window.open(`/api/generate-certificate?hash=${hash}`, "_blank");
  }

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#2f4fad,#3f6ae0)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif"
      }}
    >

      <div
        style={{
          background: "white",
          padding: "50px",
          borderRadius: "10px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          textAlign: "center",
          maxWidth: "600px",
          width: "90%"
        }}
      >

        <h1 style={{ marginBottom: "10px" }}>
          Registro realizado com sucesso ✅
        </h1>

        <p style={{ color: "#555" }}>
          Seu hash foi enviado para registro na blockchain.
        </p>

        {hash && (
          <>
            <p style={{ marginTop: "25px", fontWeight: "bold" }}>
              Hash do arquivo
            </p>

            <textarea
              value={hash}
              readOnly
              rows="3"
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "10px",
                borderRadius: "6px",
                border: "1px solid #ddd"
              }}
            />
          </>
        )}

        <p style={{ marginTop: "20px", color: "#666" }}>
          O certificado também foi enviado para o seu e-mail.
        </p>

        <div
          style={{
            marginTop: "35px",
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            flexWrap: "wrap"
          }}
        >

          <button
            onClick={handleDownload}
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
            Baixar certificado
          </button>

          <button
            onClick={handleNewRegister}
            style={{
              background: "#f0f0f0",
              border: "1px solid #ccc",
              padding: "12px 22px",
              borderRadius: "6px",
              fontSize: "15px",
              cursor: "pointer"
            }}
          >
            Registrar novo arquivo
          </button>

          <button
            onClick={handleHome}
            style={{
              background: "#f0f0f0",
              border: "1px solid #ccc",
              padding: "12px 22px",
              borderRadius: "6px",
              fontSize: "15px",
              cursor: "pointer"
            }}
          >
            Voltar ao início
          </button>

        </div>

      </div>

    </div>
  );
}