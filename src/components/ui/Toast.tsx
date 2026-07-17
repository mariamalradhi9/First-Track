"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

type ToastKind = "success" | "error" | "info";
interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastCtx {
  push: (message: string, kind?: ToastKind) => void;
}

const Ctx = createContext<ToastCtx | null>(null);

const kindClasses: Record<ToastKind, string> = {
  success: "border-status-completed-fg/30",
  error: "border-status-rejected-fg/30",
  info: "border-pink/30",
};

const kindIconTint: Record<ToastKind, string> = {
  success: "bg-status-completed-fg/15 text-status-completed-fg",
  error: "bg-status-rejected-fg/15 text-status-rejected-fg",
  info: "bg-pink/15 text-pink",
};

function ToastIcon({ kind }: { kind: ToastKind }) {
  if (kind === "success") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  }
  if (kind === "error") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" className="w-3.5 h-3.5">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <path d="M12 16v-4M12 8h.01" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

let idCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  // Portal must not render on the server (document doesn't exist there) or on
  // the client's first paint (must match the server-rendered tree exactly) —
  // only after mount, once hydration has completed.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const push = useCallback((message: string, kind: ToastKind = "info") => {
    const id = ++idCounter;
    setToasts((t) => [...t, { id, kind, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      {mounted &&
        createPortal(
          <div className="fixed bottom-5 inset-x-0 z-[300] flex flex-col items-center gap-2 pointer-events-none px-4">
            {toasts.map((t) => (
              <div
                key={t.id}
                className={clsx(
                  "pointer-events-auto flex items-center gap-3 bg-bg-solid border rounded-full ps-2.5 pe-4 py-2 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.55)] text-[13.5px] text-text",
                  "animate-[toastIn_.25s_ease]",
                  kindClasses[t.kind]
                )}
              >
                <span className={clsx("flex items-center justify-center w-7 h-7 rounded-full flex-none", kindIconTint[t.kind])}>
                  <ToastIcon kind={t.kind} />
                </span>
                {t.message}
              </div>
            ))}
          </div>,
          document.body
        )}
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
