import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GoalsClient } from "./GoalsClient";

export default async function InternGoalsPage() {
  const session = await auth();
  const intern = await prisma.intern.findUnique({
    where: { userId: session!.user.id },
    include: { goals: { include: { tasks: true }, orderBy: { createdAt: "desc" } } },
  });

  const rows = (intern?.goals ?? []).map((g) => ({
    id: g.id,
    title: g.title,
    goalType: g.goalType,
    status: g.status,
    targetDate: g.targetDate?.toISOString() ?? null,
    taskCount: g.tasks.length,
  }));

  return <GoalsClient rows={rows} />;
}
