import { prisma } from "@/lib/prisma";
import { EmailSettingsClient } from "./EmailSettingsClient";

const DEFAULT_EVENTS = [
  { eventKey: "shortlist.created", label: "New intern shortlisted" },
  { eventKey: "shortlist.decided", label: "HOD approved / rejected an application" },
  { eventKey: "intern.assigned", label: "Intern assigned to project & mentor" },
  { eventKey: "intern.completed", label: "Intern marked as completed" },
  { eventKey: "intern.certified", label: "Certificate issued" },
  { eventKey: "goal.assigned", label: "New goal assigned to intern" },
  { eventKey: "review.submitted", label: "Bi-weekly review submitted" },
];

export default async function EmailNotificationSettingsPage() {
  const existing = await prisma.emailNotificationSetting.findMany();
  const existingMap = new Map(existing.map((e) => [e.eventKey, e.isEnabled]));

  const rows = DEFAULT_EVENTS.map((e) => ({
    eventKey: e.eventKey,
    label: e.label,
    isEnabled: existingMap.has(e.eventKey) ? existingMap.get(e.eventKey)! : true,
  }));

  return <EmailSettingsClient rows={rows} />;
}
