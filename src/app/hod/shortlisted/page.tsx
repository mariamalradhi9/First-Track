import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ShortlistedListClient } from "./ShortlistedListClient";

export default async function HodShortlistedPage() {
  const session = await auth();
  const departmentId = session!.user.departmentId!;

  const applications = await prisma.shortlistApplication.findMany({
    where: { interestedDepartmentId: departmentId, status: "SHORTLISTED" },
    orderBy: { createdAt: "desc" },
  });

  const rows = applications.map((a) => ({
    id: a.id,
    applicantName: a.applicantName,
    sourceDivision: a.sourceDivision,
    status: a.status,
    createdAt: a.createdAt.toISOString(),
  }));

  return <ShortlistedListClient rows={rows} />;
}
