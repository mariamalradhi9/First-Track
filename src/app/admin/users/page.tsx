import { prisma } from "@/lib/prisma";
import { UsersClient } from "./UsersClient";

export default async function AdminUsersPage() {
  const [users, departments] = await Promise.all([
    prisma.user.findMany({ include: { department: true }, orderBy: { createdAt: "desc" } }),
    prisma.department.findMany({ orderBy: { nameEn: "asc" } }),
  ]);

  const rows = users.map((u) => ({
    id: u.id,
    cprId: u.cprId,
    name: u.name,
    email: u.email,
    role: u.role,
    department: u.department?.nameEn ?? "—",
    isActive: u.isActive,
  }));

  const deptOptions = departments.map((d) => ({ id: d.id, nameEn: d.nameEn }));

  return <UsersClient rows={rows} departments={deptOptions} />;
}
