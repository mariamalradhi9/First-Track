"use client";

import { useRouter } from "next/navigation";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { useT } from "@/lib/i18n";

interface Row {
  id: string;
  name: string;
  hasFinalRemark: boolean;
  status: string;
}

export function CompletedListClient({ rows }: { rows: Row[] }) {
  const t = useT();
  const router = useRouter();

  const columns: Column<Row>[] = [
    {
      key: "name",
      header: t("common.name"),
      render: (r) => (
        <span className="inline-flex items-center gap-3">
          <InitialsAvatar name={r.name} size={30} />
          <span className="font-medium text-text group-hover:text-wine group-hover:underline underline-offset-2 transition-colors">{r.name}</span>
        </span>
      ),
    },
    { key: "status", header: t("common.status"), render: (r) => <StatusBadge status={r.status}>{t(`status.${r.status}` as never)}</StatusBadge> },
    {
      key: "hasFinalRemark",
      header: t("hr.completed.review"),
      render: (r) => (
        <StatusBadge tone={r.hasFinalRemark ? "approved" : "neutral"}>
          {r.hasFinalRemark ? t("hr.completed.reviewSubmitted") : t("hr.completed.reviewPending")}
        </StatusBadge>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("hod.completed.title")}</h1>
      <p className="mt-1.5 text-[14px] text-text-2">{t("hod.completed.lede")}</p>
      <div className="mt-5">
        <DataTable columns={columns} rows={rows} keyField="id" onRowClick={(r) => router.push(`/hod/completed/${r.id}`)} />
      </div>
    </div>
  );
}
