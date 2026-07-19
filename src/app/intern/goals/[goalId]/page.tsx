import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TaskListClient } from "./TaskListClient";

export default async function InternGoalTasksPage({ params }: { params: Promise<{ goalId: string }> }) {
  const { goalId } = await params;
  const session = await auth();

  const intern = await prisma.intern.findUnique({ where: { userId: session!.user.id } });
  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
    include: { tasks: { orderBy: { createdAt: "asc" } } },
  });

  if (!goal || !intern || goal.internId !== intern.id) notFound();

  const tasks = goal.tasks.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    submissionLink: t.submissionLink,
    submissionStatus: t.submissionStatus,
    progressPct: t.progressPct,
    mentorFeedback: t.mentorFeedback,
  }));

  return <TaskListClient goalTitle={goal.title} goalId={goal.id} tasks={tasks} />;
}
