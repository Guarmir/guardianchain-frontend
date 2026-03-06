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

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        padding: "20px"
      }}
    >

      <h1>Registro realizado com sucesso ✅</h1>

      <p style={{ marginTop: "10px" }}>
        Seu hash foi enviado para registro na blockchain.
      </p>

      {hash && (
        <>
          <p style={{ marginTop: "20px" }}>
            Hash do arquivo:
          </p>

          <textarea
            value={hash}
            readOnly
            rows="3"
            style={{
              width: "420px",
              padding: "10px",
              marginTop: "10px"
            }}
          />
        </>
      )}

      <p style={{ marginTop: "30px", opacity: 0.7 }}>
        O certificado foi enviado para o seu e-mail.
      </p>

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginTop: "40px"
        }}
      >

        <button
          onClick={handleNewRegister}
          style={{
            padding: "12px 20px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Registrar novo arquivo
        </button>

        <button
          onClick={handleHome}
          style={{
            padding: "12px 20px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Voltar ao início
        </button>

      </div>

    </div>
  );
}