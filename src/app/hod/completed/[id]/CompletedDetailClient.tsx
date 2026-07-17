"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { SkillScore } from "@/components/ui/RatingInput";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import BackLink from "@/components/BackLink";
import { useToast } from "@/components/ui/Toast";
import { useT } from "@/lib/i18n";
import { confirmClosure } from "../../actions";

interface FinalRemark {
  softSkillsScore: number;
  technicalSkillsScore: number;
  hireRecommended: boolean;
  comments: string | null;
  supervisorName: string;
}

export function CompletedDetailClient({
  internId,
  name,
  department,
  status,
  alreadyConfirmed,
  finalRemark,
}: {
  internId: string;
  name: string;
  department: string;
  status: string;
  alreadyConfirmed: boolean;
  finalRemark: FinalRemark | null;
}) {
  const t = useT();
  const { push } = useToast();
  const [confirmed, setConfirmed] = useState(alreadyConfirmed);
  const [pending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await confirmClosure(internId);
      setConfirmed(true);
      push(`${name} — closure confirmed, forwarded to HR.`, "success");
    });
  }

  return (
    <div className="max-w-3xl mx-auto">
      <BackLink />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <InitialsAvatar name={name} size={44} />
          <h1 className="text-[24px] sm:text-[28px] font-semibold">{name}</h1>
        </div>
        <StatusBadge status={status}>{t(`status.${status}` as never)}</StatusBadge>
      </div>
      <p className="mt-1 ms-[59px] text-[13.5px] text-text-3">{department}</p>

      {finalRemark ? (
        <Card className="mt-5 overflow-hidden">
          <div className="h-[4px] bg-gradient-to-r from-wine to-wine-2" aria-hidden />
          <div className="p-5 sm:p-7">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.6px] text-text-3 mb-5">Mentor&rsquo;s Final Remarks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-text-3 mb-2">Soft Skills</p>
              <SkillScore value={finalRemark.softSkillsScore} disabled />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-text-3 mb-2">Technical Skills</p>
              <SkillScore value={finalRemark.technicalSkillsScore} disabled />
            </div>
          </div>
          <div className="mt-5 pt-5 border-t border-line flex flex-wrap items-center justify-between gap-3">
            <StatusBadge tone={finalRemark.hireRecommended ? "approved" : "neutral"}>
              {finalRemark.hireRecommended ? t("common.hire") : t("common.notHire")}
            </StatusBadge>
            <span className="text-[12.5px] text-text-3">Reviewed by {finalRemark.supervisorName}</span>
          </div>
          {finalRemark.comments && <p className="mt-4 text-[14px] text-text-2 italic">&ldquo;{finalRemark.comments}&rdquo;</p>}
          </div>
        </Card>
      ) : (
        <Card className="mt-5 p-5 sm:p-7 text-center text-[13.5px] text-text-3">
          Waiting on the mentor to submit final remarks.
        </Card>
      )}

      <Card className="mt-5 p-5 sm:p-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[14px] font-medium text-text">{t("hod.completed.confirmClosure")}</p>
          <p className="text-[13px] text-text-2 mt-0.5">
            {confirmed ? "Confirmed — forwarded to HR for certification." : "Review the scorecard, then confirm to send this to HR."}
          </p>
        </div>
        <Button disabled={confirmed || !finalRemark} loading={pending} onClick={handleConfirm} className="sm:w-auto">
          {confirmed ? "Confirmed" : t("hod.completed.confirmClosure")}
        </Button>
      </Card>
    </div>
  );
}
