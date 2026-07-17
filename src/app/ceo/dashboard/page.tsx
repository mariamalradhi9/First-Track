import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CeoDashboardClient } from "./CeoDashboardClient";

export default async function CeoDashboardPage() {
  const session = await auth();
  const [total, active, completed, certified, departments, finalRemarks, recentCerts] = await Promise.all([
    prisma.intern.count(),
    prisma.intern.count({ where: { status: "ACTIVE" } }),
    prisma.intern.count({ where: { status: "COMPLETED" } }),
    prisma.intern.count({ where: { status: "CERTIFIED" } }),
    prisma.department.count(),
    prisma.finalRemark.findMany({ select: { hireRecommended: true } }),
    prisma.certificate.findMany({
      orderBy: { certifiedAt: "desc" },
      take: 4,
      include: { intern: { include: { user: true, department: true } } },
    }),
  ]);

  const hireRate = finalRemarks.length > 0
    ? Math.round((finalRemarks.filter((r) => r.hireRecommended).length / finalRemarks.length) * 100)
    : 0;

  const activity = recentCerts.map((c) => ({
    id: c.id,
    label: `${c.intern.user?.name ?? "An intern"} certified — ${c.intern.department.nameEn}`,
    date: c.certifiedAt.toISOString(),
  }));

  return (
    <CeoDashboardClient
      name={session!.user.name ?? ""}
      stats={{ total, active, completed, certified, departments, hireRate }}
      activity={activity}
    />
  );
}
