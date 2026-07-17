import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GoalDetailClient } from "./GoalDetailClient";

export default async function MentorGoalDetailPage({ params }: { params: Promise<{ internId: string }> }) {
  const { internId } = await params;
  const session = await auth();

  const intern = await prisma.intern.findUnique({
    where: { id: internId },
    include: {
      user: true,
      goals: {
        include: { tasks: { orderBy: { createdAt: "asc" } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!intern || intern.mentorUserId !== session!.user.id) notFound();

  const goals = intern.goals.map((g) => ({
    id: g.id,
    title: g.title,
    goalType: g.goalType,
    status: g.status,
    tasks: g.tasks.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      startDate: t.startDate?.toISOString() ?? null,
      endDate: t.endDate?.toISOString() ?? null,
    })),
  }));

  return <GoalDetailClient internName={intern.user?.name ?? "—"} goals={goals} />;
}
