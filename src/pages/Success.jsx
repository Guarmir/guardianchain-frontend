export default function Success() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial",
        textAlign: "center",
        padding: "2rem"
      }}
    >
      <h1>✅ Pagamento confirmado</h1>

      <p style={{ maxWidth: 500 }}>
        Seu pagamento foi recebido com sucesso.
        Agora você já pode registrar seu arquivo na blockchain.
      </p>

      <a
        href="/register"
        style={{
          marginTop: "20px",
          padding: "12px 20px",
          background: "#2563eb",
          color: "#fff",
          borderRadius: "6px",
          textDecoration: "none"
        }}
      >
        Ir para o registro
      </a>
    </div>
  );
}
