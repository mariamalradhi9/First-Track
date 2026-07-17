import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { HrDashboardClient } from "./HrDashboardClient";

export default async function HrDashboardPage() {
  const session = await auth();
  const [shortlisted, current, completed, certified, recentApps] = await Promise.all([
    prisma.shortlistApplication.count({ where: { status: "SHORTLISTED" } }),
    prisma.intern.count({ where: { status: "ACTIVE" } }),
    prisma.intern.count({ where: { status: "COMPLETED" } }),
    prisma.intern.count({ where: { status: "CERTIFIED" } }),
    prisma.shortlistApplication.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { interestedDepartment: true },
    }),
  ]);

  const activity = recentApps.map((a) => ({
    id: a.id,
    label: `${a.applicantName} shortlisted for ${a.interestedDepartment.nameEn}`,
    date: a.createdAt.toISOString(),
  }));

  return (
    <HrDashboardClient
      name={session!.user.name ?? ""}
      stats={{ shortlisted, current, completed, certified }}
      activity={activity}
    />
  );
}
