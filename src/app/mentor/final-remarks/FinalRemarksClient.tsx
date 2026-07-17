"use client";

import { useRouter } from "next/navigation";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { useT } from "@/lib/i18n";

interface Row {
  id: string;
  name: string;
  status: string;
  hasRemark: boolean;
}

export function FinalRemarksClient({ rows }: { rows: Row[] }) {
  const t = useT();
  const router = useRouter();

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
    { key: "status", header: t("common.status"), render: (r) => <StatusBadge status={r.status}>{t(`status.${r.status}` as never)}</StatusBadge> },
    {
      key: "actions",
      header: t("common.actions"),
      render: (r) =>
        r.hasRemark ? (
          <StatusBadge tone="approved">{t("hr.completed.reviewSubmitted")}</StatusBadge>
        ) : (
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/mentor/final-remarks/${r.id}`);
            }}
          >
            {t("mentor.finalRemarks.create")}
          </Button>
        ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("mentor.finalRemarks.title")}</h1>
      <p className="mt-1.5 text-[14px] text-text-2">{t("mentor.finalRemarks.lede")}</p>
      <div className="mt-5">
        <DataTable columns={columns} rows={rows} keyField="id" />
      </div>
    </div>
  );
}
