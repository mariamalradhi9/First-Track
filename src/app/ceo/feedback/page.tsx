import { prisma } from "@/lib/prisma";
import { CeoFeedbackClient } from "./CeoFeedbackClient";

export default async function CeoFeedbackPage() {
  const feedback = await prisma.postInternshipFeedback.findMany({
    include: { intern: { include: { user: true, department: true } } },
    orderBy: { submittedAt: "desc" },
  });

  const rows = feedback.map((f) => ({
    id: f.id,
    internId: f.internId,
    name: f.intern.user?.name ?? f.intern.email ?? "—",
    department: f.intern.department.nameEn,
    submittedAt: f.submittedAt.toISOString(),
  }));

  return <CeoFeedbackClient rows={rows} />;
}
