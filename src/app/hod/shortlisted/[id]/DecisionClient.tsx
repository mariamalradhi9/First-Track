"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { DetailField } from "@/components/ui/DetailField";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import BackLink from "@/components/BackLink";
import { useToast } from "@/components/ui/Toast";
import { useT } from "@/lib/i18n";
import { decideShortlistApplication } from "../../actions";

interface Application {
  id: string;
  applicantName: string;
  sourceDivision: string | null;
  type: string;
  status: string;
  interviewRemarks: string | null;
  cvUrl: string | null;
  cvName: string | null;
}

export function DecisionClient({ application: a }: { application: Application }) {
  const t = useT();
  const { push } = useToast();
  const [remarks, setRemarks] = useState(a.interviewRemarks ?? "");
  const [status, setStatus] = useState(a.status);
  const [pending, startTransition] = useTransition();
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<{ cprId: string; password: string } | null>(null);

  const decided = status !== "SHORTLISTED";

  function handleDecision(decision: "APPROVE" | "REJECT" | "RECOMMEND") {
    setBusyAction(decision);
    startTransition(async () => {
      const result = await decideShortlistApplication(a.id, decision, remarks);
      const nextStatus = decision === "APPROVE" ? "HOD_APPROVED" : decision === "REJECT" ? "HOD_REJECTED" : "RECOMMENDED_OTHER_DEPT";
      setStatus(nextStatus);
      if (result) setCredentials(result);
      push(`${a.applicantName} — decision recorded.`, "success");
      setBusyAction(null);
    });
  }

  return (
    <div className="max-w-3xl mx-auto">
      <BackLink />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <InitialsAvatar name={a.applicantName} size={44} />
          <h1 className="text-[24px] sm:text-[28px] font-semibold">{a.applicantName}</h1>
        </div>
        <StatusBadge status={status}>{t(`status.${status}` as never)}</StatusBadge>
      </div>

      <Card className="mt-5 overflow-hidden">
        <div className="h-[4px] bg-gradient-to-r from-wine to-wine-2" aria-hidden />
        <div className="p-5 sm:p-7">
        <SectionHeading icon="profile" className="mb-4">
          {t("hr.detail.application")}
        </SectionHeading>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <DetailField label={t("hr.field.sourceDivision")} value={a.sourceDivision} />
          <DetailField label={t("hr.field.type")} value={a.type} />
        </dl>

        {a.cvUrl && (
          <div className="mt-6 pt-5 border-t border-line">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.6px] text-text-3 mb-2">{t("hr.field.cv")}</dt>
            <a href={a.cvUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[13.5px] font-medium text-pink hover:opacity-80">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-4 h-4">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
              </svg>
              {a.cvName}
            </a>
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-line">
          <Textarea
            label={t("hod.decision.remarksLabel")}
            placeholder={t("hod.decision.remarksPh")}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            disabled={decided}
          />
        </div>

        {!decided ? (
          <div className="mt-5 flex flex-wrap gap-3">
            <Button loading={pending && busyAction === "APPROVE"} onClick={() => handleDecision("APPROVE")} className="sm:w-auto">
              {t("common.approve")}
            </Button>
            <Button
              variant="destructive"
              loading={pending && busyAction === "REJECT"}
              onClick={() => handleDecision("REJECT")}
              className="sm:w-auto"
            >
              {t("common.reject")}
            </Button>
            <Button
              variant="secondary"
              loading={pending && busyAction === "RECOMMEND"}
              onClick={() => handleDecision("RECOMMEND")}
              className="sm:w-auto"
            >
              {t("common.recommend")}
            </Button>
          </div>
        ) : (
          <p className="mt-5 text-[13px] text-text-3">Decision recorded — HR has been notified.</p>
        )}
        </div>
      </Card>

      {credentials && (
        <Card className="mt-5 p-5 sm:p-7 border-2 border-status-approved-fg/30">
          <p className="text-[14px] font-medium text-text">Login account created for {a.applicantName}</p>
          <p className="mt-1 text-[13px] text-text-2">
            Share these credentials with the intern — shown once, not stored anywhere visible after this.
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-4 max-w-xs">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.6px] text-text-3">CPR ID</dt>
              <dd className="mt-1 text-[15px] font-mono text-text">{credentials.cprId}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.6px] text-text-3">Password</dt>
              <dd className="mt-1 text-[15px] font-mono text-text">{credentials.password}</dd>
            </div>
          </dl>
        </Card>
      )}
    </div>
  );
}
