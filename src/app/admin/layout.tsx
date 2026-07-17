import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppShell } from "@/components/layout/AppShell";
import { ADMIN_NAV } from "@/lib/nav-config";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "SUPER_ADMIN") redirect("/");

  return (
    <AppShell navItems={ADMIN_NAV} userName={session.user.name ?? session.user.cprId} userRole={session.user.role}>
      {children}
    </AppShell>
  );
}
