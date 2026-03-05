import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function Landing() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0D47A1,#1E63D5)",
        color: "white",
        fontFamily: "Arial, sans-serif"
      }}
    >
      {/* HEADER */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 60px"
        }}
      >
        <img
          src="/logo.png"
          alt="GuardianChain"
          style={{ height: "70px" }}
        />

        <div>
          <button onClick={() => changeLanguage("pt")}>PT</button>
          <button onClick={() => changeLanguage("en")}>EN</button>
        </div>
      </header>

      {/* HERO */}
      <div
        style={{
          textAlign: "center",
          marginTop: "80px",
          maxWidth: "900px",
          marginLeft: "auto",
          marginRight: "auto"
        }}
      >
        <h1 style={{ fontSize: "48px" }}>
          {t("hero.title")}
        </h1>

        <p style={{ fontSize: "20px" }}>
          {t("hero.subtitle")}
        </p>

        <p style={{ marginTop: "20px" }}>
          {t("hero.description")}
        </p>

        {/* FEATURES */}
        <div style={{ marginTop: "40px", lineHeight: "2" }}>
          <div>🔒 {t("features.private")}</div>
          <div>⛓ {t("features.blockchain")}</div>
          <div>🌐 {t("features.verification")}</div>
          <div>🕒 {t("features.proof")}</div>
        </div>

        {/* PRICING */}
        <div
          style={{
            marginTop: "60px",
            background: "white",
            color: "#333",
            padding: "40px",
            borderRadius: "20px",
            width: "350px",
            marginLeft: "auto",
            marginRight: "auto"
          }}
        >
          <p>{t("pricing.label")}</p>

          <h2>US$ 9,00</h2>

          <p>{t("pricing.current")}</p>

          <Link to="/register">
            <button
              style={{
                marginTop: "20px",
                padding: "15px 30px",
                background: "#1E63D5",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer"
              }}
            >
              {t("pricing.cta")}
            </button>
          </Link>
        </div>

        {/* FOOTER */}
        <div style={{ marginTop: "40px" }}>
          <Link to="/about">{t("footer.about")}</Link>{" "}
          <Link to="/terms">{t("footer.terms")}</Link>{" "}
          <Link to="/privacy">{t("footer.privacy")}</Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;