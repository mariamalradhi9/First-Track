"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export interface NotificationItem {
  id: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
}

function parseNotification(n: { id: string; type: string; payloadJson: string | null; sentAt: Date | null; readAt: Date | null }): NotificationItem {
  let subject = n.type;
  let body = "";
  try {
    const parsed = JSON.parse(n.payloadJson ?? "{}");
    subject = parsed.subject || subject;
    body = parsed.body || "";
  } catch (e) {
    console.error(`notificationActions: failed to parse payloadJson for notification ${n.id}`, e);
  }
  return { id: n.id, subject, body, date: (n.sentAt ?? new Date()).toISOString(), read: !!n.readAt };
}

export async function getMyNotifications(): Promise<NotificationItem[]> {
  const session = await auth();
  if (!session?.user) return [];
  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { sentAt: "desc" },
    take: 20,
  });
  return notifications.map(parseNotification);
}

export async function markNotificationRead(id: string) {
  const session = await auth();
  if (!session?.user) return;
  await prisma.notification.updateMany({ where: { id, userId: session.user.id, readAt: null }, data: { readAt: new Date() } });
}

export async function markAllNotificationsRead() {
  const session = await auth();
  if (!session?.user) return;
  await prisma.notification.updateMany({ where: { userId: session.user.id, readAt: null }, data: { readAt: new Date() } });
}
