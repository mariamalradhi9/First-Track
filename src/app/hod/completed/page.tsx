import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CompletedListClient } from "./CompletedListClient";

export default async function HodCompletedPage() {
  const session = await auth();
  const departmentId = session!.user.departmentId!;

  const interns = await prisma.intern.findMany({
    where: { departmentId, status: "COMPLETED" },
    include: { user: true, finalRemark: true },
    orderBy: { updatedAt: "desc" },
  });

  const rows = interns.map((i) => ({
    id: i.id,
    name: i.user?.name ?? "—",
    hasFinalRemark: !!i.finalRemark,
    status: i.status,
  }));

  return <CompletedListClient rows={rows} />;
}
