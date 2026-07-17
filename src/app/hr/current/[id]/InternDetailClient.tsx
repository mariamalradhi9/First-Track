"use client";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { InternProfileCard, type InternProfileData } from "@/components/InternProfileCard";
import BackLink from "@/components/BackLink";
import { useT } from "@/lib/i18n";

export function InternDetailClient({ intern }: { intern: InternProfileData }) {
  const t = useT();

  return (
    <div className="max-w-3xl mx-auto">
      <BackLink />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[24px] sm:text-[28px] font-semibold">{intern.name}</h1>
        <StatusBadge status={intern.status}>{t(`status.${intern.status}` as never)}</StatusBadge>
      </div>

      <div className="mt-5">
        <InternProfileCard intern={intern} />
      </div>
    </div>
  );
}
