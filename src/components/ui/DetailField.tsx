import type { ReactNode } from "react";

export function DetailField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.6px] text-text-3">{label}</dt>
      <dd className="mt-1 text-[14px] text-text">{value ?? "—"}</dd>
    </div>
  );
}
