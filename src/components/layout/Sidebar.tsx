"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { NavIcon } from "./icons";
import type { NavItem } from "@/lib/nav-config";
import { useT } from "@/lib/i18n";

interface Props {
  navItems: NavItem[];
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

function SidebarContent({
  navItems,
  onNavigate,
  onClose,
}: {
  navItems: NavItem[];
  onNavigate?: () => void;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const t = useT();
  const rolePrefix = navItems[0]?.href.split("/")[1];
  const helpHref = rolePrefix ? `/${rolePrefix}/help` : "#";

  return (
    <div className="flex flex-col h-full">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.close")}
          className="self-start m-4 inline-flex items-center justify-center w-9 h-9 rounded-full text-text-2 hover:text-text hover:bg-field-bg transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        {navItems.map((item, i) => {
          const active = pathname === item.href;
          const showGroupLabel = item.group && item.group !== navItems[i - 1]?.group;
          return (
            <div key={item.href}>
              {showGroupLabel && (
                <p className={clsx("px-3 text-[10.5px] font-semibold uppercase tracking-[0.8px] text-text-3", i === 0 ? "mb-2" : "mt-4 mb-2")}>
                  {t(item.group!)}
                </p>
              )}
              <Link
                href={item.href}
                onClick={onNavigate}
                className={clsx(
                  "flex items-center gap-3 px-3 h-11 rounded-lg text-[13.5px] font-medium transition-colors mb-1",
                  active
                    ? "bg-sidebar-active text-sidebar-active-text"
                    : "text-text-2 hover:text-text hover:bg-field-bg"
                )}
              >
                <NavIcon name={item.icon} className="w-[18px] h-[18px] flex-none" />
                <span className="truncate">{t(item.labelKey)}</span>
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="p-3">
        <div className="rounded-2xl bg-field-bg p-4">
          <p className="text-[13.5px] font-semibold text-text">{t("common.needHelp")}</p>
          <p className="mt-0.5 text-[12px] text-text-3">{t("common.needHelpDesc")}</p>
          <Link
            href={helpHref}
            onClick={onNavigate}
            className="mt-3 inline-flex items-center justify-center w-full h-9 rounded-lg border border-card-line text-[12.5px] font-semibold text-text hover:bg-card-line/40 transition-colors"
          >
            {t("common.helpCentre")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ navItems, mobileOpen, onCloseMobile }: Props) {
  return (
    <div
      className={clsx(
        "fixed inset-0 z-[150] transition-opacity duration-300 ease-out",
        mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
      aria-hidden={!mobileOpen}
    >
      <div className="absolute inset-0 bg-overlay" onClick={onCloseMobile} aria-hidden />
      <div
        className={clsx(
          "absolute inset-y-4 start-4 w-[280px] max-w-[85vw] rounded-[28px] bg-sidebar-bg shadow-2xl overflow-hidden transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-[calc(100%+2rem)] rtl:translate-x-[calc(100%+2rem)]"
        )}
      >
        <SidebarContent navItems={navItems} onNavigate={onCloseMobile} onClose={onCloseMobile} />
      </div>
    </div>
  );
}
