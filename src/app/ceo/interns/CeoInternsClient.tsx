"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import clsx from "clsx";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { useT } from "@/lib/i18n";
import { downloadCsv } from "@/lib/csvExport";

interface Row {
  id: string;
  name: string;
  department: string;
  mentor: string;
  projectName: string;
  status: string;
  doj: string | null;
  hireRecommended: boolean | null;
}

const STATUSES = ["REGISTERED", "ACTIVE", "COMPLETED", "CERTIFIED", "DEACTIVATED"];

export function CeoInternsClient({ rows }: { rows: Row[] }) {
  const t = useT();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | null>(searchParams.get("status"));
  const [recommendedOnly, setRecommendedOnly] = useState(searchParams.get("recommended") === "1");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (status && r.status !== status) return false;
      if (recommendedOnly && r.hireRecommended !== true) return false;
      if (!q) return true;
      return r.name.toLowerCase().includes(q) || r.department.toLowerCase().includes(q) || r.projectName.toLowerCase().includes(q);
    });
  }, [rows, query, status, recommendedOnly]);

  function handleExport() {
    downloadCsv(
      `interns-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Name", "Department", "Project", "Mentor", "Status", "Hire Recommended", "Joined"],
      filtered.map((r) => [
        r.name,
        r.department,
        r.projectName,
        r.mentor,
        t(`status.${r.status}` as never),
        r.hireRecommended === null ? "—" : r.hireRecommended ? t("common.hire") : t("common.notHire"),
        r.doj ? format(new Date(r.doj), "d MMM yyyy") : "—",
      ])
    );
  }

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
    { key: "projectName", header: "Project" },
    { key: "mentor", header: "Mentor", hideOnMobile: true },
    { key: "status", header: t("common.status"), render: (r) => <StatusBadge status={r.status}>{t(`status.${r.status}` as never)}</StatusBadge> },
    {
      key: "hireRecommended",
      header: t("ceo.interns.hireRecommended"),
      render: (r) =>
        r.hireRecommended === null ? (
          <span className="text-text-3">—</span>
        ) : (
          <StatusBadge tone={r.hireRecommended ? "approved" : "neutral"}>
            {r.hireRecommended ? t("common.hire") : t("common.notHire")}
          </StatusBadge>
        ),
    },
    { key: "doj", header: "Joined", hideOnMobile: true, render: (r) => (r.doj ? format(new Date(r.doj), "d MMM yyyy") : "—") },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("ceo.interns.title")}</h1>
      <p className="mt-1.5 text-[14px] text-text-2">{t("ceo.interns.lede")}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStatus(null)}
          className={clsx(
            "h-9 px-4 rounded-full text-[12.5px] font-semibold border transition-all duration-200",
            status === null
              ? "bg-wine text-wine-btn-text border-wine shadow-[0_10px_20px_-12px_var(--wine)]"
              : "bg-card text-text-2 border-field-line hover:border-wine hover:text-wine"
          )}
        >
          {t("ceo.interns.filterAll")}
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={clsx(
              "h-9 px-4 rounded-full text-[12.5px] font-semibold border transition-all duration-200",
              status === s
                ? "bg-wine text-wine-btn-text border-wine shadow-[0_10px_20px_-12px_var(--wine)]"
                : "bg-card text-text-2 border-field-line hover:border-wine hover:text-wine"
            )}
          >
            {t(`status.${s}` as never)}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setRecommendedOnly((v) => !v)}
          className={clsx(
            "h-9 px-4 rounded-full text-[12.5px] font-semibold border transition-all duration-200",
            recommendedOnly
              ? "bg-status-approved-fg text-white border-status-approved-fg shadow-[0_10px_20px_-12px_var(--status-approved-fg)]"
              : "bg-card text-text-2 border-field-line hover:border-status-approved-fg hover:text-status-approved-fg"
          )}
        >
          {t("ceo.interns.filterRecommended")}
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="max-w-xs w-full">
          <Input placeholder={t("common.search")} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[12.5px] text-text-3">
            {filtered.length} {t("common.results")}
          </span>
          <Button size="sm" variant="secondary" onClick={handleExport} className="sm:w-auto">
            {t("common.exportCsv")}
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <DataTable columns={columns} rows={filtered} keyField="id" onRowClick={(r) => router.push(`/ceo/interns/${r.id}`)} />
      </div>
    </div>
  );
}
