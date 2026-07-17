"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { useT } from "@/lib/i18n";

interface Row {
  id: string;
  internId: string;
  name: string;
  department: string;
  submittedAt: string;
}

export function CeoFeedbackClient({ rows }: { rows: Row[] }) {
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
    { key: "department", header: t("common.department"), hideOnMobile: true },
    { key: "submittedAt", header: t("common.date"), render: (r) => format(new Date(r.submittedAt), "d MMM yyyy") },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("ceo.feedback.title")}</h1>
      <p className="mt-1.5 text-[14px] text-text-2">{t("ceo.feedback.lede")}</p>

      {rows.length === 0 ? (
        <div className="mt-6">
          <EmptyState title={t("ceo.feedback.empty")} />
        </div>
      ) : (
        <div className="mt-5">
          <DataTable columns={columns} rows={rows} keyField="id" onRowClick={(r) => router.push(`/ceo/feedback/${r.id}`)} />
        </div>
      )}
    </div>
  );
}
