import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ClosedInternsClient } from "./ClosedInternsClient";

export default async function HodClosedPage() {
  const session = await auth();
  const departmentId = session!.user.departmentId!;

  const interns = await prisma.intern.findMany({
    where: { departmentId, status: "CERTIFIED" },
    include: { user: true, certificate: { include: { certifiedBy: true } } },
    orderBy: { updatedAt: "desc" },
  });

  const rows = interns.map((i) => ({
    id: i.id,
    name: i.user?.name ?? "—",
    certifiedAt: i.certificate?.certifiedAt.toISOString() ?? null,
    certifiedBy: i.certificate?.certifiedBy.name ?? null,
  }));

  return <ClosedInternsClient rows={rows} />;
}
