"use client";

import { format } from "date-fns";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { useT } from "@/lib/i18n";

interface Row {
  id: string;
  name: string;
  certifiedAt: string | null;
  certifiedBy: string | null;
}

export function ClosedInternsClient({ rows }: { rows: Row[] }) {
  const t = useT();

  const columns: Column<Row>[] = [
    {
      key: "name",
      header: t("common.name"),
      render: (r) => (
        <span className="inline-flex items-center gap-3">
          <InitialsAvatar name={r.name} size={30} />
          <span className="font-medium text-text">{r.name}</span>
        </span>
      ),
    },
    { key: "certifiedAt", header: "Certified On", render: (r) => (r.certifiedAt ? format(new Date(r.certifiedAt), "d MMM yyyy") : "—") },
    { key: "certifiedBy", header: "Certified By", hideOnMobile: true, render: (r) => r.certifiedBy ?? "—" },
    { key: "status", header: t("common.status"), render: () => <StatusBadge status="CERTIFIED">{t("status.CERTIFIED")}</StatusBadge> },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("hod.closed.title")}</h1>
      <p className="mt-1.5 text-[14px] text-text-2">{t("hod.closed.lede")}</p>
      <div className="mt-5">
        <DataTable columns={columns} rows={rows} keyField="id" />
      </div>
    </div>
  );
}
