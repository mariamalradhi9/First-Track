"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useT } from "@/lib/i18n";

interface Row {
  id: string;
  title: string;
  goalType: string;
  status: string;
  targetDate: string | null;
  taskCount: number;
}

export function GoalsClient({ rows }: { rows: Row[] }) {
  const t = useT();

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("intern.goals.title")}</h1>
      <p className="mt-1.5 text-[14px] text-text-2">{t("intern.goals.lede")}</p>

      {rows.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No goals assigned yet" message="Your mentor hasn't added any goals for you yet." />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rows.map((g) => (
            <Card key={g.id} className="p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-text-3">{g.goalType}</p>
                  <h3 className="mt-1 text-[16px] font-semibold">{g.title}</h3>
                </div>
                <span className="inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-semibold tracking-[0.4px] whitespace-nowrap bg-status-inprogress-bg text-status-inprogress-fg">
                  {g.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px] text-text-2">
                <span>{g.taskCount} task{g.taskCount === 1 ? "" : "s"}</span>
                {g.targetDate && <span>{format(new Date(g.targetDate), "d MMM yyyy")}</span>}
              </div>
              <div className="mt-1 flex justify-center">
                <Link href={`/intern/goals/${g.id}`}>
                  <Button size="sm" variant="secondary">
                    {t("intern.goals.viewTasks")}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
