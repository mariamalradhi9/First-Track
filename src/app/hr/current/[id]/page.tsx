import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { InternDetailClient } from "./InternDetailClient";

export default async function CurrentInternDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const intern = await prisma.intern.findUnique({
    where: { id },
    include: { department: true, mentor: true, hod: true, user: true, nationality: true },
  });
  if (!intern) notFound();

  return (
    <InternDetailClient
      intern={{
        id: intern.id,
        name: intern.user?.name ?? "—",
        email: intern.email,
        mobile: intern.mobile,
        address: intern.address,
        universityName: intern.universityName,
        studentId: intern.studentId,
        gpa: intern.gpa,
        major: intern.major,
        yearOfStudy: intern.yearOfStudy,
        nationality: intern.nationality?.nameEn ?? null,
        department: intern.department.nameEn,
        mentor: intern.mentor?.name ?? null,
        hod: intern.hod?.name ?? null,
        projectName: intern.projectName,
        status: intern.status,
        doj: intern.doj?.toISOString() ?? null,
        durationMonths: intern.durationMonths,
      }}
    />
  );
}
