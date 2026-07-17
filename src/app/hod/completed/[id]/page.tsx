import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CompletedDetailClient } from "./CompletedDetailClient";

export default async function HodCompletedDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const intern = await prisma.intern.findUnique({
    where: { id },
    include: {
      user: true,
      department: true,
      finalRemark: { include: { supervisor: true } },
      statusHistory: { orderBy: { changedAt: "desc" } },
    },
  });
  if (!intern) notFound();

  const alreadyConfirmed = intern.statusHistory.some((h) => h.notes?.includes("HOD reviewed"));

  return (
    <CompletedDetailClient
      internId={intern.id}
      name={intern.user?.name ?? "—"}
      department={intern.department.nameEn}
      status={intern.status}
      alreadyConfirmed={alreadyConfirmed}
      finalRemark={
        intern.finalRemark
          ? {
              softSkillsScore: intern.finalRemark.softSkillsScore,
              technicalSkillsScore: intern.finalRemark.technicalSkillsScore,
              hireRecommended: intern.finalRemark.hireRecommended,
              comments: intern.finalRemark.comments,
              supervisorName: intern.finalRemark.supervisor.name,
            }
          : null
      }
    />
  );
}
