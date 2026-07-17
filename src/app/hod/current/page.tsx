import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CurrentInternsClient } from "./CurrentInternsClient";

export default async function HodCurrentPage() {
  const session = await auth();
  const departmentId = session!.user.departmentId!;

  const [interns, mentors] = await Promise.all([
    prisma.intern.findMany({
      where: { departmentId, status: { in: ["REGISTERED", "ACTIVE"] } },
      include: { user: true, mentor: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({ where: { departmentId, role: "MENTOR" }, orderBy: { name: "asc" } }),
  ]);

  const rows = interns.map((i) => ({
    id: i.id,
    userId: i.userId,
    name: i.user?.name ?? i.email ?? "Pending registration",
    projectName: i.projectName,
    mentorId: i.mentorUserId,
    mentor: i.mentor?.name ?? null,
    status: i.status,
  }));

  return <CurrentInternsClient rows={rows} mentors={mentors.map((m) => ({ id: m.id, name: m.name }))} />;
}
