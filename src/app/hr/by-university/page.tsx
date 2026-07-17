import { prisma } from "@/lib/prisma";
import { ByUniversityClient } from "./ByUniversityClient";

export default async function ByUniversityPage() {
  const interns = await prisma.intern.findMany({
    select: { universityName: true, status: true },
  });

  const grouped = new Map<string, { total: number; active: number; certified: number }>();
  for (const i of interns) {
    const uni = i.universityName ?? "Unknown";
    const entry = grouped.get(uni) ?? { total: 0, active: 0, certified: 0 };
    entry.total += 1;
    if (i.status === "ACTIVE") entry.active += 1;
    if (i.status === "CERTIFIED") entry.certified += 1;
    grouped.set(uni, entry);
  }

  const rows = Array.from(grouped.entries())
    .map(([university, stats]) => ({ university, ...stats }))
    .sort((a, b) => b.total - a.total);

  return <ByUniversityClient rows={rows} />;
}
