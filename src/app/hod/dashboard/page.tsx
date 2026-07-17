import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { HodDashboardClient } from "./HodDashboardClient";

export default async function HodDashboardPage() {
  const session = await auth();
  const departmentId = session!.user.departmentId!;

  const [pending, current, completed, certified, docs, male, female, mentors, reviews, recentHistory] = await Promise.all([
    prisma.shortlistApplication.count({ where: { status: "SHORTLISTED", interestedDepartmentId: departmentId } }),
    prisma.intern.count({ where: { status: "ACTIVE", departmentId } }),
    prisma.intern.count({ where: { status: "COMPLETED", departmentId } }),
    prisma.intern.count({ where: { status: "CERTIFIED", departmentId } }),
    prisma.trainingResource.count({ where: { departmentId } }),
    prisma.intern.count({ where: { departmentId, gender: "MALE", status: { not: "DEACTIVATED" } } }),
    prisma.intern.count({ where: { departmentId, gender: "FEMALE", status: { not: "DEACTIVATED" } } }),
    prisma.user.findMany({
      where: { role: "MENTOR", departmentId },
      select: {
        id: true,
        name: true,
        mentoredInterns: { where: { departmentId }, select: { status: true } },
      },
    }),
    prisma.biweeklyReview.findMany({
      where: { intern: { departmentId } },
      select: { internId: true, consolidatedRating: true },
    }),
    prisma.internStatusHistory.findMany({
      where: { intern: { departmentId } },
      orderBy: { changedAt: "desc" },
      take: 4,
      include: { intern: { include: { user: true } } },
    }),
  ]);

  const activity = recentHistory.map((h) => ({
    id: h.id,
    label: `${h.intern.user?.name ?? "An intern"} — ${h.notes ?? `status changed to ${h.toStatus}`}`,
    date: h.changedAt.toISOString(),
  }));

  const byMentor = mentors.map((m) => ({
    id: m.id,
    name: m.name,
    active: m.mentoredInterns.filter((i) => i.status === "ACTIVE").length,
    completed: m.mentoredInterns.filter((i) => i.status === "COMPLETED" || i.status === "CERTIFIED").length,
  }));

  const avgByIntern = new Map<string, number[]>();
  for (const r of reviews) {
    if (r.consolidatedRating == null) continue;
    const arr = avgByIntern.get(r.internId) ?? [];
    arr.push(r.consolidatedRating);
    avgByIntern.set(r.internId, arr);
  }
  let highReview = 0;
  for (const ratings of avgByIntern.values()) {
    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    if (avg >= 4) highReview++;
  }

  return (
    <HodDashboardClient
      name={session!.user.name ?? ""}
      stats={{ pending, current, completed, certified, docs, male, female, highReview }}
      byMentor={byMentor}
      activity={activity}
    />
  );
}
