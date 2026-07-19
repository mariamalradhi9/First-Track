import { redirect } from "next/navigation";
import { auth } from "@/auth";

const ROLE_HOME: Record<string, string> = {
  HR: "/hr/dashboard",
  HOD: "/hod/dashboard",
  MENTOR: "/mentor/dashboard",
  INTERN: "/intern/dashboard",
  CEO: "/ceo/dashboard",
  SUPER_ADMIN: "/admin/dashboard",
};

export default async function Home() {
  const session = await auth();
  const role = session?.user?.role ?? "HR";
  redirect(ROLE_HOME[role] ?? "/hr/dashboard");
}
