"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { useT } from "@/lib/i18n";

interface Row {
  id: string;
  applicantName: string;
  sourceDivision: string | null;
  status: string;
  createdAt: string;
}

export function ShortlistedListClient({ rows }: { rows: Row[] }) {
  const t = useT();
  const router = useRouter();

  const columns: Column<Row>[] = [
    {
      key: "applicantName",
      header: t("common.name"),
      render: (r) => (
        <span className="inline-flex items-center gap-3">
          <InitialsAvatar name={r.applicantName} size={30} />
          <span className="font-medium text-text group-hover:text-wine group-hover:underline underline-offset-2 transition-colors">{r.applicantName}</span>
        </span>
      ),
    },
    { key: "sourceDivision", header: t("hr.field.sourceDivision"), hideOnMobile: true, render: (r) => r.sourceDivision ?? "—" },
    { key: "status", header: t("common.status"), render: (r) => <StatusBadge status={r.status}>{t(`status.${r.status}` as never)}</StatusBadge> },
    { key: "createdAt", header: t("common.date"), hideOnMobile: true, render: (r) => format(new Date(r.createdAt), "d MMM yyyy") },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("hod.shortlisted.title")}</h1>
          <p className="mt-1.5 text-[14px] text-text-2">{t("hod.shortlisted.lede")}</p>
        </div>
        <span className="text-[12.5px] text-text-3">
          {rows.length} {t("common.results")}
        </span>
      </div>
      <div className="mt-5">
        <DataTable columns={columns} rows={rows} keyField="id" onRowClick={(r) => router.push(`/hod/shortlisted/${r.id}`)} />
      </div>
    </div>
  );
}
