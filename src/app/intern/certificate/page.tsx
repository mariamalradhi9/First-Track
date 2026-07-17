import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CertificateClient } from "./CertificateClient";

export default async function InternCertificatePage() {
  const session = await auth();
  const intern = await prisma.intern.findUnique({
    where: { userId: session!.user.id },
    include: { certificate: true, postInternshipFeedback: true, department: true, user: true },
  });

  const ready = !!intern?.postInternshipFeedback && !!intern?.certificate;

  return (
    <CertificateClient
      ready={ready}
      name={intern?.user?.name ?? ""}
      department={intern?.department.nameEn ?? ""}
      projectName={intern?.projectName ?? null}
      certifiedAt={intern?.certificate?.certifiedAt?.toISOString() ?? null}
    />
  );
}
