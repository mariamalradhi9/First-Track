import { prisma } from "@/lib/prisma";
import { CeoInternsClient } from "./CeoInternsClient";

export default async function CeoInternsPage() {
  const interns = await prisma.intern.findMany({
    include: { department: true, mentor: true, user: true, finalRemark: true },
    orderBy: { createdAt: "desc" },
  });

  const rows = interns.map((i) => ({
    id: i.id,
    name: i.user?.name ?? i.email ?? "—",
    department: i.department.nameEn,
    mentor: i.mentor?.name ?? "Unassigned",
    projectName: i.projectName ?? "—",
    status: i.status,
    doj: i.doj?.toISOString() ?? null,
    hireRecommended: i.finalRemark?.hireRecommended ?? null,
  }));

  return <CeoInternsClient rows={rows} />;
}
