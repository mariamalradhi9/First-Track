import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isProfileComplete } from "@/lib/internProgress";
import { InternDashboardClient } from "./InternDashboardClient";

export default async function InternDashboardPage() {
  const session = await auth();
  const intern = await prisma.intern.findUnique({
    where: { userId: session!.user.id },
    include: {
      goals: true,
      questionnaire: true,
      postInternshipFeedback: true,
      certificate: true,
      department: true,
      statusHistory: { orderBy: { changedAt: "desc" }, take: 5 },
      meetings: { where: { completedAt: null }, orderBy: { dueDate: "asc" }, take: 1 },
    },
  });

  if (!intern) {
    return (
      <div className="text-[14px] text-text-2">
        No intern profile is linked to this account yet. Contact your coordinator.
      </div>
    );
  }

  const [docsCount, timesheetCount] = await Promise.all([
    prisma.trainingResource.count({ where: { departmentId: intern.departmentId } }),
    prisma.timesheet.count({ where: { internId: intern.id } }),
  ]);

  // Program day counter — only meaningful once the intern has actually started.
  let programDay: number | null = null;
  let programTotalDays: number | null = null;
  let daysRemaining: number | null = null;
  if (intern.doj && intern.durationMonths) {
    const start = new Date(intern.doj);
    const end = new Date(start);
    end.setMonth(end.getMonth() + intern.durationMonths);
    const totalDays = Math.round((end.getTime() - start.getTime()) / 86_400_000);
    const elapsed = Math.round((Date.now() - start.getTime()) / 86_400_000) + 1;
    programDay = Math.min(Math.max(elapsed, 1), totalDays);
    programTotalDays = totalDays;
    daysRemaining = Math.max(totalDays - programDay, 0);
  }

  const achievements = [
    { key: "firstGoal" as const, unlocked: intern.goals.length > 0 },
    { key: "halfway" as const, unlocked: !!programDay && !!programTotalDays && programDay / programTotalDays >= 0.5 },
    { key: "consistentLogger" as const, unlocked: timesheetCount >= 5 },
    { key: "graduate" as const, unlocked: !!intern.certificate },
  ];

  // Onboarding checklist — drives the "Continue your journey" progress ring.
  // Only counts steps the intern themselves completes (questionnaire + profile).
  // Goal assignment is excluded: it's done by the mentor, not the intern, so
  // including it made the ring jump to a nonzero % on first login whenever a
  // mentor had already assigned a goal, which read as a random/unexplained number.
  const profileComplete = isProfileComplete(intern);
  const checklist = [!!intern.questionnaire, profileComplete];
  const completedSteps = checklist.filter(Boolean).length;
  const progressPct = Math.round((completedSteps / checklist.length) * 100);

  const nextStep = !intern.questionnaire
    ? { labelKey: "nav.questionnaire" as const, href: "/intern/questionnaire" }
    : !profileComplete
      ? { labelKey: "nav.profile" as const, href: "/intern/profile" }
      : null;

  const activity = intern.statusHistory.map((h) => ({
    id: h.id,
    label: h.notes ?? `Status changed to ${h.toStatus}`,
    date: h.changedAt.toISOString(),
  }));
  if (intern.questionnaire) {
    activity.push({
      id: "questionnaire",
      label: "You submitted the pre-internship questionnaire",
      date: intern.questionnaire.submittedAt.toISOString(),
    });
  }
  activity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const nextMeeting = intern.meetings[0]
    ? { type: intern.meetings[0].type, dueDate: intern.meetings[0].dueDate?.toISOString() ?? null }
    : null;

  return (
    <InternDashboardClient
      name={session!.user.name ?? ""}
      department={intern.department.nameEn}
      projectName={intern.projectName}
      status={intern.status}
      goalCount={intern.goals.length}
      certified={!!intern.certificate}
      certReady={intern.status === "COMPLETED" || intern.status === "CERTIFIED"}
      docsCount={docsCount}
      progressPct={progressPct}
      nextStep={nextStep}
      activity={activity.slice(0, 4)}
      nextMeeting={nextMeeting}
      programDay={programDay}
      programTotalDays={programTotalDays}
      daysRemaining={daysRemaining}
      achievements={achievements}
    />
  );
}
