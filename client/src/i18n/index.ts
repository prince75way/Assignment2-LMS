import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import es from './es.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en, // Use the imported en.json content
    },
    es: {
      translation: es, // Use the imported es.json content
    },
  },
  lng: 'en', // Default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already handles escaping
  },
});

export default i18n;
