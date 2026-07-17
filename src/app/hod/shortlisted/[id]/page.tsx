import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DecisionClient } from "./DecisionClient";

export default async function HodShortlistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const app = await prisma.shortlistApplication.findUnique({
    where: { id },
    include: { cvFile: true },
  });
  if (!app) notFound();

  return (
    <DecisionClient
      application={{
        id: app.id,
        applicantName: app.applicantName,
        sourceDivision: app.sourceDivision,
        type: app.type,
        status: app.status,
        interviewRemarks: app.interviewRemarks,
        cvUrl: app.cvFile?.storageKey ?? null,
        cvName: app.cvFile?.originalName ?? null,
      }}
    />
  );
}
