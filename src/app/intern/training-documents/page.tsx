import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { InternTrainingDocsClient } from "./InternTrainingDocsClient";

export default async function InternTrainingDocsPage() {
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
    uploadedBy: r.uploadedBy.name,
    createdAt: r.createdAt.toISOString(),
  }));

  return <InternTrainingDocsClient rows={rows} />;
}
