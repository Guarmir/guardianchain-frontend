import { useLocation } from "react-router-dom";

export default function Success() {

  const query = new URLSearchParams(useLocation().search);
  const hash = query.get("hash");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial",
        textAlign: "center",
        padding: "20px"
      }}
    >
      <h1>Registro realizado com sucesso ✅</h1>

      <p style={{ marginTop: "20px" }}>
        Seu hash foi enviado para registro na blockchain.
      </p>

      {hash && (
        <>
          <p style={{ marginTop: "30px" }}>Hash do arquivo:</p>

          <textarea
            value={hash}
            readOnly
            rows="3"
            style={{
              width: "500px",
              marginTop: "10px",
              padding: "10px"
            }}
          />
        </>
      )}

      <p style={{ marginTop: "40px", opacity: 0.6 }}>
        Em breve você receberá o certificado por email.
      </p>
    </div>
  );
}