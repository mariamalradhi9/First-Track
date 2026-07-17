"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { LangToggle, ThemeToggle } from "@/components/ThemeLangToggle";
import { Avatar } from "@/components/ui/Avatar";
import { AppLogo3D } from "@/components/AppLogo3D";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { useT } from "@/lib/i18n";

interface Props {
  onOpenMobileNav: () => void;
  userName: string;
  userRole: string;
}

export function Topbar({ onOpenMobileNav, userName, userRole }: Props) {
  const t = useT();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-[60] flex items-center justify-between gap-3 h-16 px-4 sm:px-6 border-b border-line bg-bg-solid/80 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-ctrl-line text-text-2 hover:text-text transition-colors"
          aria-label="Open menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px]">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
        <div className="flex items-center gap-2.5">
          <AppLogo3D size={28} />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-bold text-[13px] tracking-[0.5px] uppercase text-text">{t("brand.name")}</span>
            <span className="text-[10.5px] text-text-3">{t("brand.system")}</span>
          </div>
        </div>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2">
          <LangToggle />
          <ThemeToggle />
        </div>

        <NotificationBell />

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 h-[38px] ps-1 pe-2.5 rounded-full border border-ctrl-line bg-ctrl-bg hover:border-field-hover transition-colors"
          >
            <Avatar name={userName} size="sm" />
            <span className="hidden md:inline text-[13px] font-medium text-text max-w-[120px] truncate">{userName}</span>
          </button>

          {menuOpen && (
            <div className="absolute end-0 mt-2 w-56 bg-bg-solid border border-card-line rounded-float shadow-2xl py-2 z-[70]">
              <div className="px-3.5 py-2 border-b border-line mb-1">
                <p className="text-[13.5px] font-semibold text-text truncate">{userName}</p>
                <p className="text-[11.5px] text-text-3 uppercase tracking-[0.4px]">{t(`role.${userRole}` as never)}</p>
              </div>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full text-start px-3.5 py-2 text-[13.5px] text-status-rejected-fg hover:bg-field-bg transition-colors"
              >
                {t("nav.signOut")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
