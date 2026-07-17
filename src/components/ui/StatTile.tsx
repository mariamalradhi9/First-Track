import type { ReactNode } from "react";
import clsx from "clsx";
import { Card } from "./Card";
import { Skeleton } from "./Skeleton";

interface Props {
  label: string;
  value?: number | string;
  icon?: ReactNode;
  trend?: { value: string; positive?: boolean };
  loading?: boolean;
  className?: string;
}

export function StatTile({ label, value, icon, trend, loading, className }: Props) {
  return (
    <Card className={clsx("p-5 flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold uppercase tracking-[0.8px] text-text-3">{label}</span>
        {icon && <span className="w-8 h-8 rounded-full bg-wine/10 text-wine flex items-center justify-center [&>svg]:w-4 [&>svg]:h-4">{icon}</span>}
      </div>
      {loading ? (
        <Skeleton className="h-9 w-20" />
      ) : (
        <div className="flex items-baseline gap-2">
          <span className="text-[34px] font-semibold leading-none tabular-nums">{value ?? "—"}</span>
          {trend && (
            <span className={clsx("text-[12px] font-medium", trend.positive ? "text-status-approved-fg" : "text-status-rejected-fg")}>
              {trend.value}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
