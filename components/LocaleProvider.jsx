"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getTranslation } from "@/lib/translations";

const LocaleContext = createContext(null);
const storageKey = "undefinedyou-locale";

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved === "en" || saved === "zh") setLocaleState(saved);
  }, []);

  const setLocale = (nextLocale) => {
    if (nextLocale !== "en" && nextLocale !== "zh") return;
    setLocaleState(nextLocale);
    window.localStorage.setItem(storageKey, nextLocale);
  };

  const value = useMemo(() => ({ locale, setLocale, t: (path) => getTranslation(locale, path) }), [locale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleProvider");
  return context;
}
