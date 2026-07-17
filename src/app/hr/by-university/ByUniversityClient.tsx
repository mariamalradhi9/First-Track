"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { useT } from "@/lib/i18n";

interface Row {
  university: string;
  total: number;
  active: number;
  certified: number;
}

export function ByUniversityClient({ rows }: { rows: Row[] }) {
  const t = useT();

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, r) => ({
          universities: acc.universities + 1,
          interns: acc.interns + r.total,
          certified: acc.certified + r.certified,
        }),
        { universities: 0, interns: 0, certified: 0 }
      ),
    [rows]
  );

  const sorted = useMemo(() => [...rows].sort((a, b) => b.total - a.total), [rows]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("hr.byUniversity.title")}</h1>
      <p className="mt-1.5 text-[14px] text-text-2">{t("hr.byUniversity.lede")}</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon="university" tint="bg-[#efe6ff] text-[#7c4dff]" value={totals.universities} label={t("hr.byUniversity.totalUniversities")} />
        <StatCard icon="current" tint="bg-[#dcf5e6] text-[#1e8e5a]" value={totals.interns} label={t("hr.byUniversity.totalInterns")} />
        <StatCard icon="certificate" tint="bg-[#fbe6ee] text-[#c2185b]" value={totals.certified} label={t("hr.byUniversity.totalCertified")} />
      </div>

      {sorted.length === 0 ? (
        <div className="mt-5">
          <EmptyState title="No data yet" message="University breakdowns will appear here once interns are linked to a university." />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.map((r) => {
            const activePct = r.total > 0 ? Math.round((r.active / r.total) * 100) : 0;
            const certifiedPct = r.total > 0 ? Math.round((r.certified / r.total) * 100) : 0;
            return (
              <Card
                key={r.university}
                className="p-5 sm:p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-20px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center gap-3.5">
                  <InitialsAvatar name={r.university} size={44} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-text truncate">{r.university}</p>
                    <p className="text-[12px] text-text-3">
                      {r.total} {t("hr.byUniversity.totalInterns")}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3">
                  <div>
                    <div className="flex items-center justify-between text-[11.5px] font-semibold uppercase tracking-[0.5px] text-text-3 mb-1.5">
                      <span>{t("hr.byUniversity.colActive")}</span>
                      <span className="text-text tabular-nums">{r.active}</span>
                    </div>
                    <ProgressBar value={activePct} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[11.5px] font-semibold uppercase tracking-[0.5px] text-text-3 mb-1.5">
                      <span>{t("hr.byUniversity.colCertified")}</span>
                      <span className="text-text tabular-nums">{r.certified}</span>
                    </div>
                    <ProgressBar value={certifiedPct} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
