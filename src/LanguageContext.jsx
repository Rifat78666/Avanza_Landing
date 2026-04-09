import React, { createContext, useState, useContext } from 'react';
import translations from './translations';

const RTL_LANGUAGES = ['AR'];

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('EN');

  const t = (key) => {
    // Fallback to EN if translation is missing in the selected language
    return translations[language]?.[key] || translations['EN'][key] || key;
  };

  const isRTL = RTL_LANGUAGES.includes(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
