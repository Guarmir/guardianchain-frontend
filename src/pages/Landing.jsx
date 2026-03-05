import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Landing() {
  const { t } = useTranslation();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0D47A1,#1968D8)",
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
          alignItems: "center",
          padding: "20px 60px",
          boxSizing: "border-box",
          background: "rgba(0,0,0,0.15)",
          backdropFilter: "blur(8px)",
          zIndex: 1000
        }}
      >
        <img
          src="/logo.png"
          alt="GuardianChain"
          style={{
            height: "110px",
            objectFit: "contain"
          }}
        />
      </header>

      {/* HERO */}
      <section
        style={{
          paddingTop: "200px",
          textAlign: "center",
          maxWidth: "900px",
          margin: "0 auto",
          padding: "0 20px"
        }}
      >
        <h1 style={{ fontSize: "3rem", fontWeight: 700 }}>
          {t("hero.title")}
        </h1>

        <h2
          style={{
            marginTop: "1rem",
            fontWeight: 400,
            fontSize: "1.4rem"
          }}
        >
          {t("hero.subtitle")}
        </h2>

        <p
          style={{
            marginTop: "2rem",
            lineHeight: "1.8",
            fontSize: "1.1rem"
          }}
        >
          {t("hero.description")}
        </p>

        {/* FEATURES */}
        <div
          style={{
            marginTop: "2.5rem",
            lineHeight: "2",
            fontSize: "1.1rem"
          }}
        >
          <div>🔒 {t("features.private")}</div>
          <div>⛓ {t("features.blockchain")}</div>
          <div>🌐 {t("features.verification")}</div>
          <div>🕒 {t("features.proof")}</div>
        </div>

        {/* PRICING */}
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
            {t("pricing.label")}
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
            {t("pricing.current")}
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
              {t("pricing.cta")}
            </button>
          </Link>
        </div>

        {/* FOOTER */}
        <div style={{ marginTop: "4rem", marginBottom: "3rem" }}>
          <Link to="/about" style={{ color: "white", marginRight: "20px" }}>
            {t("footer.about")}
          </Link>

          <Link to="/terms" style={{ color: "white", marginRight: "20px" }}>
            {t("footer.terms")}
          </Link>

          <Link to="/privacy" style={{ color: "white" }}>
            {t("footer.privacy")}
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Landing;