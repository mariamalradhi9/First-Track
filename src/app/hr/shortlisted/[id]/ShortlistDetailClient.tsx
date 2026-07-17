"use client";

import { format } from "date-fns";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DetailField } from "@/components/ui/DetailField";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import BackLink from "@/components/BackLink";
import { useT } from "@/lib/i18n";

interface Application {
  id: string;
  applicantName: string;
  sourceDivision: string | null;
  department: string;
  type: string;
  status: string;
  trainingPeriodStart: string | null;
  trainingPeriodEnd: string | null;
  interviewRemarks: string | null;
  decidedByName: string | null;
  cvUrl: string | null;
  cvName: string | null;
  createdAt: string;
}

export function ShortlistDetailClient({ application: a }: { application: Application }) {
  const t = useT();

  return (
    <div className="max-w-3xl mx-auto">
      <BackLink />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <InitialsAvatar name={a.applicantName} size={44} />
          <h1 className="text-[24px] sm:text-[28px] font-semibold">{a.applicantName}</h1>
        </div>
        <StatusBadge status={a.status}>{t(`status.${a.status}` as never)}</StatusBadge>
      </div>

      <Card className="mt-5 overflow-hidden">
        <div className="h-[4px] bg-gradient-to-r from-wine to-wine-2" aria-hidden />
        <div className="p-5 sm:p-7">
        <SectionHeading icon="profile" className="mb-4">
          {t("hr.detail.application")}
        </SectionHeading>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <DetailField label={t("common.department")} value={a.department} />
          <DetailField label={t("hr.field.sourceDivision")} value={a.sourceDivision} />
          <DetailField label={t("hr.field.type")} value={a.type} />
          <DetailField label={t("common.date")} value={format(new Date(a.createdAt), "d MMM yyyy")} />
          <DetailField
            label={t("hr.field.periodStart")}
            value={a.trainingPeriodStart ? format(new Date(a.trainingPeriodStart), "d MMM yyyy") : null}
          />
          <DetailField
            label={t("hr.field.periodEnd")}
            value={a.trainingPeriodEnd ? format(new Date(a.trainingPeriodEnd), "d MMM yyyy") : null}
          />
        </dl>

        {a.cvUrl && (
          <div className="mt-6 pt-5 border-t border-line">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.6px] text-text-3 mb-2">{t("hr.field.cv")}</dt>
            <a
              href={a.cvUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[13.5px] font-medium text-pink hover:opacity-80 transition-opacity"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-4 h-4">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
              </svg>
              {a.cvName}
            </a>
          </div>
        )}

        {(a.interviewRemarks || a.decidedByName) && (
          <div className="mt-6 pt-5 border-t border-line">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.6px] text-text-3 mb-2">Interview Remarks</dt>
            <dd className="text-[14px] text-text-2">{a.interviewRemarks ?? "—"}</dd>
            {a.decidedByName && <dd className="mt-1 text-[12.5px] text-text-3">— {a.decidedByName}</dd>}
          </div>
        )}
        </div>
      </Card>
    </div>
  );
}
