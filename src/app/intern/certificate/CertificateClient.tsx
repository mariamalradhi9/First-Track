"use client";

import { format } from "date-fns";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useT } from "@/lib/i18n";

interface Props {
  ready: boolean;
  name: string;
  department: string;
  projectName: string | null;
  certifiedAt: string | null;
}

export function CertificateClient({ ready, name, department, projectName, certifiedAt }: Props) {
  const t = useT();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("intern.certificate.title")}</h1>

      {!ready ? (
        <div className="mt-6">
          <EmptyState title={t("intern.certificate.notReady")} />
        </div>
      ) : (
        <>
          <p className="mt-1.5 text-[14px] text-status-approved-fg">{t("intern.certificate.ready")}</p>
          <Card className="mt-6 p-10 text-center border-2 border-wine/30">
            <p className="text-[11px] font-semibold uppercase tracking-[2px] text-text-3">Certificate of Completion</p>
            <p className="mt-6 text-[26px] font-semibold text-text">{name}</p>
            <p className="mt-3 text-[14px] text-text-2">
              has successfully completed an internship in the {department} department
              {projectName ? ` on the project "${projectName}"` : ""}.
            </p>
            {certifiedAt && (
              <p className="mt-6 text-[12.5px] text-text-3">Certified on {format(new Date(certifiedAt), "d MMM yyyy")}</p>
            )}
            <Button className="mt-8 sm:w-auto" variant="secondary" onClick={() => window.print()}>
              {t("common.print")}
            </Button>
          </Card>
        </>
      )}
    </div>
  );
}
