"use server";

import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus, InternStatus, ResourceType, NotificationChannel, Role } from "@prisma/client";

const INTERN_DEFAULT_PASSWORD = "Passw0rd!";

async function generateInternCprId(): Promise<string> {
  for (let i = 0; i < 30; i++) {
    const candidate = `9005${Math.floor(100 + Math.random() * 900)}`;
    const exists = await prisma.user.findUnique({ where: { cprId: candidate } });
    if (!exists) return candidate;
  }
  throw new Error("Could not generate a unique CPR ID — please try again.");
}

async function requireHod() {
  const session = await auth();
  if (!session?.user || session.user.role !== "HOD") throw new Error("Unauthorized");
  if (!session.user.departmentId) throw new Error("No department assigned to this account.");
  return session.user;
}

export async function decideShortlistApplication(
  applicationId: string,
  decision: "APPROVE" | "REJECT" | "RECOMMEND",
  remarks: string
) {
  const user = await requireHod();

  const statusMap: Record<typeof decision, ApplicationStatus> = {
    APPROVE: ApplicationStatus.HOD_APPROVED,
    REJECT: ApplicationStatus.HOD_REJECTED,
    RECOMMEND: ApplicationStatus.RECOMMENDED_OTHER_DEPT,
  };

  const app = await prisma.shortlistApplication.update({
    where: { id: applicationId },
    data: {
      status: statusMap[decision],
      interviewRemarks: remarks || null,
      decidedBy: { connect: { id: user.id } },
      decidedAt: new Date(),
    },
  });

  // On approval, the candidate enters the registration pipeline as an Intern record
  // and gets a login account created for them right away.
  let credentials: { cprId: string; password: string } | null = null;
  if (decision === "APPROVE") {
    const existing = await prisma.intern.findUnique({ where: { applicationId } });
    if (!existing) {
      const cprId = await generateInternCprId();
      const passwordHash = await bcrypt.hash(INTERN_DEFAULT_PASSWORD, 10);
      const loginUser = await prisma.user.create({
        data: {
          cprId,
          name: app.applicantName,
          passwordHash,
          role: Role.INTERN,
          department: { connect: { id: user.departmentId! } },
        },
      });

      await prisma.intern.create({
        data: {
          application: { connect: { id: app.id } },
          department: { connect: { id: user.departmentId! } },
          hod: { connect: { id: user.id } },
          user: { connect: { id: loginUser.id } },
          status: InternStatus.REGISTERED,
        },
      });

      credentials = { cprId, password: INTERN_DEFAULT_PASSWORD };
    }
  }

  revalidatePath("/hod/shortlisted");
  revalidatePath("/hod/dashboard");
  revalidatePath(`/hod/shortlisted/${applicationId}`);

  return credentials;
}

export async function assignProjectMentor(internId: string, mentorUserId: string) {
  await requireHod();

  await prisma.intern.update({
    where: { id: internId },
    data: {
      mentor: { connect: { id: mentorUserId } },
      status: InternStatus.ACTIVE,
    },
  });
  await prisma.internStatusHistory.create({
    data: { intern: { connect: { id: internId } }, toStatus: InternStatus.ACTIVE, notes: "Project & mentor assigned by HOD" },
  });

  revalidatePath("/hod/current");
  revalidatePath("/hod/dashboard");
  revalidatePath(`/hod/current/${internId}`);
}

export async function confirmClosure(internId: string) {
  const user = await requireHod();

  await prisma.internStatusHistory.create({
    data: {
      intern: { connect: { id: internId } },
      toStatus: InternStatus.COMPLETED,
      changedBy: { connect: { id: user.id } },
      notes: "HOD reviewed the scorecard and confirmed closure — forwarded to HR for certification.",
    },
  });

  revalidatePath("/hod/completed");
  revalidatePath(`/hod/completed/${internId}`);
}

async function saveUpload(file: File): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
  await writeFile(path.join(dir, safeName), bytes);
  return `/uploads/${safeName}`;
}

export async function uploadTrainingResource(formData: FormData) {
  const user = await requireHod();

  const title = String(formData.get("title") ?? "").trim();
  const type = String(formData.get("type") ?? "DOCUMENT") as ResourceType;
  const file = formData.get("file") as File | null;
  if (!title || !file || file.size === 0) throw new Error("Title and file are required.");

  const storageKey = await saveUpload(file);
  const asset = await prisma.fileAsset.create({
    data: {
      storageKey,
      originalName: file.name,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      uploadedBy: { connect: { id: user.id } },
    },
  });

  await prisma.trainingResource.create({
    data: {
      title,
      type,
      department: { connect: { id: user.departmentId! } },
      file: { connect: { id: asset.id } },
      uploadedBy: { connect: { id: user.id } },
    },
  });

  revalidatePath("/hod/training-documents");
}

export async function deleteTrainingResource(resourceId: string) {
  await requireHod();
  await prisma.trainingResource.delete({ where: { id: resourceId } });
  revalidatePath("/hod/training-documents");
}

export async function sendInternMessage(
  internUserId: string,
  channel: "EMAIL" | "WHATSAPP",
  subject: string,
  body: string
) {
  await requireHod();
  if (!body.trim()) throw new Error("Message body is required.");

  await prisma.notification.create({
    data: {
      user: { connect: { id: internUserId } },
      type: "HOD_MESSAGE",
      channel: channel as NotificationChannel,
      payloadJson: JSON.stringify({ subject, body }),
    },
  });

  revalidatePath("/hod/current");
}
