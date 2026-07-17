import { prisma } from "@/lib/prisma";
import { UniversityInternsClient } from "./UniversityInternsClient";

export default async function UniversityInternsPage() {
  const applications = await prisma.shortlistApplication.findMany({
    where: { status: "UNIVERSITY_CONFIRMED" },
    include: { interestedDepartment: true },
    orderBy: { createdAt: "desc" },
  });

  const rows = applications.map((a) => ({
    id: a.id,
    applicantName: a.applicantName,
    department: a.interestedDepartment.nameEn,
    sourceDivision: a.sourceDivision,
  }));

  return <UniversityInternsClient rows={rows} />;
}
