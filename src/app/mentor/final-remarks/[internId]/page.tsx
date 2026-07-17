import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CreateFinalRemarkClient } from "./CreateFinalRemarkClient";

export default async function CreateFinalRemarkPage({ params }: { params: Promise<{ internId: string }> }) {
  const { internId } = await params;
  const intern = await prisma.intern.findUnique({ where: { id: internId }, include: { user: true } });
  if (!intern) notFound();

  return <CreateFinalRemarkClient internId={intern.id} name={intern.user?.name ?? "—"} />;
}
