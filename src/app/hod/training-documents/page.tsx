import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TrainingDocsClient } from "./TrainingDocsClient";

export default async function HodTrainingDocsPage() {
  const session = await auth();
  const departmentId = session!.user.departmentId!;

  const resources = await prisma.trainingResource.findMany({
    where: { departmentId },
    include: { file: true, uploadedBy: true },
    orderBy: { createdAt: "desc" },
  });

  const rows = resources.map((r) => ({
    id: r.id,
    title: r.title,
    type: r.type,
    fileUrl: r.file.storageKey,
    fileName: r.file.originalName,
    uploadedBy: r.uploadedBy.name,
    createdAt: r.createdAt.toISOString(),
  }));

  return <TrainingDocsClient rows={rows} />;
}
