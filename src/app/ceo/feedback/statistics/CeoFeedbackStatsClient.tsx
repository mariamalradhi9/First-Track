"use client";

import { StatTile } from "@/components/ui/StatTile";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { NavIcon } from "@/components/layout/icons";
import { useT } from "@/lib/i18n";

interface DeptRow {
  department: string;
  responses: number;
  avgOverall: number;
  avgMentorSupport: number;
}

interface Props {
  totalResponses: number;
  avgOverall: number;
  avgMentorSupport: number;
  avgSoft: number;
  avgTechnical: number;
  hireRate: number;
  byDepartment: DeptRow[];
}

export function CeoFeedbackStatsClient({
  totalResponses,
  avgOverall,
  avgMentorSupport,
  avgSoft,
  avgTechnical,
  hireRate,
  byDepartment,
}: Props) {
  const t = useT();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("ceo.feedbackStats.title")}</h1>
        <Button variant="secondary" size="sm" onClick={() => window.print()} className="sm:w-auto">
          {t("common.print")}
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatTile className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-20px_rgba(0,0,0,0.5)]" label={t("ceo.feedbackStats.responses")} value={totalResponses} icon={<NavIcon name="feedback" />} />
        <StatTile className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-20px_rgba(0,0,0,0.5)]" label={t("ceo.feedbackStats.avgOverall")} value={`${avgOverall} / 4`} icon={<NavIcon name="goals" />} />
        <StatTile className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-20px_rgba(0,0,0,0.5)]" label={t("ceo.feedbackStats.avgMentorSupport")} value={`${avgMentorSupport} / 4`} icon={<NavIcon name="goals" />} />
        <StatTile className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-20px_rgba(0,0,0,0.5)]" label={t("ceo.feedbackStats.avgSoft")} value={`${avgSoft} / 5`} icon={<NavIcon name="completed" />} />
        <StatTile className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-20px_rgba(0,0,0,0.5)]" label={t("ceo.feedbackStats.avgTechnical")} value={`${avgTechnical} / 5`} icon={<NavIcon name="completed" />} />
        <StatTile className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-20px_rgba(0,0,0,0.5)]" label={t("ceo.feedbackStats.hireRate")} value={`${hireRate}%`} icon={<NavIcon name="certificate" />} />
      </div>

      <Card className="mt-6 p-5 sm:p-7">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.6px] text-text-3 mb-5">
          {t("ceo.feedbackStats.byDepartment")}
        </h2>
        <div className="flex flex-col divide-y divide-line">
          {byDepartment.map((d) => (
            <div key={d.department} className="py-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 items-center">
              <span className="text-[14px] font-medium text-text">{d.department}</span>
              <span className="text-[13px] text-text-2">{d.responses} {t("ceo.feedbackStats.responses").toLowerCase()}</span>
              <span className="text-[13px] text-text-2">{t("ceo.feedbackStats.avgOverall")}: {d.avgOverall || "—"}</span>
              <span className="text-[13px] text-text-2">{t("ceo.feedbackStats.avgMentorSupport")}: {d.avgMentorSupport || "—"}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
