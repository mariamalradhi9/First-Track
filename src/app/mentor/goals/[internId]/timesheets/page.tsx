import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TimesheetsClient } from "./TimesheetsClient";

export default async function TimesheetsPage({ params }: { params: Promise<{ internId: string }> }) {
  const { internId } = await params;
  const intern = await prisma.intern.findUnique({ where: { id: internId }, include: { user: true } });
  if (!intern) notFound();

  const reviews = await prisma.taskReview.findMany({
    where: { task: { goal: { internId } } },
    include: { task: { include: { goal: true } } },
    orderBy: { submittedAt: "desc" },
  });

  const submissions = reviews.map((r) => ({
    id: r.id,
    goalTitle: r.task.goal.title,
    taskName: r.task.name,
    submittedAt: r.submittedAt.toISOString(),
    reviewedAt: r.reviewedAt?.toISOString() ?? null,
    status: r.status,
    progressAdded: r.progressAdded,
    progressTotal: r.progressTotal,
  }));

  return <TimesheetsClient name={intern.user?.name ?? "Submissions"} submissions={submissions} />;
}
