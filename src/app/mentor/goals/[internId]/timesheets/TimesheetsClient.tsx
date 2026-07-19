"use client";

import { format } from "date-fns";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import BackLink from "@/components/BackLink";

interface Submission {
  id: string;
  goalTitle: string;
  taskName: string;
  submittedAt: string;
  reviewedAt: string | null;
  status: string;
  progressAdded: number | null;
  progressTotal: number | null;
}

export function TimesheetsClient({ name, submissions }: { name: string; submissions: Submission[] }) {
  const submissionColumns: Column<Submission>[] = [
    { key: "goalTitle", header: "Goal" },
    { key: "taskName", header: "Task" },
    { key: "submittedAt", header: "Submitted", render: (r) => format(new Date(r.submittedAt), "d MMM yyyy, HH:mm") },
    { key: "reviewedAt", header: "Reviewed", render: (r) => (r.reviewedAt ? format(new Date(r.reviewedAt), "d MMM yyyy, HH:mm") : "—") },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status}>{r.status.replace("_", " ")}</StatusBadge> },
    {
      key: "progressTotal",
      header: "Progress",
      render: (r) =>
        r.progressTotal != null ? (
          <span className="inline-flex items-center gap-2">
            <ProgressBar value={r.progressTotal} showLabel className="w-32" />
            {r.progressAdded != null && <span className="text-[11.5px] text-text-3">(+{r.progressAdded})</span>}
          </span>
        ) : (
          <span className="text-text-3">—</span>
        ),
    },
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
    </div>
  );
}
