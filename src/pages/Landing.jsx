import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Landing() {

  const navigate = useNavigate();
  const { t } = useTranslation();

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

      {/* TITULO */}

      <h1
        style={{
          fontSize: "48px",
          marginBottom: "10px",
          textAlign: "center"
        }}
      >
        {t("landing.title")}
      </h1>

      <p
        style={{
          fontSize: "20px",
          marginBottom: "10px",
          textAlign: "center"
        }}
      >
        {t("landing.subtitle")}
      </p>

      <p
        style={{
          maxWidth: "700px",
          textAlign: "center",
          lineHeight: "1.5",
          opacity: "0.9"
        }}
      >
        {t("landing.description")}
      </p>

      {/* BENEFICIOS */}

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          marginTop: "30px",
          textAlign: "center",
          lineHeight: "2"
        }}
      >

        <li>🔒 {t("landing.private")}</li>

        <li>⛓ {t("landing.blockchain")}</li>

        <li>🌐 {t("landing.verify")}</li>

        <li>⏱ {t("landing.proof")}</li>

      </ul>

      {/* CARD PREÇO */}

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
          {t("landing.individual")}
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
          {t("landing.price")}
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
          {t("landing.button")}
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
          {t("landing.about")}
        </a>

        <a
          href="#"
          style={{
            color: "white",
            marginRight: "10px"
          }}
        >
          {t("landing.terms")}
        </a>

        <a
          href="#"
          style={{
            color: "white"
          }}
        >
          {t("landing.privacy")}
        </a>

      </div>

    </div>
  );
}