import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import pt from "./locales/pt.json";

const resources = {
  en: { translation: en },
  pt: { translation: pt },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("guardianchain_lang") || "pt",
    fallbackLng: "pt",
    interpolation: {
      escapeValue: false,
    },
  });

// salva idioma ao trocar
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("guardianchain_lang", lng);
});

export default i18n;