"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus, InternStatus, InternshipType } from "@prisma/client";

async function requireHr() {
  const session = await auth();
  if (!session?.user || session.user.role !== "HR") throw new Error("Unauthorized");
  return session.user;
}

async function saveUpload(file: File): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
  await writeFile(path.join(dir, safeName), bytes);
  return `/uploads/${safeName}`;
}

export async function createShortlistApplication(formData: FormData) {
  const user = await requireHr();

  const applicantName = String(formData.get("applicantName") ?? "").trim();
  const sourceDivision = String(formData.get("sourceDivision") ?? "").trim();
  const departmentId = String(formData.get("departmentId") ?? "");
  const type = String(formData.get("type") ?? "OFFLINE") as InternshipType;
  const periodStart = formData.get("periodStart") ? new Date(String(formData.get("periodStart"))) : null;
  const periodEnd = formData.get("periodEnd") ? new Date(String(formData.get("periodEnd"))) : null;
  const cv = formData.get("cv") as File | null;

  if (!applicantName || !departmentId) {
    throw new Error("Applicant name and department are required.");
  }

  let cvFileId: string | undefined;
  if (cv && cv.size > 0) {
    const storageKey = await saveUpload(cv);
    const asset = await prisma.fileAsset.create({
      data: {
        storageKey,
        originalName: cv.name,
        mimeType: cv.type || "application/octet-stream",
        size: cv.size,
        uploadedBy: { connect: { id: user.id } },
      },
    });
    cvFileId = asset.id;
  }

  const app = await prisma.shortlistApplication.create({
    data: {
      applicantName,
      sourceDivision: sourceDivision || null,
      interestedDepartment: { connect: { id: departmentId } },
      type,
      trainingPeriodStart: periodStart,
      trainingPeriodEnd: periodEnd,
      cvFile: cvFileId ? { connect: { id: cvFileId } } : undefined,
      status: ApplicationStatus.SHORTLISTED,
      createdBy: { connect: { id: user.id } },
    },
  });

  revalidatePath("/hr/shortlisted");
  revalidatePath("/hr/dashboard");
  redirect(`/hr/shortlisted/${app.id}`);
}

export async function acceptUniversityIntern(applicationId: string) {
  await requireHr();
  await prisma.shortlistApplication.update({
    where: { id: applicationId },
    data: { status: ApplicationStatus.SHORTLISTED },
  });
  revalidatePath("/hr/university-interns");
  revalidatePath("/hr/shortlisted");
  revalidatePath("/hr/dashboard");
}

export async function certifyIntern(internId: string) {
  const user = await requireHr();

  await prisma.$transaction([
    prisma.certificate.create({
      data: { intern: { connect: { id: internId } }, certifiedBy: { connect: { id: user.id } } },
    }),
    prisma.intern.update({
      where: { id: internId },
      data: { status: InternStatus.CERTIFIED },
    }),
    prisma.internStatusHistory.create({
      data: {
        intern: { connect: { id: internId } },
        toStatus: InternStatus.CERTIFIED,
        changedBy: { connect: { id: user.id } },
        notes: "Certified by HR",
      },
    }),
  ]);

  revalidatePath("/hr/completed");
  revalidatePath("/hr/dashboard");
  revalidatePath(`/hr/completed/${internId}`);
}
