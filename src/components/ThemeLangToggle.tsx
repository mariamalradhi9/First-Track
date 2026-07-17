"use client";

import { useThemeLang } from "@/lib/theme-lang";

export function LangToggle() {
  const { lang, toggleLang } = useThemeLang();
  return (
    <button
      type="button"
      onClick={toggleLang}
      className="inline-flex items-center gap-1.5 h-[38px] px-3.5 rounded-full border border-ctrl-line bg-ctrl-bg text-text-2 text-[13px] font-medium hover:text-text hover:border-field-hover transition-colors"
      aria-label="Change language"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20" />
      </svg>
      {lang === "en" ? "EN" : "العربية"}
    </button>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeLang();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center justify-center w-[38px] h-[38px] rounded-full border border-ctrl-line bg-ctrl-bg text-text-2 hover:text-text hover:border-field-hover transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
