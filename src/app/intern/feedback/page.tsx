import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { FeedbackClient } from "./FeedbackClient";

export default async function InternFeedbackPage() {
  const session = await auth();
  const intern = await prisma.intern.findUnique({
    where: { userId: session!.user.id },
    include: { postInternshipFeedback: true },
  });

  const eligible = !!intern && (intern.status === "COMPLETED" || intern.status === "CERTIFIED");
  const alreadySubmitted = !!intern?.postInternshipFeedback;

  return <FeedbackClient eligible={eligible} alreadySubmitted={alreadySubmitted} />;
}
