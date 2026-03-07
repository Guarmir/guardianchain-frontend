import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import en from "./locales/en.json"
import pt from "./locales/pt.json"

// detectar idioma do navegador
const browserLang = navigator.language.startsWith("pt") ? "pt" : "en"

i18n
  .use(initReactI18next)
  .init({

    resources: {
      en: { translation: en },
      pt: { translation: pt }
    },

    lng: browserLang,

    fallbackLng: "en",

    interpolation: {
      escapeValue: false
    }

  })

export default i18n