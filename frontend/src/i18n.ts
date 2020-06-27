import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import englishDic from "./translations/en.json";
import hebrewDic from "./translations/heb.json";
import { Config } from "./shared/Config";
const DEFAULT_LANGUAGE = "heb";
// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: englishDic,
  },
  heb: {
    translation: hebrewDic,
  },
};


export const handleDirection = (preffredLang: string) => {
  let direction = preffredLang === "heb" ? "rtl" : "ltr";
  document.getElementsByTagName('body')[0].style.direction = direction;
  document.getElementsByTagName('body')[0].dir = direction;
}

const getPreferedLanguage = () => {
  let preffredLang;
  // get from local storage
  let savedLanguage = localStorage.getItem(Config.languagePrefix);
  if (savedLanguage?.length) {
    preffredLang = savedLanguage;
  } else if (Config.supportedLanguages.includes(navigator.language)) {
    // get from browser if in supported languages
    preffredLang = navigator.language;
  } else {
    // default language
    preffredLang = DEFAULT_LANGUAGE;
  }
  // Handle ltr rtl
  handleDirection(preffredLang);
  return preffredLang;
};

// Take language from navigator.language
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: getPreferedLanguage(),
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
