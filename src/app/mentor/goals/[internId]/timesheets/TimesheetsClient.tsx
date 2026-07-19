"use client";

import { format } from "date-fns";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
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

interface Submission {
  id: string;
  goalTitle: string;
  taskName: string;
  submittedAt: string | null;
  reviewedAt: string | null;
  status: string;
  progressPct: number;
}

export function TimesheetsClient({ name, rows, submissions }: { name: string; rows: Row[]; submissions: Submission[] }) {
  const columns: Column<Row>[] = [
    { key: "date", header: "Date", render: (r) => format(new Date(r.date), "d MMM yyyy") },
    { key: "task", header: "Task" },
    { key: "checkIn", header: "Check In", hideOnMobile: true, render: (r) => (r.checkIn ? format(new Date(r.checkIn), "HH:mm") : "—") },
    { key: "checkOut", header: "Check Out", hideOnMobile: true, render: (r) => (r.checkOut ? format(new Date(r.checkOut), "HH:mm") : "—") },
    { key: "totalHours", header: "Hours", render: (r) => (r.totalHours != null ? `${r.totalHours}h` : "—") },
    { key: "progressPct", header: "Progress", render: (r) => <ProgressBar value={r.progressPct} showLabel className="w-32" /> },
  ];

  const submissionColumns: Column<Submission>[] = [
    { key: "goalTitle", header: "Goal" },
    { key: "taskName", header: "Task" },
    { key: "submittedAt", header: "Submitted", render: (r) => (r.submittedAt ? format(new Date(r.submittedAt), "d MMM yyyy, HH:mm") : "—") },
    { key: "reviewedAt", header: "Reviewed", render: (r) => (r.reviewedAt ? format(new Date(r.reviewedAt), "d MMM yyyy, HH:mm") : "—") },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status}>{r.status.replace("_", " ")}</StatusBadge> },
    { key: "progressPct", header: "Progress", render: (r) => <ProgressBar value={r.progressPct} showLabel className="w-32" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <BackLink />
      <div className="flex items-center gap-3.5">
        <InitialsAvatar name={name} size={44} />
        <h1 className="text-[24px] sm:text-[28px] font-semibold">{name}</h1>
      </div>

      <p className="mt-6 ms-1 text-[13px] font-semibold uppercase tracking-[0.6px] text-text-3">Task Submissions</p>
      <div className="mt-2">
        <DataTable columns={submissionColumns} rows={submissions} keyField="id" emptyTitle="No task submissions yet" />
      </div>

      <p className="mt-6 ms-1 text-[13px] font-semibold uppercase tracking-[0.6px] text-text-3">Submitted Timesheets</p>
      <div className="mt-2">
        <DataTable columns={columns} rows={rows} keyField="id" emptyTitle="No timesheets yet" />
      </div>
    </div>
  );
}
