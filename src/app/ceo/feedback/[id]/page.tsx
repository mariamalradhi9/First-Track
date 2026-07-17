import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CeoFeedbackDetailClient } from "./CeoFeedbackDetailClient";

const QUESTIONS: Record<string, string> = {
  overallExperience: "How would you rate your overall internship experience?",
  mentorSupport: "How supportive was your mentor?",
  skillsGained: "What skills did you gain during this internship?",
  suggestions: "Any suggestions for improving the program?",
};

export default async function CeoFeedbackDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const feedback = await prisma.postInternshipFeedback.findUnique({
    where: { id },
    include: { intern: { include: { user: true, department: true } } },
  });

  if (!feedback) notFound();

  let responses: Record<string, string> = {};
  try {
    responses = JSON.parse(feedback.responsesJson);
  } catch (e) {
    console.error(`ceo/feedback/[id]: failed to parse responsesJson for feedback ${id}`, e);
  }

  const items = Object.entries(QUESTIONS).map(([key, label]) => ({ label, value: responses[key] ?? "—" }));

  return (
    <CeoFeedbackDetailClient
      name={feedback.intern.user?.name ?? feedback.intern.email ?? "—"}
      department={feedback.intern.department.nameEn}
      submittedAt={feedback.submittedAt.toISOString()}
      items={items}
    />
  );
}
