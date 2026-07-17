"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  trailing?: ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, icon, trailing, error, className, id, ...rest },
  ref
) {
  return (
    <div className="field">
      {label && (
        <label
          htmlFor={id}
          className="block font-semibold text-[11px] tracking-[1.2px] uppercase text-text-3 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute start-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-text-3 pointer-events-none [&>svg]:w-full [&>svg]:h-full">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          className={clsx(
            "w-full h-[50px] font-normal text-[14.5px] text-field-text bg-field-bg border border-field-line rounded-input transition-colors",
            "placeholder:text-text-3 placeholder:font-light",
            "hover:border-field-hover focus:outline-none focus:border-pink focus:ring-4 focus:ring-focus-ring",
            icon ? "ps-[42px]" : "ps-3.5",
            trailing ? "pe-11" : "pe-3.5",
            error && "border-status-rejected-fg",
            className
          )}
          {...rest}
        />
        {trailing && <span className="absolute end-2 top-1/2 -translate-y-1/2">{trailing}</span>}
      </div>
      {error && <p className="mt-1.5 text-[12px] text-status-rejected-fg">{error}</p>}
    </div>
  );
});
