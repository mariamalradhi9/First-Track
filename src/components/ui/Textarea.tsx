"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import clsx from "clsx";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { label, error, className, id, rows = 4, ...rest },
  ref
) {
  return (
    <div className="field">
      {label && (
        <label htmlFor={id} className="block font-semibold text-[11px] tracking-[1.2px] uppercase text-text-3 mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className={clsx(
          "w-full p-3.5 font-normal text-[14.5px] text-field-text bg-field-bg border border-field-line rounded-input transition-colors resize-y",
          "placeholder:text-text-3 placeholder:font-light",
          "hover:border-field-hover focus:outline-none focus:border-pink focus:ring-4 focus:ring-focus-ring",
          error && "border-status-rejected-fg",
          className
        )}
        {...rest}
      />
      {error && <p className="mt-1.5 text-[12px] text-status-rejected-fg">{error}</p>}
    </div>
  );
});
