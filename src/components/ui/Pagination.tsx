"use client";

import clsx from "clsx";

interface Props {
  page: number; // 1-indexed
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between pt-4">
      <span className="text-[12.5px] text-text-3">
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="h-8 w-8 rounded-full border border-ctrl-line bg-ctrl-bg text-text-2 flex items-center justify-center disabled:opacity-40 hover:border-field-hover transition-colors rtl:rotate-180"
          aria-label="Previous page"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className={clsx(
            "h-8 w-8 rounded-full border border-ctrl-line bg-ctrl-bg text-text-2 flex items-center justify-center disabled:opacity-40 hover:border-field-hover transition-colors rtl:rotate-180"
          )}
          aria-label="Next page"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
