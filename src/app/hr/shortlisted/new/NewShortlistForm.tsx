"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import type { Department } from "@prisma/client";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FileUpload } from "@/components/ui/FileUpload";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useT, type DictKey } from "@/lib/i18n";
import { createShortlistApplication } from "../../actions";

function SubmitButton() {
  const t = useT();
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} className="mt-2 px-14">
      {pending ? t("common.loading") : t("common.submit")}
    </Button>
  );
}

function CvFileUpload({ cv, setCv, t }: { cv: File | null; setCv: (f: File | null) => void; t: (key: DictKey) => string }) {
  const { pending } = useFormStatus();
  return (
    <FileUpload
      name="cv"
      label={t("hr.field.cv")}
      hint={t("hr.field.dropCv")}
      accept=".pdf,.doc,.docx"
      file={cv}
      onChange={setCv}
      uploading={pending}
    />
  );
}

export function NewShortlistForm({ departments }: { departments: Department[] }) {
  const t = useT();
  const [cv, setCv] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("hr.addShortlisted.title")}</h1>
      <p className="mt-1.5 text-[14px] text-text-2">{t("hr.addShortlisted.lede")}</p>

      <Card className="mt-6 overflow-hidden">
        <div className="h-[5px] bg-gradient-to-r from-wine to-wine-2" aria-hidden />
        <form
          className="p-5 sm:p-7"
          action={async (formData) => {
            setError(null);
            try {
              await createShortlistApplication(formData);
            } catch (e) {
              // Next.js redirect() throws internally with a digest starting "NEXT_REDIRECT" —
              // rethrow that so navigation still happens; anything else is a real error.
              const digest = (e as { digest?: string })?.digest;
              if (digest?.startsWith("NEXT_REDIRECT")) throw e;
              setError(e instanceof Error ? e.message : "Something went wrong.");
            }
          }}
        >
          <SectionHeading icon="profile" className="mb-4">
            {t("hr.addShortlisted.sectionApplicant")}
          </SectionHeading>
          <Input label={t("hr.field.applicantName")} name="applicantName" required />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Input label={t("hr.field.sourceDivision")} name="sourceDivision" />
            <Select label={t("common.department")} name="departmentId" required defaultValue="">
              <option value="" disabled>
                {t("common.department")}
              </option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nameEn}
                </option>
              ))}
            </Select>
          </div>

          <SectionHeading icon="calendar" className="mb-4 mt-7 pt-6 border-t border-line">
            {t("hr.addShortlisted.sectionTraining")}
          </SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select label={t("hr.field.type")} name="type" defaultValue="OFFLINE">
              <option value="OFFLINE">Offline</option>
              <option value="ONLINE">Online</option>
            </Select>
            <Input label={t("hr.field.periodStart")} name="periodStart" type="date" />
            <Input label={t("hr.field.periodEnd")} name="periodEnd" type="date" />
          </div>

          <SectionHeading icon="folder" className="mb-4 mt-7 pt-6 border-t border-line">
            {t("hr.addShortlisted.sectionDocuments")}
          </SectionHeading>
          <CvFileUpload cv={cv} setCv={setCv} t={t} />

          {error && <p className="mt-3 text-[13px] text-status-rejected-fg">{error}</p>}

          <div className="mt-7 pt-6 border-t border-line flex justify-center">
            <SubmitButton />
          </div>
        </form>
      </Card>
    </div>
  );
}
