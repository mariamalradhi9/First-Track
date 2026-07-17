import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MentorDashboardClient } from "./MentorDashboardClient";

export default async function MentorDashboardPage() {
  const session = await auth();
  const mentorId = session!.user.id;

  const [active, goals, reviews, recentGoals] = await Promise.all([
    prisma.intern.count({ where: { mentorUserId: mentorId, status: "ACTIVE" } }),
    prisma.goal.count({ where: { intern: { mentorUserId: mentorId }, status: "OPEN" } }),
    prisma.biweeklyReview.count({ where: { supervisorId: mentorId } }),
    prisma.goal.findMany({
      where: { intern: { mentorUserId: mentorId } },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { intern: { include: { user: true } } },
    }),
  ]);

  const activity = recentGoals.map((g) => ({
    id: g.id,
    label: `Goal "${g.title}" assigned to ${g.intern.user?.name ?? "an intern"}`,
    date: g.createdAt.toISOString(),
  }));

  return (
    <MentorDashboardClient
      name={session!.user.name ?? ""}
      stats={{ active, goals, reviews }}
      activity={activity}
    />
  );
}
