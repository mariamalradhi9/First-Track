import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AdminDashboardClient } from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  const session = await auth();
  const [users, departments, topics, nationalities, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.department.count(),
    prisma.trainingTopic.count(),
    prisma.nationality.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, role: true, createdAt: true },
    }),
  ]);

  const activity = recentUsers.map((u) => ({
    id: u.id,
    label: `${u.name} added as ${u.role.replace(/_/g, " ").toLowerCase()}`,
    date: u.createdAt.toISOString(),
  }));

  return (
    <AdminDashboardClient
      name={session!.user.name ?? ""}
      stats={{ users, departments, topics, nationalities }}
      activity={activity}
    />
  );
}
