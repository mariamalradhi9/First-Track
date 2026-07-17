"use client";

import { StatCard } from "@/components/ui/StatCard";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n";
import { useGreeting } from "@/lib/useGreeting";
import { useRouter } from "next/navigation";

interface Props {
  name: string;
  stats: { shortlisted: number; current: number; completed: number; certified: number };
  activity: { id: string; label: string; date: string }[];
}

export function HrDashboardClient({ name, stats, activity }: Props) {
  const t = useT();
  const router = useRouter();
  const greeting = useGreeting();
  const firstName = name.split(" ")[0];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-semibold">
            {greeting ? `${greeting}, ${firstName}` : t("hr.dashboard.title")} <span aria-hidden>👋</span>
          </h1>
          <p className="mt-1.5 text-[14px] text-text-2">{t("hr.dashboard.welcome")}</p>
        </div>
        <Button onClick={() => router.push("/hr/shortlisted/new")} className="sm:w-auto">
          {t("nav.addShortlisted")}
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="list"
          tint="bg-[#efe6ff] text-[#7c4dff]"
          value={stats.shortlisted}
          label={t("hr.stat.shortlisted")}
          action={t("common.view")}
          href="/hr/shortlisted"
        />
        <StatCard
          icon="current"
          tint="bg-[#dcf5e6] text-[#1e8e5a]"
          value={stats.current}
          label={t("hr.stat.current")}
          action={t("common.view")}
          href="/hr/current"
        />
        <StatCard
          icon="completed"
          tint="bg-[#fff3d6] text-[#b8860b]"
          value={stats.completed}
          label={t("hr.stat.completed")}
          action={t("common.view")}
          href="/hr/completed?filter=COMPLETED"
        />
        <StatCard
          icon="certificate"
          tint="bg-[#fbe6ee] text-[#c2185b]"
          value={stats.certified}
          label={t("hr.stat.certified")}
          action={t("common.view")}
          href="/hr/completed?filter=CERTIFIED"
        />
      </div>

      <div className="mt-5">
        <ActivityFeed items={activity} icon="add" />
      </div>
    </div>
  );
}
