import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ShortlistDetailClient } from "./ShortlistDetailClient";

export default async function ShortlistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const app = await prisma.shortlistApplication.findUnique({
    where: { id },
    include: { interestedDepartment: true, cvFile: true, decidedBy: true },
  });
  if (!app) notFound();

  return (
    <ShortlistDetailClient
      application={{
        id: app.id,
        applicantName: app.applicantName,
        sourceDivision: app.sourceDivision,
        department: app.interestedDepartment.nameEn,
        type: app.type,
        status: app.status,
        trainingPeriodStart: app.trainingPeriodStart?.toISOString() ?? null,
        trainingPeriodEnd: app.trainingPeriodEnd?.toISOString() ?? null,
        interviewRemarks: app.interviewRemarks,
        decidedByName: app.decidedBy?.name ?? null,
        cvUrl: app.cvFile?.storageKey ?? null,
        cvName: app.cvFile?.originalName ?? null,
        createdAt: app.createdAt.toISOString(),
      }}
    />
  );
}
