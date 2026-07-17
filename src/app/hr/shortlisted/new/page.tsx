import { prisma } from "@/lib/prisma";
import { NewShortlistForm } from "./NewShortlistForm";

export default async function NewShortlistPage() {
  const departments = await prisma.department.findMany({ orderBy: { nameEn: "asc" } });
  return <NewShortlistForm departments={departments} />;
}
