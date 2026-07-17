"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

export type Theme = "dark" | "light";
export type Lang = "en" | "ar";

interface ThemeLangCtx {
  theme: Theme;
  lang: Lang;
  setTheme: (t: Theme) => void;
  setLang: (l: Lang) => void;
  toggleTheme: () => void;
  toggleLang: () => void;
}

const Ctx = createContext<ThemeLangCtx | null>(null);

export function ThemeLangProvider({ children }: { children: ReactNode }) {
  // read initial values from the DOM attributes the boot script already set (avoids a flash)
  const [theme, setThemeState] = useState<Theme>("dark");
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const root = document.documentElement;
    const t = (root.getAttribute("data-theme") as Theme) || "dark";
    const l = (root.getAttribute("lang") as Lang) || "en";
    setThemeState(t);
    setLangState(l);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem("acme-theme", t);
    } catch {}
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    const root = document.documentElement;
    root.setAttribute("lang", l);
    root.setAttribute("dir", l === "ar" ? "rtl" : "ltr");
    try {
      localStorage.setItem("acme-lang", l);
    } catch {}
  }, []);

  const toggleTheme = useCallback(() => setTheme(theme === "light" ? "dark" : "light"), [theme, setTheme]);
  const toggleLang = useCallback(() => setLang(lang === "en" ? "ar" : "en"), [lang, setLang]);

  return (
    <Ctx.Provider value={{ theme, lang, setTheme, setLang, toggleTheme, toggleLang }}>{children}</Ctx.Provider>
  );
}

export function useThemeLang() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useThemeLang must be used within ThemeLangProvider");
  return ctx;
}
