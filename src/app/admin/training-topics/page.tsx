import { prisma } from "@/lib/prisma";
import { TopicsClient } from "./TopicsClient";

export default async function AdminTrainingTopicsPage() {
  const [topics, departments] = await Promise.all([
    prisma.trainingTopic.findMany({ include: { department: true }, orderBy: { nameEn: "asc" } }),
    prisma.department.findMany({ orderBy: { nameEn: "asc" } }),
  ]);

  const rows = topics.map((tp) => ({
    id: tp.id,
    nameEn: tp.nameEn,
    nameAr: tp.nameAr,
    department: tp.department?.nameEn ?? "All Departments",
  }));

  const deptOptions = departments.map((d) => ({ id: d.id, nameEn: d.nameEn }));

  return <TopicsClient rows={rows} departments={deptOptions} />;
}
