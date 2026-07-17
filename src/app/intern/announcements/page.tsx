import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AnnouncementsClient } from "./AnnouncementsClient";

export default async function InternAnnouncementsPage() {
  const session = await auth();
  const notifications = await prisma.notification.findMany({
    where: { userId: session!.user.id },
    orderBy: { sentAt: "desc" },
  });

  const items = notifications.map((n) => {
    let subject = n.type;
    let body = "";
    try {
      const parsed = JSON.parse(n.payloadJson ?? "{}");
      subject = parsed.subject || subject;
      body = parsed.body || "";
    } catch (e) {
      console.error(`intern/announcements: failed to parse payloadJson for notification ${n.id}`, e);
    }
    return {
      id: n.id,
      subject,
      body,
      date: (n.sentAt ?? new Date()).toISOString(),
    };
  });

  return <AnnouncementsClient items={items} />;
}
