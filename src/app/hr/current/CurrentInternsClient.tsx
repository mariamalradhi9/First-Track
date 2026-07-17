"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import clsx from "clsx";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Input } from "@/components/ui/Input";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { useT } from "@/lib/i18n";

interface Row {
  id: string;
  name: string;
  department: string;
  mentor: string;
  projectName: string;
  status: string;
  doj: string | null;
}

const TABS = ["ALL", "REGISTERED", "ACTIVE"] as const;
type Tab = (typeof TABS)[number];

export function CurrentInternsClient({ rows }: { rows: Row[] }) {
  const t = useT();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("ALL");

  const counts = useMemo(() => {
    const c: Record<Tab, number> = { ALL: rows.length, REGISTERED: 0, ACTIVE: 0 };
    for (const r of rows) if (r.status in c) c[r.status as Tab]++;
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesTab = tab === "ALL" || r.status === tab;
      const matchesQuery =
        !q || r.name.toLowerCase().includes(q) || r.department.toLowerCase().includes(q) || r.projectName.toLowerCase().includes(q);
      return matchesTab && matchesQuery;
    });
  }, [rows, query, tab]);

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
    {
      key: "projectName",
      header: t("hr.current.project"),
      render: (r) =>
        r.projectName === "—" ? (
          <span className="text-text-3">—</span>
        ) : (
          <span className="inline-flex items-center h-6 px-2.5 rounded-full text-[11.5px] font-medium bg-[#e0f2fe] text-[#0369a1]">{r.projectName}</span>
        ),
    },
    { key: "mentor", header: t("hr.current.mentor"), hideOnMobile: true },
    { key: "status", header: t("common.status"), render: (r) => <StatusBadge status={r.status}>{t(`status.${r.status}` as never)}</StatusBadge> },
    { key: "doj", header: t("hr.current.joined"), hideOnMobile: true, render: (r) => (r.doj ? format(new Date(r.doj), "d MMM yyyy") : "—") },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("hr.current.title")}</h1>
      <p className="mt-1.5 text-[14px] text-text-2">{t("hr.current.lede")}</p>

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
        <DataTable columns={columns} rows={filtered} keyField="id" onRowClick={(r) => router.push(`/hr/current/${r.id}`)} />
      </div>
    </div>
  );
}
