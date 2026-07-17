"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  variant?: "default" | "destructive";
}

export function Modal({ open, onClose, title, children, footer, variant = "default" }: Props) {
  // Portal must not render on the client's first paint (must match the
  // server-rendered tree exactly) — only after mount, post-hydration.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-overlay" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        className="relative flex flex-col w-full max-w-md max-h-[85vh] bg-bg-solid border border-card-line rounded-float shadow-2xl animate-[fadeIn_.18s_ease]"
      >
        <div className="overflow-y-auto p-6">
          {title && (
            <h2
              className={clsx(
                "text-[18px] font-semibold mb-4",
                variant === "destructive" && "text-status-rejected-fg"
              )}
            >
              {title}
            </h2>
          )}
          <div className="text-[14px] text-text-2">{children}</div>
        </div>
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-card-line">{footer}</div>
        )}
      </div>
    </div>,
    document.body
  );
}
