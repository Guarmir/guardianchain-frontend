import React from "react";
import { useTranslation } from "react-i18next";

export default function Terms() {
  const { t } = useTranslation();

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>{t("terms.title")}</h1>

      <p>{t("terms.intro")}</p>

      <h2>{t("terms.section1_title")}</h2>
      <p>{t("terms.section1_text")}</p>

      <h2>{t("terms.section2_title")}</h2>
      <p>{t("terms.section2_text")}</p>

      <h2>{t("terms.section3_title")}</h2>
      <p>{t("terms.section3_text")}</p>
    </div>
  );
}