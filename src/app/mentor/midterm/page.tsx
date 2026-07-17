import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MidtermClient } from "./MidtermClient";

export default async function MidtermPage() {
  const session = await auth();
  const mentorId = session!.user.id;

  const interns = await prisma.intern.findMany({
    where: { mentorUserId: mentorId, status: "ACTIVE" },
    include: {
      user: true,
      biweeklyReviews: { orderBy: { createdAt: "desc" }, take: 1 },
      goals: true,
      _count: { select: { biweeklyReviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const rows = interns.map((i) => ({
    id: i.id,
    name: i.user?.name ?? "—",
    goalCount: i.goals.length,
    latestRating: i.biweeklyReviews[0]?.consolidatedRating ?? null,
    reviewCount: i._count.biweeklyReviews,
  }));

  return <MidtermClient rows={rows} />;
}
