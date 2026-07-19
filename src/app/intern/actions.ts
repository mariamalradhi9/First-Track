"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TaskSubmissionStatus } from "@prisma/client";

async function requireInternRecord() {
  const session = await auth();
  if (!session?.user || session.user.role !== "INTERN") throw new Error("Unauthorized");
  const intern = await prisma.intern.findUnique({ where: { userId: session.user.id } });
  if (!intern) throw new Error("No intern profile found for this account.");
  return intern;
}

export async function submitTaskLink(taskId: string, link: string) {
  const intern = await requireInternRecord();
  if (!link.trim()) throw new Error("Please enter a link to your work.");

  const task = await prisma.task.findUnique({ where: { id: taskId }, include: { goal: true } });
  if (!task || task.goal.internId !== intern.id) throw new Error("Not found.");
  if (task.submissionStatus !== TaskSubmissionStatus.NOT_SUBMITTED && task.submissionStatus !== TaskSubmissionStatus.CHANGES_REQUESTED) {
    throw new Error("This task has already been submitted and is awaiting or has completed review.");
  }

  await prisma.task.update({
    where: { id: taskId },
    data: {
      submissionLink: link.trim(),
      submissionStatus: TaskSubmissionStatus.SUBMITTED,
      submittedAt: new Date(),
    },
  });

  revalidatePath(`/intern/goals/${task.goalId}`);
  revalidatePath("/intern/goals");
}

export async function submitQuestionnaire(responses: Record<string, string>) {
  const intern = await requireInternRecord();
  await prisma.questionnaireResponse.upsert({
    where: { internId: intern.id },
    create: { intern: { connect: { id: intern.id } }, responsesJson: JSON.stringify(responses) },
    update: { responsesJson: JSON.stringify(responses) },
  });
  revalidatePath("/intern/questionnaire");
  revalidatePath("/intern/dashboard");
}

export async function updateProfile(fields: {
  mobile?: string;
  address?: string;
  universityName?: string;
  studentId?: string;
  gpa?: number;
}) {
  const intern = await requireInternRecord();
  await prisma.intern.update({ where: { id: intern.id }, data: fields });
  revalidatePath("/intern/profile");
}

export async function submitTimesheet(
  goalId: string,
  taskId: string | null,
  date: string,
  checkIn: string,
  checkOut: string,
  progressPct: number,
  remarks: string
) {
  const intern = await requireInternRecord();

  const checkInDate = new Date(`${date}T${checkIn}`);
  const checkOutDate = new Date(`${date}T${checkOut}`);
  const totalHours = Math.max(0, (checkOutDate.getTime() - checkInDate.getTime()) / 3_600_000);

  await prisma.timesheet.create({
    data: {
      intern: { connect: { id: intern.id } },
      task: taskId ? { connect: { id: taskId } } : undefined,
      date: new Date(date),
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalHours: Number(totalHours.toFixed(2)),
      progressPct,
      remarks: remarks || null,
      isLocked: true,
    },
  });

  revalidatePath(`/intern/goals/${goalId}/timesheet`);
  revalidatePath("/intern/goals");
  revalidatePath("/intern/dashboard");
}

export async function submitPostInternshipFeedback(responses: Record<string, string>) {
  const intern = await requireInternRecord();
  const existing = await prisma.postInternshipFeedback.findUnique({ where: { internId: intern.id } });
  if (existing) throw new Error("Feedback already submitted.");

  await prisma.postInternshipFeedback.create({
    data: { intern: { connect: { id: intern.id } }, responsesJson: JSON.stringify(responses) },
  });

  revalidatePath("/intern/feedback");
  revalidatePath("/intern/certificate");
  revalidatePath("/intern/dashboard");
}
