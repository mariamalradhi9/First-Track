"use client";

import type { ReactNode } from "react";
import clsx from "clsx";
import { Card } from "./Card";
import { SkeletonRows } from "./Skeleton";
import { EmptyState } from "./EmptyState";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  keyField: keyof T;
  loading?: boolean;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyMessage?: string;
}

export function DataTable<T extends object>({
  columns,
  rows,
  keyField,
  loading,
  onRowClick,
  emptyTitle = "No results found",
  emptyMessage = "Try adjusting your filters or search terms.",
}: Props<T>) {
  return (
    <Card className="overflow-hidden">
      {loading ? (
        <div className="p-4">
          <SkeletonRows rows={6} cols={columns.length} />
        </div>
      ) : rows.length === 0 ? (
        <EmptyState title={emptyTitle} message={emptyMessage} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13.5px]">
            <thead>
              <tr className="bg-table-header-bg">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={clsx(
                      "text-start font-semibold text-[11px] uppercase tracking-[0.6px] text-text-3 px-4 py-3 whitespace-nowrap",
                      col.hideOnMobile && "hidden sm:table-cell",
                      col.className
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={String(row[keyField])}
                  onClick={() => onRowClick?.(row)}
                  className={clsx(
                    "group border-t border-line transition-colors",
                    i % 2 === 1 && "bg-table-row-alt",
                    // bg-field-bg is literally #fff in light mode (same as the
                    // card itself), so that hover was invisible there — wine
                    // tint is visible in both themes.
                    onRowClick && "cursor-pointer hover:bg-wine/[0.06]"
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={clsx("px-4 py-3.5 align-middle text-text-2", col.hideOnMobile && "hidden sm:table-cell", col.className)}
                    >
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
