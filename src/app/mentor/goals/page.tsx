import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GoalsClient } from "./GoalsClient";

export default async function MentorGoalsPage() {
  const session = await auth();
  const mentorId = session!.user.id;

  const interns = await prisma.intern.findMany({
    where: { mentorUserId: mentorId, status: "ACTIVE" },
    include: { user: true, goals: { include: { tasks: true } } },
    orderBy: { createdAt: "desc" },
  });

  const rows = interns.map((i) => ({
    id: i.id,
    name: i.user?.name ?? "—",
    projectName: i.projectName,
    goalCount: i.goals.length,
  }));

  return <GoalsClient rows={rows} />;
}
