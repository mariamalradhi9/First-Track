import clsx from "clsx";

interface Props {
  value: number; // 0-100
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, className, showLabel }: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  const overTarget = clamped >= 100;
  return (
    <div className={clsx("flex items-center gap-2.5", className)}>
      <div className="flex-1 h-1.5 rounded-full bg-line overflow-hidden">
        <div
          className={clsx("h-full rounded-full transition-[width] duration-300", overTarget ? "bg-status-approved-fg" : "bg-wine")}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && <span className="text-[12px] text-text-2 tabular-nums w-9 text-right">{clamped}%</span>}
    </div>
  );
}
