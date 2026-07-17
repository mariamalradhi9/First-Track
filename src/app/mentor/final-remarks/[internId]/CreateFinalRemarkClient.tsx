"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Textarea } from "@/components/ui/Textarea";
import { SkillScore } from "@/components/ui/RatingInput";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { useToast } from "@/components/ui/Toast";
import { useT } from "@/lib/i18n";
import BackLink from "@/components/BackLink";
import { createFinalRemark } from "../../actions";

export function CreateFinalRemarkClient({ internId, name }: { internId: string; name: string }) {
  const t = useT();
  const router = useRouter();
  const { push } = useToast();
  const [soft, setSoft] = useState(0);
  const [technical, setTechnical] = useState(0);
  const [hire, setHire] = useState(false);
  const [comments, setComments] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit() {
    if (!soft || !technical) return;
    startTransition(async () => {
      await createFinalRemark(internId, soft, technical, hire, comments);
      push(`Final remarks submitted for ${name}.`, "success");
      router.push("/mentor/final-remarks");
    });
  }

  return (
    <div className="max-w-2xl mx-auto">
      <BackLink />
      <div className="flex items-center gap-3.5">
        <InitialsAvatar name={name} size={44} />
        <h1 className="text-[24px] sm:text-[28px] font-semibold">{name}</h1>
      </div>
      <p className="mt-1 ms-[59px] text-[13.5px] text-text-3">{t("mentor.finalRemarks.create")}</p>

      <Card className="mt-5 overflow-hidden">
        <div className="h-[4px] bg-gradient-to-r from-wine to-wine-2" aria-hidden />
        <div className="p-5 sm:p-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-text-3 mb-2">Soft Skills</p>
            <SkillScore value={soft} onChange={setSoft} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-text-3 mb-2">Technical Skills</p>
            <SkillScore value={technical} onChange={setTechnical} />
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-line">
          <Checkbox label={t("common.hire")} checked={hire} onChange={(e) => setHire(e.target.checked)} />
        </div>

        <div className="mt-5">
          <Textarea label={t("common.comments")} value={comments} onChange={(e) => setComments(e.target.value)} />
        </div>

        <Button className="mt-6" loading={pending} disabled={!soft || !technical} onClick={handleSubmit}>
          {t("common.submit")}
        </Button>
        </div>
      </Card>
    </div>
  );
}
