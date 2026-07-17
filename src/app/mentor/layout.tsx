import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppShell } from "@/components/layout/AppShell";
import { MENTOR_NAV } from "@/lib/nav-config";

export default async function MentorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "MENTOR") redirect("/");

  return (
    <AppShell navItems={MENTOR_NAV} userName={session.user.name ?? session.user.cprId} userRole={session.user.role}>
      {children}
    </AppShell>
  );
}
