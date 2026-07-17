import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CompletedDetailClient } from "./CompletedDetailClient";

export default async function CompletedInternDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const intern = await prisma.intern.findUnique({
    where: { id },
    include: {
      department: true,
      mentor: true,
      hod: true,
      user: true,
      nationality: true,
      finalRemark: { include: { supervisor: true } },
      postInternshipFeedback: true,
      certificate: { include: { certifiedBy: true } },
    },
  });
  if (!intern) notFound();

  return (
    <CompletedDetailClient
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
      finalRemark={
        intern.finalRemark
          ? {
              softSkillsScore: intern.finalRemark.softSkillsScore,
              technicalSkillsScore: intern.finalRemark.technicalSkillsScore,
              hireRecommended: intern.finalRemark.hireRecommended,
              comments: intern.finalRemark.comments,
              supervisorName: intern.finalRemark.supervisor.name,
            }
          : null
      }
      hasFeedback={!!intern.postInternshipFeedback}
      certificate={
        intern.certificate
          ? { certifiedAt: intern.certificate.certifiedAt.toISOString(), certifiedByName: intern.certificate.certifiedBy.name }
          : null
      }
    />
  );
}
