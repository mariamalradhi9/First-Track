"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") throw new Error("Unauthorized");
  return session.user;
}

export async function createUser(fields: {
  cprId: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  departmentId: string | null;
}) {
  await requireAdmin();
  if (!fields.cprId.trim() || !fields.name.trim()) throw new Error("CPR ID and name are required.");

  const passwordHash = await bcrypt.hash("Passw0rd!", 10);
  await prisma.user.create({
    data: {
      cprId: fields.cprId.trim(),
      name: fields.name.trim(),
      email: fields.email.trim() || null,
      phone: fields.phone.trim() || null,
      role: fields.role,
      passwordHash,
      department: fields.departmentId ? { connect: { id: fields.departmentId } } : undefined,
    },
  });
  revalidatePath("/admin/users");
}

export async function toggleUserActive(userId: string, isActive: boolean) {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { isActive } });
  revalidatePath("/admin/users");
}

function generateTempPassword(): string {
  // Readable mixed-case + digit password, avoiding visually ambiguous characters (0/O, 1/l/I).
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 10; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function resetUserPassword(userId: string) {
  await requireAdmin();
  const password = generateTempPassword();
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  revalidatePath("/admin/users");
  return { password };
}

export async function createDepartment(nameEn: string, nameAr: string) {
  await requireAdmin();
  if (!nameEn.trim() || !nameAr.trim()) throw new Error("Both English and Arabic names are required.");
  await prisma.department.create({ data: { nameEn: nameEn.trim(), nameAr: nameAr.trim() } });
  revalidatePath("/admin/departments");
}

export async function createTrainingTopic(nameEn: string, nameAr: string, departmentId: string | null) {
  await requireAdmin();
  if (!nameEn.trim() || !nameAr.trim()) throw new Error("Both English and Arabic names are required.");
  await prisma.trainingTopic.create({
    data: {
      nameEn: nameEn.trim(),
      nameAr: nameAr.trim(),
      department: departmentId ? { connect: { id: departmentId } } : undefined,
    },
  });
  revalidatePath("/admin/training-topics");
}

export async function createNationality(nameEn: string, nameAr: string) {
  await requireAdmin();
  if (!nameEn.trim() || !nameAr.trim()) throw new Error("Both English and Arabic names are required.");
  await prisma.nationality.create({ data: { nameEn: nameEn.trim(), nameAr: nameAr.trim() } });
  revalidatePath("/admin/nationalities");
}

export async function toggleEmailSetting(eventKey: string, isEnabled: boolean) {
  await requireAdmin();
  await prisma.emailNotificationSetting.upsert({
    where: { eventKey },
    create: { eventKey, isEnabled },
    update: { isEnabled },
  });
  revalidatePath("/admin/settings/email-notifications");
}
