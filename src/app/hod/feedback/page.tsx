import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { InitialsAvatar } from "@/components/InitialsAvatar";

const QUESTIONS: Record<string, string> = {
  overallExperience: "How would you rate your overall internship experience?",
  mentorSupport: "How supportive was your mentor?",
  skillsGained: "What skills did you gain during this internship?",
  suggestions: "Any suggestions for improving the program?",
};

export default async function HodFeedbackPage() {
  const session = await auth();
  const departmentId = session!.user.departmentId!;

  const interns = await prisma.intern.findMany({
    where: { departmentId, postInternshipFeedback: { isNot: null } },
    include: { user: true, postInternshipFeedback: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-[26px] sm:text-[30px] font-semibold">Intern Feedback</h1>
      <p className="mt-1.5 text-[14px] text-text-2">Post-internship feedback submitted by interns in your department.</p>

      <div className="mt-5 flex flex-col gap-4">
        {interns.length === 0 && <EmptyState title="No feedback yet" message="Feedback will appear here once interns submit it." />}
        {interns.map((i) => {
          let parsed: Record<string, string> = {};
          let parseFailed = false;
          try {
            parsed = JSON.parse(i.postInternshipFeedback!.responsesJson);
          } catch (e) {
            parseFailed = true;
            console.error(`hod/feedback: failed to parse responsesJson for intern ${i.id}`, e);
          }
          return (
            <Card key={i.id} className="p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-line">
                <span className="inline-flex items-center gap-3">
                  <InitialsAvatar name={i.user?.name ?? "—"} size={30} />
                  <span className="font-medium text-[14px] text-text">{i.user?.name ?? "—"}</span>
                </span>
                <p className="text-[12.5px] text-text-3">
                  Submitted {format(new Date(i.postInternshipFeedback!.submittedAt), "d MMM yyyy")}
                </p>
              </div>
              {parseFailed ? (
                <p className="text-[13.5px] text-status-rejected-fg">
                  This response couldn&rsquo;t be read (corrupted data) — contact IT support.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(QUESTIONS).map(([key, label]) => (
                    <div key={key}>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-text-3">{label}</p>
                      <p className="mt-1 text-[13.5px] text-text">{parsed[key] ?? "—"}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
