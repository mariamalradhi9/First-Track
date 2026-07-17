"use client";

import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { useT } from "@/lib/i18n";
import { useGreeting } from "@/lib/useGreeting";

interface Stats {
  pending: number;
  current: number;
  completed: number;
  certified: number;
  docs: number;
  male: number;
  female: number;
  highReview: number;
}

interface MentorRow {
  id: string;
  name: string;
  active: number;
  completed: number;
}
interface ActivityItem {
  id: string;
  label: string;
  date: string;
}

export function HodDashboardClient({
  name,
  stats,
  byMentor,
  activity,
}: {
  name: string;
  stats: Stats;
  byMentor: MentorRow[];
  activity: ActivityItem[];
}) {
  const t = useT();
  const greeting = useGreeting();
  const firstName = name.split(" ")[0];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-[26px] sm:text-[30px] font-semibold">
        {greeting ? `${greeting}, ${firstName}` : t("hod.dashboard.title")} <span aria-hidden>👋</span>
      </h1>
      <p className="mt-1.5 text-[14px] text-text-2">{t("hod.dashboard.welcome")}</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="list" tint="bg-[#efe6ff] text-[#7c4dff]" value={stats.pending} label={t("hod.stat.pending")} action={t("common.view")} href="/hod/shortlisted" />
        <StatCard icon="current" tint="bg-[#dcf5e6] text-[#1e8e5a]" value={stats.current} label={t("hod.stat.current")} action={t("common.view")} href="/hod/current" />
        <StatCard icon="completed" tint="bg-[#fff3d6] text-[#b8860b]" value={stats.completed} label={t("hod.stat.completed")} action={t("common.view")} href="/hod/completed" />
        <StatCard icon="certificate" tint="bg-[#fbe6ee] text-[#c2185b]" value={stats.certified} label={t("hod.stat.certified")} action={t("common.view")} href="/hod/closed" />
        <StatCard icon="users" tint="bg-[#e0f2fe] text-[#0369a1]" value={stats.male} label={t("hod.stat.male")} />
        <StatCard icon="users" tint="bg-[#ffe6f0] text-[#d81b60]" value={stats.female} label={t("hod.stat.female")} />
        <StatCard icon="goals" tint="bg-[#efe6ff] text-[#7c4dff]" value={stats.highReview} label={t("hod.stat.highReview")} />
        <StatCard icon="training" tint="bg-[#dcf5e6] text-[#1e8e5a]" value={stats.docs} label={t("hod.stat.docs")} action={t("common.view")} href="/hod/training-documents" />
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
        <ActivityFeed items={activity} icon="current" />

        <Card className="p-5 sm:p-6">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.6px] text-text-3 mb-4">
            {t("hod.dashboard.byMentor")}
          </h2>
          {byMentor.length === 0 ? (
            <p className="text-[13.5px] text-text-3">{t("hod.dashboard.noMentors")}</p>
          ) : (
            <div className="flex flex-col divide-y divide-line">
              {byMentor.map((m) => (
                <div key={m.id} className="py-3 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2.5 min-w-0">
                    <InitialsAvatar name={m.name} size={26} />
                    <span className="text-[13.5px] font-medium text-text truncate">{m.name}</span>
                  </span>
                  <span className="text-[12px] text-text-2 flex-none">
                    {t("hod.dashboard.mentorActive")}: {m.active} · {t("hod.dashboard.mentorCompleted")}: {m.completed}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
