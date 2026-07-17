"use client";

import { format } from "date-fns";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { useT } from "@/lib/i18n";

interface Row {
  id: string;
  title: string;
  type: string;
  fileUrl: string;
  uploadedBy: string;
  createdAt: string;
}

export function InternTrainingDocsClient({ rows }: { rows: Row[] }) {
  const t = useT();

  const columns: Column<Row>[] = [
    {
      key: "title",
      header: "Title",
      render: (r) => (
        <a href={r.fileUrl} target="_blank" rel="noreferrer" className="text-pink hover:opacity-80 font-medium">
          {r.title}
        </a>
      ),
    },
    { key: "type", header: "Type", hideOnMobile: true },
    { key: "uploadedBy", header: "Uploaded By", hideOnMobile: true },
    { key: "createdAt", header: t("common.date"), hideOnMobile: true, render: (r) => format(new Date(r.createdAt), "d MMM yyyy") },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("intern.training.title")}</h1>
      <div className="mt-5">
        <DataTable columns={columns} rows={rows} keyField="id" />
      </div>
    </div>
  );
}
