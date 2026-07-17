"use client";

import { StatCard } from "@/components/ui/StatCard";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { useT } from "@/lib/i18n";
import { useGreeting } from "@/lib/useGreeting";

interface Stats {
  total: number;
  active: number;
  completed: number;
  certified: number;
  departments: number;
  hireRate: number;
}

export function CeoDashboardClient({
  name,
  stats,
  activity,
}: {
  name: string;
  stats: Stats;
  activity: { id: string; label: string; date: string }[];
}) {
  const t = useT();
  const greeting = useGreeting();
  const firstName = name.split(" ")[0];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-[26px] sm:text-[30px] font-semibold">
        {greeting ? `${greeting}, ${firstName}` : t("ceo.dashboard.title")} <span aria-hidden>👋</span>
      </h1>
      <p className="mt-1.5 text-[14px] text-text-2">{t("ceo.dashboard.welcome")}</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon="list" tint="bg-[#efe6ff] text-[#7c4dff]" value={stats.total} label={t("ceo.stat.total")} action={t("common.view")} href="/ceo/interns" />
        <StatCard icon="current" tint="bg-[#dcf5e6] text-[#1e8e5a]" value={stats.active} label={t("ceo.stat.active")} action={t("common.view")} href="/ceo/interns?status=ACTIVE" />
        <StatCard icon="completed" tint="bg-[#fff3d6] text-[#b8860b]" value={stats.completed} label={t("ceo.stat.completed")} action={t("common.view")} href="/ceo/interns?status=COMPLETED" />
        <StatCard icon="certificate" tint="bg-[#fbe6ee] text-[#c2185b]" value={stats.certified} label={t("ceo.stat.certified")} action={t("common.view")} href="/ceo/interns?status=CERTIFIED" />
        <StatCard icon="goals" tint="bg-[#e0f2fe] text-[#0369a1]" value={`${stats.hireRate}%`} label={t("ceo.stat.hireRate")} action={t("common.view")} href="/ceo/interns?recommended=1" />
        <StatCard icon="university" tint="bg-[#ffe6f0] text-[#d81b60]" value={stats.departments} label={t("ceo.stat.departments")} />
      </div>

      <div className="mt-5">
        <ActivityFeed items={activity} icon="certificate" />
      </div>
    </div>
  );
}
