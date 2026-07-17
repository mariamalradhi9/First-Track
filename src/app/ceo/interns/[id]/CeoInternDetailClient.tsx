"use client";

import { format } from "date-fns";
import BackLink from "@/components/BackLink";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SkillScore } from "@/components/ui/RatingInput";
import { InternProfileCard, type InternProfileData } from "@/components/InternProfileCard";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { useT } from "@/lib/i18n";

interface FinalRemark {
  softSkillsScore: number;
  technicalSkillsScore: number;
  hireRecommended: boolean;
  comments: string | null;
  supervisorName: string;
}
interface Certificate {
  certifiedAt: string;
  certifiedByName: string;
}

export function CeoInternDetailClient({
  intern,
  finalRemark,
  certificate,
  hasFeedback,
}: {
  intern: InternProfileData;
  finalRemark: FinalRemark | null;
  certificate: Certificate | null;
  hasFeedback: boolean;
}) {
  const t = useT();

  return (
    <div className="max-w-3xl mx-auto">
      <BackLink />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <InitialsAvatar name={intern.name} size={44} />
          <h1 className="text-[24px] sm:text-[28px] font-semibold">{intern.name}</h1>
        </div>
        <StatusBadge status={intern.status}>{t(`status.${intern.status}` as never)}</StatusBadge>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        <InternProfileCard intern={intern} />

        {finalRemark && (
          <Card className="overflow-hidden">
            <div className="h-[4px] bg-gradient-to-r from-wine to-wine-2" aria-hidden />
            <div className="p-5 sm:p-7">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.6px] text-text-3 mb-5">Final Remarks</h2>
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
                {finalRemark.hireRecommended ? "Recommended to Hire" : "Not Recommended"}
              </StatusBadge>
              <span className="text-[12.5px] text-text-3">Reviewed by {finalRemark.supervisorName}</span>
            </div>
            {finalRemark.comments && <p className="mt-4 text-[14px] text-text-2 italic">&ldquo;{finalRemark.comments}&rdquo;</p>}
            </div>
          </Card>
        )}

        <Card className="p-5 sm:p-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[14px] font-medium text-text">{t("hr.detail.certificate")}</p>
            <p className="text-[13px] text-text-2 mt-0.5">
              {certificate
                ? `Certified ${format(new Date(certificate.certifiedAt), "d MMM yyyy")} by ${certificate.certifiedByName}`
                : hasFeedback
                ? "Post-internship feedback received — awaiting HR certification."
                : "Awaiting post-internship feedback from the intern."}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
