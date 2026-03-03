import React from "react";
import { useTranslation } from "react-i18next";

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>{t("privacy.title")}</h1>

      <p>{t("privacy.intro")}</p>

      <h2>{t("privacy.section1_title")}</h2>
      <p>{t("privacy.section1_text")}</p>

      <h2>{t("privacy.section2_title")}</h2>
      <p>{t("privacy.section2_text")}</p>

      <h2>{t("privacy.section3_title")}</h2>
      <p>{t("privacy.section3_text")}</p>
    </div>
  );
}