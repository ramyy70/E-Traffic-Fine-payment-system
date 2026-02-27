/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from "react";
import { translations } from "../data/translations";

const LangContext = createContext();

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState("en");

  const t = (key) => {
    return translations[lang]?.[key] || key;
  };

  const switchLang = (newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
    }
  };

  return (
    <LangContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
