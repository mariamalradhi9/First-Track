"use client";

import { StatCard } from "@/components/ui/StatCard";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { useT } from "@/lib/i18n";
import { useGreeting } from "@/lib/useGreeting";

interface Props {
  name: string;
  stats: { active: number; goals: number; reviews: number };
  activity: { id: string; label: string; date: string }[];
}

export function MentorDashboardClient({ name, stats, activity }: Props) {
  const t = useT();
  const greeting = useGreeting();
  const firstName = name.split(" ")[0];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-[26px] sm:text-[30px] font-semibold">
        {greeting ? `${greeting}, ${firstName}` : t("mentor.dashboard.title")} <span aria-hidden>👋</span>
      </h1>
      <p className="mt-1.5 text-[14px] text-text-2">{t("mentor.dashboard.welcome")}</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon="current" tint="bg-[#dcf5e6] text-[#1e8e5a]" value={stats.active} label={t("mentor.stat.active")} action={t("common.view")} href="/mentor/goals" />
        <StatCard icon="goals" tint="bg-[#efe6ff] text-[#7c4dff]" value={stats.goals} label={t("mentor.stat.goals")} action={t("common.view")} href="/mentor/goals" />
        <StatCard icon="completed" tint="bg-[#fff3d6] text-[#b8860b]" value={stats.reviews} label={t("mentor.stat.reviews")} action={t("common.view")} href="/mentor/midterm" />
      </div>

      <div className="mt-5">
        <ActivityFeed items={activity} icon="goals" />
      </div>
    </div>
  );
}
