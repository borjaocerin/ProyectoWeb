import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import es from './locales/es.json';
import eus from './locales/eus.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      eus: { translation: eus }, 
    },
    fallbackLng: 'es',  
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;
