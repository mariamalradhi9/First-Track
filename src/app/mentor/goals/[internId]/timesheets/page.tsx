import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TimesheetsClient } from "./TimesheetsClient";

export default async function TimesheetsPage({ params }: { params: Promise<{ internId: string }> }) {
  const { internId } = await params;
  const intern = await prisma.intern.findUnique({ where: { id: internId }, include: { user: true } });
  if (!intern) notFound();

  const [timesheets, tasks] = await Promise.all([
    prisma.timesheet.findMany({
      where: { internId },
      include: { task: true },
      orderBy: { date: "desc" },
    }),
    prisma.task.findMany({
      where: { goal: { internId }, submissionStatus: { not: "NOT_SUBMITTED" } },
      include: { goal: true },
      orderBy: { submittedAt: "desc" },
    }),
  ]);

  const rows = timesheets.map((ts) => ({
    id: ts.id,
    date: ts.date.toISOString(),
    checkIn: ts.checkIn?.toISOString() ?? null,
    checkOut: ts.checkOut?.toISOString() ?? null,
    totalHours: ts.totalHours,
    progressPct: ts.progressPct ?? 0,
    task: ts.task?.name ?? "General",
  }));

  const submissions = tasks.map((task) => ({
    id: task.id,
    goalTitle: task.goal.title,
    taskName: task.name,
    submittedAt: task.submittedAt?.toISOString() ?? null,
    reviewedAt: task.reviewedAt?.toISOString() ?? null,
    status: task.submissionStatus,
    progressPct: task.progressPct,
  }));

  return <TimesheetsClient name={intern.user?.name ?? "Timesheets"} rows={rows} submissions={submissions} />;
}
