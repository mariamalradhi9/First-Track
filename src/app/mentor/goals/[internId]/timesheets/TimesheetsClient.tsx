"use client";

import { format } from "date-fns";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import BackLink from "@/components/BackLink";

interface Row {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  totalHours: number | null;
  progressPct: number;
  task: string;
}

export function TimesheetsClient({ name, rows }: { name: string; rows: Row[] }) {
  const columns: Column<Row>[] = [
    { key: "date", header: "Date", render: (r) => format(new Date(r.date), "d MMM yyyy") },
    { key: "task", header: "Task" },
    { key: "checkIn", header: "Check In", hideOnMobile: true, render: (r) => (r.checkIn ? format(new Date(r.checkIn), "HH:mm") : "—") },
    { key: "checkOut", header: "Check Out", hideOnMobile: true, render: (r) => (r.checkOut ? format(new Date(r.checkOut), "HH:mm") : "—") },
    { key: "totalHours", header: "Hours", render: (r) => (r.totalHours != null ? `${r.totalHours}h` : "—") },
    { key: "progressPct", header: "Progress", render: (r) => <ProgressBar value={r.progressPct} showLabel className="w-32" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <BackLink />
      <div className="flex items-center gap-3.5">
        <InitialsAvatar name={name} size={44} />
        <h1 className="text-[24px] sm:text-[28px] font-semibold">{name}</h1>
      </div>
      <p className="mt-1 ms-[59px] text-[13.5px] text-text-3">Submitted timesheets</p>
      <div className="mt-5">
        <DataTable columns={columns} rows={rows} keyField="id" emptyTitle="No timesheets yet" />
      </div>
    </div>
  );
}
