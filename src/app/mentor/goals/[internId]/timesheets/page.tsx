import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TimesheetsClient } from "./TimesheetsClient";

export default async function TimesheetsPage({ params }: { params: Promise<{ internId: string }> }) {
  const { internId } = await params;
  const intern = await prisma.intern.findUnique({ where: { id: internId }, include: { user: true } });
  if (!intern) notFound();

  const timesheets = await prisma.timesheet.findMany({
    where: { internId },
    include: { task: true },
    orderBy: { date: "desc" },
  });

  const rows = timesheets.map((ts) => ({
    id: ts.id,
    date: ts.date.toISOString(),
    checkIn: ts.checkIn?.toISOString() ?? null,
    checkOut: ts.checkOut?.toISOString() ?? null,
    totalHours: ts.totalHours,
    progressPct: ts.progressPct ?? 0,
    task: ts.task?.name ?? "General",
  }));

  return <TimesheetsClient name={intern.user?.name ?? "Timesheets"} rows={rows} />;
}
