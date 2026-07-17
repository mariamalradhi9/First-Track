"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import clsx from "clsx";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { label, error, className, id, children, ...rest },
  ref
) {
  return (
    <div className="field">
      {label && (
        <label htmlFor={id} className="block font-semibold text-[11px] tracking-[1.2px] uppercase text-text-3 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={id}
          className={clsx(
            "w-full h-[50px] ps-3.5 pe-9 font-normal text-[14.5px] text-field-text bg-field-bg border border-field-line rounded-input transition-colors appearance-none",
            "hover:border-field-hover focus:outline-none focus:border-pink focus:ring-4 focus:ring-focus-ring",
            error && "border-status-rejected-fg",
            className
          )}
          {...rest}
        >
          {children}
        </select>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="absolute end-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3 pointer-events-none"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      {error && <p className="mt-1.5 text-[12px] text-status-rejected-fg">{error}</p>}
    </div>
  );
});
