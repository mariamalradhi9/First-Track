import { prisma } from "@/lib/prisma";
import { NationalitiesClient } from "./NationalitiesClient";

export default async function AdminNationalitiesPage() {
  const nationalities = await prisma.nationality.findMany({
    include: { _count: { select: { interns: true } } },
    orderBy: { nameEn: "asc" },
  });

  const rows = nationalities.map((n) => ({
    id: n.id,
    nameEn: n.nameEn,
    nameAr: n.nameAr,
    internCount: n._count.interns,
  }));

  return <NationalitiesClient rows={rows} />;
}
