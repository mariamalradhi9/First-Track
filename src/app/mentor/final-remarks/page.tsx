import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { FinalRemarksClient } from "./FinalRemarksClient";

export default async function FinalRemarksListPage() {
  const session = await auth();
  const mentorId = session!.user.id;

  const interns = await prisma.intern.findMany({
    where: { mentorUserId: mentorId, status: { in: ["ACTIVE", "COMPLETED"] } },
    include: { user: true, finalRemark: true },
    orderBy: { createdAt: "desc" },
  });

  const rows = interns.map((i) => ({
    id: i.id,
    name: i.user?.name ?? "—",
    status: i.status,
    hasRemark: !!i.finalRemark,
  }));

  return <FinalRemarksClient rows={rows} />;
}
