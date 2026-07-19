"use server";

import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { InternStatus, ResourceType, TaskSubmissionStatus, type RatingValue } from "@prisma/client";

async function requireMentor() {
  const session = await auth();
  if (!session?.user || session.user.role !== "MENTOR") throw new Error("Unauthorized");
  return session.user;
}

export async function addGoal(internId: string, goalType: string, goalName: string, targetDate: string | null, remarks: string) {
  await requireMentor();

  await prisma.$transaction([
    prisma.goal.create({
      data: {
        intern: { connect: { id: internId } },
        goalType,
        title: goalName,
        targetDate: targetDate ? new Date(targetDate) : null,
        supervisorComments: remarks || null,
        status: "OPEN",
      },
    }),
    prisma.intern.update({ where: { id: internId }, data: { projectName: goalName } }),
  ]);

  revalidatePath("/mentor/goals");
  revalidatePath("/mentor/dashboard");
  revalidatePath("/intern/dashboard");
}

async function requireOwnedGoal(goalId: string, mentorId: string) {
  const goal = await prisma.goal.findUnique({ where: { id: goalId }, include: { intern: true } });
  if (!goal || goal.intern.mentorUserId !== mentorId) throw new Error("Not found.");
  return goal;
}

async function requireOwnedTask(taskId: string, mentorId: string) {
  const task = await prisma.task.findUnique({ where: { id: taskId }, include: { goal: { include: { intern: true } } } });
  if (!task || task.goal.intern.mentorUserId !== mentorId) throw new Error("Not found.");
  return task;
}

export async function addTaskToGoal(
  goalId: string,
  name: string,
  description: string,
  startDate: string | null,
  endDate: string | null
) {
  const user = await requireMentor();
  const goal = await requireOwnedGoal(goalId, user.id);
  if (!name.trim()) throw new Error("Task name is required.");

  await prisma.task.create({
    data: {
      goal: { connect: { id: goalId } },
      name: name.trim(),
      description: description || null,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    },
  });

  revalidatePath(`/mentor/goals/${goal.internId}`);
  revalidatePath("/mentor/goals");
}

export async function updateTask(
  taskId: string,
  name: string,
  description: string,
  startDate: string | null,
  endDate: string | null
) {
  const user = await requireMentor();
  const task = await requireOwnedTask(taskId, user.id);
  if (!name.trim()) throw new Error("Task name is required.");

  await prisma.task.update({
    where: { id: taskId },
    data: {
      name: name.trim(),
      description: description || null,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    },
  });

  revalidatePath(`/mentor/goals/${task.goal.internId}`);
  revalidatePath("/mentor/goals");
}

export async function deleteTask(taskId: string) {
  const user = await requireMentor();
  const task = await requireOwnedTask(taskId, user.id);
  await prisma.task.delete({ where: { id: taskId } });
  revalidatePath(`/mentor/goals/${task.goal.internId}`);
  revalidatePath("/mentor/goals");
}

export async function reviewTaskSubmission(
  taskId: string,
  progressToAdd: number,
  feedback: string,
  decision: "APPROVE" | "REQUEST_CHANGES"
) {
  const user = await requireMentor();
  const task = await requireOwnedTask(taskId, user.id);
  if (task.submissionStatus === TaskSubmissionStatus.NOT_SUBMITTED) {
    throw new Error("This task has no submission to review.");
  }

  const newTotal = Math.min(100, Math.max(0, task.progressPct + progressToAdd));
  const status = decision === "APPROVE" ? TaskSubmissionStatus.APPROVED : TaskSubmissionStatus.CHANGES_REQUESTED;
  const now = new Date();

  // Every review action must leave a history entry — including a mentor
  // re-reviewing an already-decided task (no fresh submission from the
  // intern), which previously left no "pending" row to attach the update
  // to and silently dropped the correction from the history log.
  const lastRound = await prisma.taskReview.findFirst({
    where: { taskId },
    orderBy: { submittedAt: "desc" },
  });

  const reviewLogUpdate =
    lastRound && lastRound.reviewedAt === null
      ? prisma.taskReview.update({
          where: { id: lastRound.id },
          data: { reviewedAt: now, progressAdded: progressToAdd, progressTotal: newTotal, status, feedback: feedback || null },
        })
      : prisma.taskReview.create({
          data: {
            taskId,
            submissionLink: task.submissionLink ?? "",
            submittedAt: lastRound?.submittedAt ?? now,
            reviewedAt: now,
            progressAdded: progressToAdd,
            progressTotal: newTotal,
            status,
            feedback: feedback || null,
          },
        });

  await prisma.$transaction([
    prisma.task.update({
      where: { id: taskId },
      data: { progressPct: newTotal, mentorFeedback: feedback || null, reviewedAt: now, submissionStatus: status },
    }),
    reviewLogUpdate,
  ]);

  revalidatePath(`/mentor/goals/${task.goal.internId}`);
  revalidatePath("/mentor/goals");
}

const RATING_SCORE: Record<RatingValue, number> = { EXCELLENT: 5, AVERAGE: 3, POOR: 1 };

export async function submitBiweeklyReview(internId: string, ratings: { category: string; rating: RatingValue }[]) {
  const user = await requireMentor();

  const avg = ratings.reduce((sum, r) => sum + RATING_SCORE[r.rating], 0) / (ratings.length || 1);
  const now = new Date();
  const periodStart = new Date(now);
  periodStart.setDate(now.getDate() - 14);

  await prisma.biweeklyReview.create({
    data: {
      intern: { connect: { id: internId } },
      supervisor: { connect: { id: user.id } },
      periodStart,
      periodEnd: now,
      categoryRatingsJson: JSON.stringify(ratings),
      consolidatedRating: Number(avg.toFixed(2)),
    },
  });

  revalidatePath("/mentor/midterm");
  revalidatePath("/mentor/dashboard");
}

export async function createFinalRemark(
  internId: string,
  softSkillsScore: number,
  technicalSkillsScore: number,
  hireRecommended: boolean,
  comments: string
) {
  const user = await requireMentor();

  await prisma.$transaction([
    prisma.finalRemark.create({
      data: {
        intern: { connect: { id: internId } },
        supervisor: { connect: { id: user.id } },
        softSkillsScore,
        technicalSkillsScore,
        hireRecommended,
        comments: comments || null,
      },
    }),
    prisma.intern.update({ where: { id: internId }, data: { status: InternStatus.COMPLETED } }),
    prisma.internStatusHistory.create({
      data: {
        intern: { connect: { id: internId } },
        toStatus: InternStatus.COMPLETED,
        changedBy: { connect: { id: user.id } },
        notes: "Final remarks submitted by mentor",
      },
    }),
  ]);

  revalidatePath("/mentor/final-remarks");
  revalidatePath("/mentor/dashboard");
}

async function saveUpload(file: File): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
  await writeFile(path.join(dir, safeName), bytes);
  return `/uploads/${safeName}`;
}

export async function uploadMentorResource(formData: FormData) {
  const user = await requireMentor();
  if (!user.departmentId) throw new Error("No department assigned.");

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
      department: { connect: { id: user.departmentId } },
      file: { connect: { id: asset.id } },
      uploadedBy: { connect: { id: user.id } },
    },
  });

  revalidatePath("/mentor/training-documents");
}

export async function deleteMentorResource(resourceId: string) {
  await requireMentor();
  await prisma.trainingResource.delete({ where: { id: resourceId } });
  revalidatePath("/mentor/training-documents");
}
