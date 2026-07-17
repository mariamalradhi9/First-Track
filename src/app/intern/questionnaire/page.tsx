import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { QuestionnaireClient } from "./QuestionnaireClient";

export default async function QuestionnairePage() {
  const session = await auth();
  const intern = await prisma.intern.findUnique({
    where: { userId: session!.user.id },
    include: { questionnaire: true },
  });

  let existing: Record<string, string> | null = null;
  if (intern?.questionnaire) {
    try {
      existing = JSON.parse(intern.questionnaire.responsesJson);
    } catch (e) {
      console.error(`intern/questionnaire: failed to parse responsesJson for intern ${intern.id}`, e);
    }
  }

  return <QuestionnaireClient existing={existing} />;
}
