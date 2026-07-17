"use client";

import { StatCard } from "@/components/ui/StatCard";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { useT } from "@/lib/i18n";
import { useGreeting } from "@/lib/useGreeting";

interface Props {
  name: string;
  stats: { users: number; departments: number; topics: number; nationalities: number };
  activity: { id: string; label: string; date: string }[];
}

export function AdminDashboardClient({ name, stats, activity }: Props) {
  const t = useT();
  const greeting = useGreeting();
  const firstName = name.split(" ")[0];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-[26px] sm:text-[30px] font-semibold">
        {greeting ? `${greeting}, ${firstName}` : t("admin.dashboard.title")} <span aria-hidden>👋</span>
      </h1>
      <p className="mt-1.5 text-[14px] text-text-2">{t("admin.dashboard.welcome")}</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="users"
          tint="bg-[#efe6ff] text-[#7c4dff]"
          value={stats.users}
          label={t("admin.stat.users")}
          action={t("common.view")}
          href="/admin/users"
        />
        <StatCard
          icon="university"
          tint="bg-[#e0f2fe] text-[#0369a1]"
          value={stats.departments}
          label={t("admin.stat.departments")}
          action={t("common.view")}
          href="/admin/departments"
        />
        <StatCard
          icon="training"
          tint="bg-[#fff3d6] text-[#b8860b]"
          value={stats.topics}
          label={t("admin.stat.topics")}
          action={t("common.view")}
          href="/admin/training-topics"
        />
        <StatCard
          icon="list"
          tint="bg-[#fbe6ee] text-[#c2185b]"
          value={stats.nationalities}
          label={t("admin.stat.nationalities")}
          action={t("common.view")}
          href="/admin/nationalities"
        />
      </div>

      <div className="mt-5">
        <ActivityFeed items={activity} icon="users" />
      </div>
    </div>
  );
}
