"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import clsx from "clsx";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, Props>(function Checkbox(
  { label, className, id, ...rest },
  ref
) {
  return (
    <label className={clsx("relative inline-flex items-center gap-2.5 cursor-pointer select-none", className)}>
      <input ref={ref} type="checkbox" id={id} className="peer absolute opacity-0 w-[18px] h-[18px]" {...rest} />
      <span
        aria-hidden
        className={clsx(
          "w-[18px] h-[18px] rounded-[5px] border-[1.5px] border-field-hover bg-field-bg transition-all",
          "peer-checked:bg-wine peer-checked:border-wine",
          "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-pink peer-focus-visible:outline-offset-2"
        )}
      />
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth={3}
        className="absolute start-0 top-1/2 -translate-y-1/2 w-[18px] h-[18px] p-[3.5px] opacity-0 scale-75 peer-checked:opacity-100 peer-checked:scale-100 transition-all pointer-events-none"
      >
        <path d="M5 13l4 4L19 7" />
      </svg>
      {label && <span className="text-[13.5px] text-text-2">{label}</span>}
    </label>
  );
});
