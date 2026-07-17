"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { SkillScore } from "@/components/ui/RatingInput";
import { useToast } from "@/components/ui/Toast";
import { InternProfileCard, type InternProfileData } from "@/components/InternProfileCard";
import BackLink from "@/components/BackLink";
import { useT } from "@/lib/i18n";
import { certifyIntern } from "../../actions";

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

export function CompletedDetailClient({
  intern,
  finalRemark,
  hasFeedback,
  certificate,
}: {
  intern: InternProfileData;
  finalRemark: FinalRemark | null;
  hasFeedback: boolean;
  certificate: Certificate | null;
}) {
  const t = useT();
  const { push } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [certified, setCertified] = useState(certificate);
  const [pending, startTransition] = useTransition();

  function handleCertify() {
    startTransition(async () => {
      await certifyIntern(intern.id);
      setCertified({ certifiedAt: new Date().toISOString(), certifiedByName: "You" });
      setConfirmOpen(false);
      push(`${intern.name} certified successfully.`, "success");
    });
  }

  return (
    <div className="max-w-3xl mx-auto">
      <BackLink />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[24px] sm:text-[28px] font-semibold">{intern.name}</h1>
        <StatusBadge status={certified ? "CERTIFIED" : intern.status}>
          {t(`status.${certified ? "CERTIFIED" : intern.status}` as never)}
        </StatusBadge>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        <InternProfileCard intern={intern} />

        {finalRemark && (
          <Card className="p-5 sm:p-7">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.6px] text-text-3 mb-5">
              {t("hr.detail.feedback")} — Final Remarks
            </h2>
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
          </Card>
        )}

        {!finalRemark && (
          <Card className="p-5 sm:p-7 text-center text-[13.5px] text-text-3">
            Final remarks from the mentor have not been submitted yet.
          </Card>
        )}

        <Card className="p-5 sm:p-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[14px] font-medium text-text">{t("hr.detail.certificate")}</p>
            <p className="text-[13px] text-text-2 mt-0.5">
              {certified
                ? `Certified ${format(new Date(certified.certifiedAt), "d MMM yyyy")} by ${certified.certifiedByName}`
                : hasFeedback
                ? "Post-internship feedback received — ready to certify."
                : "Awaiting post-internship feedback from the intern."}
            </p>
          </div>
          {certified ? (
            <Button type="button" variant="secondary" onClick={() => window.print()}>
              {t("hr.detail.viewCertificate")}
            </Button>
          ) : (
            <Button type="button" disabled={!hasFeedback} onClick={() => setConfirmOpen(true)} className="sm:w-auto">
              {t("common.certify")}
            </Button>
          )}
        </Card>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={t("common.certify")}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button loading={pending} onClick={handleCertify}>
              {t("common.certify")}
            </Button>
          </>
        }
      >
        {t("hr.detail.certifyConfirm")}
      </Modal>
    </div>
  );
}
