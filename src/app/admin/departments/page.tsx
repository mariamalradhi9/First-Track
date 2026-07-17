import { prisma } from "@/lib/prisma";
import { DepartmentsClient } from "./DepartmentsClient";

export default async function AdminDepartmentsPage() {
  const departments = await prisma.department.findMany({
    include: { hod: true, _count: { select: { interns: true } } },
    orderBy: { nameEn: "asc" },
  });

  const rows = departments.map((d) => ({
    id: d.id,
    nameEn: d.nameEn,
    nameAr: d.nameAr,
    hod: d.hod?.name ?? "—",
    internCount: d._count.interns,
  }));

  return <DepartmentsClient rows={rows} />;
}
