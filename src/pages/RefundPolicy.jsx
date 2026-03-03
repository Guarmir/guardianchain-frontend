import React from "react";
import { useTranslation } from "react-i18next";

export default function RefundPolicy() {
  const { t } = useTranslation();

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>{t("refund.title")}</h1>
      <p>{t("refund.intro")}</p>

      <h2>{t("refund.section1_title")}</h2>
      <p>{t("refund.section1_text")}</p>

      <h2>{t("refund.section2_title")}</h2>
      <p>{t("refund.section2_text")}</p>

      <h2>{t("refund.section3_title")}</h2>
      <p>{t("refund.section3_text")}</p>
    </div>
  );
}