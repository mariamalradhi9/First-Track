import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileClient } from "./ProfileClient";

export default async function ProfilePage() {
  const session = await auth();
  const intern = await prisma.intern.findUnique({
    where: { userId: session!.user.id },
    include: { department: true, mentor: true, user: true },
  });

  if (!intern) {
    return <div className="text-[14px] text-text-2">No intern profile is linked to this account yet.</div>;
  }

  return (
    <ProfileClient
      name={intern.user?.name ?? ""}
      department={intern.department.nameEn}
      mentor={intern.mentor?.name ?? null}
      mobile={intern.mobile}
      address={intern.address}
      universityName={intern.universityName}
      studentId={intern.studentId}
      gpa={intern.gpa}
      dob={intern.dob?.toISOString().slice(0, 10) ?? null}
      doj={intern.doj?.toISOString().slice(0, 10) ?? null}
      dojRemarks={intern.dojRemarks}
    />
  );
}
