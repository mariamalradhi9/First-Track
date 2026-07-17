"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { useToast } from "@/components/ui/Toast";
import { useT } from "@/lib/i18n";
import { acceptUniversityIntern } from "../actions";

interface Row {
  id: string;
  applicantName: string;
  department: string;
  sourceDivision: string | null;
}

export function UniversityInternsClient({ rows: initialRows }: { rows: Row[] }) {
  const t = useT();
  const { push } = useToast();
  const [rows, setRows] = useState(initialRows);
  const [pendingId, startTransition] = useTransition();
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  function handleAccept(id: string, name: string) {
    setAcceptingId(id);
    startTransition(async () => {
      await acceptUniversityIntern(id);
      setRows((r) => r.filter((row) => row.id !== id));
      push(`${name} accepted and moved to shortlist review.`, "success");
      setAcceptingId(null);
    });
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("hr.universityInterns.title")}</h1>
      <p className="mt-1.5 text-[14px] text-text-2">{t("hr.universityInterns.lede")}</p>

      {rows.length === 0 ? (
        <div className="mt-5">
          <EmptyState title="No pending confirmations" message="Universities haven't submitted any new confirmed interns." />
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {rows.map((r) => (
            <Card
              key={r.id}
              className="p-4 sm:p-5 flex flex-wrap items-center gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-20px_rgba(0,0,0,0.5)]"
            >
              <InitialsAvatar name={r.applicantName} size={40} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-text truncate">{r.applicantName}</p>
                <p className="text-[12.5px] text-text-3 mt-0.5">
                  {r.department}
                  {r.sourceDivision && ` · ${r.sourceDivision}`}
                </p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                loading={pendingId && acceptingId === r.id}
                onClick={() => handleAccept(r.id, r.applicantName)}
                className="sm:w-auto"
              >
                {t("common.accept")}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
