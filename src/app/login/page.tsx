"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { CinematicIntro } from "@/components/CinematicIntro";
import { LangToggle, ThemeToggle } from "@/components/ThemeLangToggle";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n";

export default function LoginPage() {
  const t = useT();
  const router = useRouter();
  const heroSlotRef = useRef<HTMLDivElement>(null);
  const [appVisible, setAppVisible] = useState(false);
  const [cprId, setCprId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotInfo, setShowForgotInfo] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await signIn("credentials", { cprId, password, redirect: false });
    setSubmitting(false);
    if (res?.error) {
      setError(t("auth.error"));
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <CinematicIntro heroSlotRef={heroSlotRef} onComplete={() => setAppVisible(true)} />

      <div
        className="flex-1 flex flex-col transition-opacity duration-500"
        style={{ opacity: appVisible ? 1 : 0 }}
        aria-hidden={!appVisible}
      >
        <header className="flex items-center justify-between p-5 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-[14px] sm:text-[15px] tracking-[1.5px] uppercase">{t("brand.name")}</span>
              <span className="text-[11px] text-text-3 mt-0.5">{t("brand.system")}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <LangToggle />
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-5 py-6">
          <section aria-label="Sign in" className="w-full max-w-[452px] text-center">
            <div ref={heroSlotRef} className="w-[118px] h-[118px] mx-auto mb-4" aria-hidden />

            <div className="font-semibold text-[12px] tracking-[3px] uppercase text-pink">{t("auth.eyebrow")}</div>
            <h1 className="font-sans normal-case mt-3.5 font-semibold text-[clamp(32px,5vw,46px)] leading-[1.05] tracking-tight">
              {t("auth.welcome")}
            </h1>
            <p className="mt-3 text-[15px] font-light text-text-2">{t("auth.lede")}</p>

            <form onSubmit={handleSubmit} className="mt-7 text-start" noValidate>
              <Input
                label={t("auth.cprId")}
                id="cprId"
                name="cprId"
                autoComplete="username"
                placeholder={t("auth.cprIdPh")}
                value={cprId}
                onChange={(e) => setCprId(e.target.value)}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M7 15v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1" />
                    <circle cx="12" cy="8.5" r="2" />
                  </svg>
                }
              />

              <div className="mt-4">
                <Input
                  label={t("auth.password")}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder={t("auth.passwordPh")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
                      <rect x="4" y="11" width="16" height="9" rx="2" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    </svg>
                  }
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="p-2 text-text-3 hover:text-text rounded-md transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-[18px] h-[18px]">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-6.5 0-10-8-10-8a18.5 18.5 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <path d="m1 1 22 22" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-[18px] h-[18px]">
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  }
                />
              </div>

              {error && <p className="mt-3 text-[13px] text-status-rejected-fg">{error}</p>}

              <div className="flex items-center justify-between mt-4 gap-3">
                <Checkbox
                  label={t("auth.remember")}
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <button
                  type="button"
                  onClick={() => setShowForgotInfo((v) => !v)}
                  className="text-[13.5px] font-medium text-pink hover:opacity-80 transition-opacity"
                >
                  {t("auth.forgot")}
                </button>
              </div>

              {showForgotInfo && (
                <p className="mt-3 text-[13px] text-text-2 bg-field-bg rounded-input px-3.5 py-2.5">{t("auth.forgotInfo")}</p>
              )}

              <Button type="submit" loading={submitting} className="mt-6 !w-full">
                {submitting ? t("auth.signingin") : t("auth.signin")}
                {!submitting && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.3} className="w-4 h-4 rtl:-scale-x-100">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                )}
              </Button>

              <div className="flex items-center gap-3.5 my-5">
                <span className="flex-1 h-px bg-line" />
                <span className="text-[11px] tracking-[1.5px] uppercase text-text-3">{t("auth.or")}</span>
                <span className="flex-1 h-px bg-line" />
              </div>

              <Button type="button" variant="secondary" className="!w-full normal-case tracking-normal font-semibold text-[13.5px]">
                <span className="w-4 h-4 grid grid-cols-2 gap-[1.5px]">
                  <i className="block bg-[#f25022]" />
                  <i className="block bg-[#7fba00]" />
                  <i className="block bg-[#00a4ef]" />
                  <i className="block bg-[#ffb900]" />
                </span>
                {t("auth.microsoft")}
              </Button>

              <p className="mt-6 text-center text-[13px] text-text-2">
                {t("auth.noaccess")}{" "}
                <a href="#" className="font-semibold text-pink hover:opacity-80 transition-opacity">
                  {t("auth.contact")}
                </a>
              </p>
            </form>
          </section>
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-4 px-5 sm:px-8 py-5 text-[11.5px] tracking-[0.6px] text-text-3">
          <span className="flex items-center gap-2.5 uppercase tracking-[1.4px]">
            {t("brand.since")}
            <span className="w-1 h-1 rounded-full bg-current opacity-70" />
            {t("brand.location")}
          </span>
          <span>{t("brand.copyright")}</span>
        </footer>
      </div>
    </div>
  );
}
