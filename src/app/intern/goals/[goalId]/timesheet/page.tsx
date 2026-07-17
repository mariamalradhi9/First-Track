import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TimesheetFormClient } from "./TimesheetFormClient";

export default async function InternTimesheetPage({ params }: { params: Promise<{ goalId: string }> }) {
  const { goalId } = await params;
  const session = await auth();

  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
    include: { tasks: true, intern: true },
  });

  if (!goal || goal.intern.userId !== session!.user.id) notFound();

  const tasks = goal.tasks.map((t) => ({ id: t.id, name: t.name }));

  return <TimesheetFormClient goalId={goal.id} goalTitle={goal.title} tasks={tasks} />;
}
