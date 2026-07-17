import { prisma } from "@/lib/prisma";
import { CurrentInternsClient } from "./CurrentInternsClient";

export default async function CurrentInternsPage() {
  const interns = await prisma.intern.findMany({
    where: { status: { in: ["REGISTERED", "ACTIVE"] } },
    include: { department: true, mentor: true, user: true },
    orderBy: { doj: "desc" },
  });

  const rows = interns.map((i) => ({
    id: i.id,
    name: i.user?.name ?? i.email ?? "—",
    department: i.department.nameEn,
    mentor: i.mentor?.name ?? "Unassigned",
    projectName: i.projectName ?? "—",
    status: i.status,
    doj: i.doj?.toISOString() ?? null,
  }));

  return <CurrentInternsClient rows={rows} />;
}
