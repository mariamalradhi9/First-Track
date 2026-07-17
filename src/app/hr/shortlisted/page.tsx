import { prisma } from "@/lib/prisma";
import { ShortlistedListClient } from "./ShortlistedListClient";

export default async function ShortlistedListPage() {
  const applications = await prisma.shortlistApplication.findMany({
    // Once an application has an associated Intern record, the candidate has
    // progressed past "shortlisted" into the registration pipeline — they
    // belong in Current/Completed views instead, not here.
    where: { status: { not: "UNIVERSITY_CONFIRMED" }, intern: null },
    include: { interestedDepartment: true },
    orderBy: { createdAt: "desc" },
  });

  const rows = applications.map((a) => ({
    id: a.id,
    applicantName: a.applicantName,
    department: a.interestedDepartment.nameEn,
    status: a.status,
    createdAt: a.createdAt.toISOString(),
  }));

  return <ShortlistedListClient rows={rows} />;
}
