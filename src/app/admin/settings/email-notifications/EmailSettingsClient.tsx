"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useToast } from "@/components/ui/Toast";
import { useT } from "@/lib/i18n";
import { toggleEmailSetting } from "../../actions";

interface Row {
  eventKey: string;
  label: string;
  isEnabled: boolean;
}

export function EmailSettingsClient({ rows: initialRows }: { rows: Row[] }) {
  const t = useT();
  const { push } = useToast();
  const [rows, setRows] = useState(initialRows);
  const [, startTransition] = useTransition();

  function handleToggle(row: Row) {
    const next = !row.isEnabled;
    setRows((rs) => rs.map((r) => (r.eventKey === row.eventKey ? { ...r, isEnabled: next } : r)));
    startTransition(async () => {
      await toggleEmailSetting(row.eventKey, next);
      push(`${row.label} ${next ? "enabled" : "disabled"}.`, "info");
    });
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("admin.email.title")}</h1>
      <p className="mt-1.5 text-[14px] text-text-2">{t("admin.email.lede")}</p>

      <Card className="mt-6 overflow-hidden">
        <div className="h-[4px] bg-gradient-to-r from-wine to-wine-2" aria-hidden />
        <div className="p-5 sm:p-7">
          <SectionHeading icon="bell" className="mb-4">
            {t("admin.email.eventsSection")}
          </SectionHeading>
          <div className="flex flex-col divide-y divide-line">
            {rows.map((r) => (
              <div key={r.eventKey} className="py-3.5 flex items-center justify-between gap-4">
                <span className="text-[14px] text-text">{r.label}</span>
                <Checkbox checked={r.isEnabled} onChange={() => handleToggle(r)} />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
