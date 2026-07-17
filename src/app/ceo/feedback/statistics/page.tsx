import { prisma } from "@/lib/prisma";
import { CeoFeedbackStatsClient } from "./CeoFeedbackStatsClient";

const RATING_SCORE: Record<string, number> = { Excellent: 4, Good: 3, Average: 2, Poor: 1 };

export default async function CeoFeedbackStatsPage() {
  const [feedback, finalRemarks, departments] = await Promise.all([
    prisma.postInternshipFeedback.findMany({
      include: { intern: { include: { department: true } } },
    }),
    prisma.finalRemark.findMany({ select: { softSkillsScore: true, technicalSkillsScore: true, hireRecommended: true } }),
    prisma.department.findMany({ select: { id: true, nameEn: true } }),
  ]);

  const parsed = feedback.map((f) => {
    let r: Record<string, string> = {};
    try {
      r = JSON.parse(f.responsesJson);
    } catch (e) {
      console.error(`ceo/feedback/statistics: failed to parse responsesJson for feedback ${f.id}`, e);
    }
    return { departmentId: f.intern.departmentId, overallExperience: r.overallExperience, mentorSupport: r.mentorSupport };
  });

  function avgScore(key: "overallExperience" | "mentorSupport", subset = parsed) {
    const scores = subset.map((p) => RATING_SCORE[p[key]]).filter((v): v is number => typeof v === "number");
    if (scores.length === 0) return 0;
    return Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2));
  }

  const avgOverall = avgScore("overallExperience");
  const avgMentorSupport = avgScore("mentorSupport");

  const avgSoft = finalRemarks.length
    ? Number((finalRemarks.reduce((a, r) => a + r.softSkillsScore, 0) / finalRemarks.length).toFixed(2))
    : 0;
  const avgTechnical = finalRemarks.length
    ? Number((finalRemarks.reduce((a, r) => a + r.technicalSkillsScore, 0) / finalRemarks.length).toFixed(2))
    : 0;
  const hireRate = finalRemarks.length
    ? Math.round((finalRemarks.filter((r) => r.hireRecommended).length / finalRemarks.length) * 100)
    : 0;

  const byDepartment = departments.map((d) => {
    const subset = parsed.filter((p) => p.departmentId === d.id);
    return {
      department: d.nameEn,
      responses: subset.length,
      avgOverall: avgScore("overallExperience", subset),
      avgMentorSupport: avgScore("mentorSupport", subset),
    };
  });

  return (
    <CeoFeedbackStatsClient
      totalResponses={feedback.length}
      avgOverall={avgOverall}
      avgMentorSupport={avgMentorSupport}
      avgSoft={avgSoft}
      avgTechnical={avgTechnical}
      hireRate={hireRate}
      byDepartment={byDepartment}
    />
  );
}
