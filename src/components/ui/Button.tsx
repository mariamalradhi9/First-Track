"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "md" | "sm";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 font-display font-semibold uppercase tracking-[1.5px] rounded-btn transition-all duration-200 active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none disabled:translate-y-0 disabled:shadow-none";

const variants: Record<Variant, string> = {
  primary: "bg-wine text-wine-btn-text hover:bg-wine-2 shadow-[0_12px_26px_-14px_var(--wine)] hover:shadow-[0_16px_30px_-12px_var(--wine)] hover:-translate-y-px",
  // Outline button that inverts to solid wine on hover — per acme-brand-kit's
  // .btn-outline:hover pattern. bg-field-bg was previously used for the hover
  // fill, but in light mode --field-bg is literally #ffffff (same as the
  // resting --card bg), so the hover was invisible there; wine is visible
  // in both themes since it's never equal to the card background.
  secondary:
    "bg-card text-text border border-field-line shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-wine hover:text-wine-btn-text hover:border-wine hover:shadow-[0_14px_28px_-14px_var(--wine)] hover:-translate-y-px",
  ghost: "bg-transparent text-text-2 hover:text-wine-btn-text border border-transparent hover:border-wine hover:bg-wine",
  destructive:
    "bg-status-rejected-fg text-white shadow-[0_10px_22px_-14px_var(--status-rejected-fg)] hover:opacity-90 hover:-translate-y-px",
};

const sizes: Record<Size, string> = {
  md: "h-[50px] px-6 text-[14px]",
  sm: "h-9 px-4 text-[12px] tracking-[1px]",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = "primary", size = "md", loading, disabled, children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={clsx(base, variants[variant], sizes[size], "w-full sm:w-auto", className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 animate-spin" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )}
      {children}
    </button>
  );
});
