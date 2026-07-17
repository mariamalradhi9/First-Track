import { prisma } from "@/lib/prisma";
import { CompletedInternsClient } from "./CompletedInternsClient";

export default async function CompletedInternsPage() {
  const interns = await prisma.intern.findMany({
    where: { status: { in: ["COMPLETED", "CERTIFIED"] } },
    include: { department: true, user: true, finalRemark: true },
    orderBy: { updatedAt: "desc" },
  });

  const rows = interns.map((i) => ({
    id: i.id,
    name: i.user?.name ?? "—",
    department: i.department.nameEn,
    status: i.status,
    hasFinalRemark: !!i.finalRemark,
  }));

  return <CompletedInternsClient rows={rows} />;
}
