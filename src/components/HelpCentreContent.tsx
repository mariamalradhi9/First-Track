"use client";

import { Card } from "@/components/ui/Card";
import { useT } from "@/lib/i18n";

const FAQ_KEYS = [
  ["help.faq1Q", "help.faq1A"],
  ["help.faq2Q", "help.faq2A"],
  ["help.faq3Q", "help.faq3A"],
  ["help.faq4Q", "help.faq4A"],
] as const;

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-none transition-transform duration-200 group-open:rotate-180">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function HelpCentreContent() {
  const t = useT();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-float bg-gradient-to-br from-navy to-navy-mid px-6 py-9 sm:px-10 sm:py-12 text-center overflow-hidden relative">
        <div className="absolute inset-x-0 top-0 h-[5px] bg-gradient-to-r from-wine to-wine-2" aria-hidden />
        <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 text-white mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 2-3 4" />
            <path d="M12 17h.01" />
            <circle cx="12" cy="12" r="9.5" />
          </svg>
        </span>
        <h1 className="text-[26px] sm:text-[32px] font-semibold text-white">{t("help.title")}</h1>
        <p className="mt-2 text-[14px] text-white/70 max-w-md mx-auto">{t("help.lede")}</p>
      </div>

      <Card className="mt-5 p-5 sm:p-7">
        <h2 className="text-[15px] font-semibold">{t("help.faqTitle")}</h2>
        <div className="mt-3 flex flex-col divide-y divide-line">
          {FAQ_KEYS.map(([q, a]) => (
            <details key={q} className="group py-4 first:pt-0 last:pb-0">
              <summary className="flex items-center justify-between gap-3 cursor-pointer list-none text-[14px] font-semibold text-text marker:content-none [&::-webkit-details-marker]:hidden">
                {t(q)}
                <ChevronIcon />
              </summary>
              <p className="mt-2.5 text-[13.5px] text-text-2 leading-relaxed">{t(a)}</p>
            </details>
          ))}
        </div>
      </Card>

      <Card className="mt-5 p-5 sm:p-7">
        <h2 className="text-[15px] font-semibold mb-4">{t("help.contactTitle")}</h2>
        <p className="text-[13.5px] text-text-2 -mt-3 mb-4">{t("help.contactDesc")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="mailto:it-support@almoayyedcomputers.com"
            className="flex items-center gap-3 p-4 rounded-input border border-field-line hover:border-wine transition-colors"
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-wine/10 text-wine flex-none">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block text-[11px] font-semibold uppercase tracking-[1.2px] text-text-3">{t("help.contactEmail")}</span>
              <span className="block text-[13.5px] text-text truncate">it-support@almoayyedcomputers.com</span>
            </span>
          </a>
          <div className="flex items-center gap-3 p-4 rounded-input border border-field-line">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-wine/10 text-wine flex-none">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block text-[11px] font-semibold uppercase tracking-[1.2px] text-text-3">{t("help.contactPhone")}</span>
              <span className="block text-[13.5px] text-text">+973 1746 6000</span>
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
