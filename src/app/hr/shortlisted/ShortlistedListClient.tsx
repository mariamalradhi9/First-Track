"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import clsx from "clsx";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { useT } from "@/lib/i18n";

interface Row {
  id: string;
  applicantName: string;
  department: string;
  status: string;
  createdAt: string;
}

const TABS = ["ALL", "SHORTLISTED", "HOD_APPROVED", "HOD_REJECTED", "RECOMMENDED_OTHER_DEPT"] as const;
type Tab = (typeof TABS)[number];

export function ShortlistedListClient({ rows }: { rows: Row[] }) {
  const t = useT();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("ALL");

  const counts = useMemo(() => {
    const c: Record<Tab, number> = { ALL: rows.length, SHORTLISTED: 0, HOD_APPROVED: 0, HOD_REJECTED: 0, RECOMMENDED_OTHER_DEPT: 0 };
    for (const r of rows) if (r.status in c) c[r.status as Tab]++;
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesTab = tab === "ALL" || r.status === tab;
      const matchesQuery = !q || r.applicantName.toLowerCase().includes(q) || r.department.toLowerCase().includes(q);
      return matchesTab && matchesQuery;
    });
  }, [rows, query, tab]);

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
    { key: "department", header: t("common.department"), hideOnMobile: true },
    {
      key: "status",
      header: t("common.status"),
      render: (r) => <StatusBadge status={r.status}>{t(`status.${r.status}` as never)}</StatusBadge>,
    },
    {
      key: "createdAt",
      header: t("common.date"),
      hideOnMobile: true,
      render: (r) => format(new Date(r.createdAt), "d MMM yyyy"),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("hr.shortlisted.title")}</h1>
          <p className="mt-1.5 text-[14px] text-text-2">{t("hr.shortlisted.lede")}</p>
        </div>
        <Button onClick={() => router.push("/hr/shortlisted/new")} className="sm:w-auto">
          {t("nav.addShortlisted")}
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((tb) => (
          <button
            key={tb}
            type="button"
            onClick={() => setTab(tb)}
            className={clsx(
              "h-9 px-4 rounded-full text-[12.5px] font-semibold border transition-all duration-200",
              tab === tb
                ? "bg-wine text-wine-btn-text border-wine shadow-[0_10px_20px_-12px_var(--wine)]"
                : "bg-card text-text-2 border-field-line hover:border-wine hover:text-wine"
            )}
          >
            {tb === "ALL" ? t("common.all") : t(`status.${tb}` as never)} · {counts[tb]}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="max-w-xs w-full">
          <Input placeholder={t("common.search")} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <span className="text-[12.5px] text-text-3">
          {filtered.length} {t("common.results")}
        </span>
      </div>

      <div className="mt-4">
        <DataTable columns={columns} rows={filtered} keyField="id" onRowClick={(r) => router.push(`/hr/shortlisted/${r.id}`)} />
      </div>
    </div>
  );
}
