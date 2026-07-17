"use client";

import clsx from "clsx";

const RATING_VALUES = ["POOR", "AVERAGE", "EXCELLENT"] as const;
type RatingValue = (typeof RATING_VALUES)[number];

const RATING_LABELS: Record<RatingValue, string> = { POOR: "Poor", AVERAGE: "Average", EXCELLENT: "Excellent" };

// 3-value segmented control — biweekly review categories
export function RatingSegmented({
  value,
  onChange,
  disabled,
}: {
  value?: RatingValue;
  onChange?: (v: RatingValue) => void;
  disabled?: boolean;
}) {
  return (
    <div className="inline-flex rounded-full border border-ctrl-line bg-ctrl-bg p-1 gap-1">
      {RATING_VALUES.map((v) => (
        <button
          key={v}
          type="button"
          disabled={disabled}
          onClick={() => onChange?.(v)}
          className={clsx(
            "px-3.5 h-7 rounded-full text-[12px] font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none",
            value === v
              ? v === "EXCELLENT"
                ? "bg-status-approved-fg text-white"
                : v === "AVERAGE"
                ? "bg-status-pending-fg text-white"
                : "bg-status-rejected-fg text-white"
              : "text-text-2 hover:text-text"
          )}
        >
          {RATING_LABELS[v]}
        </button>
      ))}
    </div>
  );
}

// 1-5 numeric skill score selector — Final Remarks (soft/technical skills)
export function SkillScore({
  value,
  onChange,
  max = 5,
  disabled,
}: {
  value?: number;
  onChange?: (v: number) => void;
  max?: number;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onChange?.(n)}
          aria-label={`${n} of ${max}`}
          className={clsx(
            "w-9 h-9 rounded-full border text-[13px] font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none",
            value && n <= value ? "bg-wine border-wine text-white" : "border-field-line text-text-3 hover:border-field-hover"
          )}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

// read-only display for an auto-calculated consolidated rating
export function ConsolidatedRating({ value }: { value: number | null | undefined }) {
  if (value == null) return <span className="text-text-3 text-[13px]">—</span>;
  const tone = value >= 4 ? "text-status-approved-fg" : value >= 2.5 ? "text-status-pending-fg" : "text-status-rejected-fg";
  return (
    <span className={clsx("font-semibold tabular-nums", tone)}>
      {value.toFixed(1)} <span className="text-text-3 font-normal">/ 5</span>
    </span>
  );
}
