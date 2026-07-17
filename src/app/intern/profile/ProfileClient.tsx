"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { useToast } from "@/components/ui/Toast";
import { useT } from "@/lib/i18n";
import { updateProfile } from "../actions";

interface Props {
  name: string;
  department: string;
  mentor: string | null;
  mobile: string | null;
  address: string | null;
  universityName: string | null;
  studentId: string | null;
  gpa: number | null;
}

export function ProfileClient(props: Props) {
  const t = useT();
  const { push } = useToast();
  const [mobile, setMobile] = useState(props.mobile ?? "");
  const [address, setAddress] = useState(props.address ?? "");
  const [universityName, setUniversityName] = useState(props.universityName ?? "");
  const [studentId, setStudentId] = useState(props.studentId ?? "");
  const [gpa, setGpa] = useState(props.gpa?.toString() ?? "");
  const [pending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await updateProfile({ mobile, address, universityName, studentId, gpa: gpa ? Number(gpa) : undefined });
      push("Profile updated.", "success");
    });
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3.5">
        <InitialsAvatar name={props.name} size={44} />
        <h1 className="text-[24px] sm:text-[28px] font-semibold">{props.name}</h1>
      </div>
      <p className="mt-1.5 ms-[59px] text-[14px] text-text-2">{t("intern.profile.lede")}</p>

      <Card className="mt-6 overflow-hidden">
        <div className="h-[4px] bg-gradient-to-r from-wine to-wine-2" aria-hidden />
        <div className="p-5 sm:p-7">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6 pb-6 border-b border-line">
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.6px] text-text-3">{t("common.name")}</dt>
            <dd className="mt-1 text-[14px] text-text">{props.name}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.6px] text-text-3">{t("common.department")}</dt>
            <dd className="mt-1 text-[14px] text-text">{props.department}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.6px] text-text-3">{t("common.mentor")}</dt>
            <dd className="mt-1 text-[14px] text-text">{props.mentor ?? "—"}</dd>
          </div>
        </dl>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label={t("common.mobile")} value={mobile} onChange={(e) => setMobile(e.target.value)} />
          <Input label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <Input label={t("common.university")} value={universityName} onChange={(e) => setUniversityName(e.target.value)} />
          <Input label="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
          <Input label="GPA" type="number" step="0.01" min="0" max="4" value={gpa} onChange={(e) => setGpa(e.target.value)} />
        </div>

        <Button className="mt-6" loading={pending} onClick={handleSave}>
          {t("common.save")}
        </Button>
        </div>
      </Card>
    </div>
  );
}
