"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { StatCard } from "@/components/ui/StatCard";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { NavIcon } from "@/components/layout/icons";
import { useT, type DictKey } from "@/lib/i18n";
import { useGreeting } from "@/lib/useGreeting";

interface NextStep {
  labelKey: DictKey;
  href: string;
}
interface ActivityItem {
  id: string;
  label: string;
  date: string;
}
interface NextMeeting {
  type: string;
  dueDate: string | null;
}
interface Achievement {
  key: "firstGoal" | "halfway" | "consistentLogger" | "graduate";
  unlocked: boolean;
}

const ACHIEVEMENT_META: Record<Achievement["key"], { icon: string; labelKey: DictKey }> = {
  firstGoal: { icon: "🎯", labelKey: "intern.dashboard.achv.firstGoal" },
  halfway: { icon: "📈", labelKey: "intern.dashboard.achv.halfway" },
  consistentLogger: { icon: "⏱️", labelKey: "intern.dashboard.achv.consistentLogger" },
  graduate: { icon: "🎓", labelKey: "intern.dashboard.achv.graduate" },
};

interface Props {
  name: string;
  department: string;
  projectName: string | null;
  status: string;
  goalCount: number;
  certified: boolean;
  certReady: boolean;
  docsCount: number;
  progressPct: number;
  nextStep: NextStep | null;
  activity: ActivityItem[];
  nextMeeting: NextMeeting | null;
  programDay: number | null;
  programTotalDays: number | null;
  daysRemaining: number | null;
  achievements: Achievement[];
}

export function InternDashboardClient({
  name,
  department,
  projectName,
  goalCount,
  certified,
  certReady,
  docsCount,
  progressPct,
  nextStep,
  activity,
  nextMeeting,
  programDay,
  programTotalDays,
  daysRemaining,
  achievements,
}: Props) {
  const t = useT();
  const greeting = useGreeting();
  const firstName = name.split(" ")[0];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-[26px] sm:text-[30px] font-semibold">
        {greeting ? `${greeting}, ${firstName}` : t("intern.dashboard.title")} <span aria-hidden>👋</span>
      </h1>
      <p className="mt-1.5 text-[14px] text-text-2">{t("intern.dashboard.welcomeBack")}</p>
      <p className="mt-0.5 text-[13px] text-text-3">
        {department}
        {projectName && ` · ${projectName}`}
      </p>

      {programDay !== null && programTotalDays !== null && (
        <Card className="mt-6 p-6 sm:p-7 !bg-[#101b33] text-white border-none">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[16px] font-semibold">
              {t("intern.dashboard.dayLabel")} {programDay} {t("intern.dashboard.ofLabel")} {programTotalDays}
            </p>
            <span className="text-[13px] opacity-80">
              {daysRemaining && daysRemaining > 0 ? `${daysRemaining} ${t("intern.dashboard.daysRemaining")}` : t("intern.dashboard.programComplete")}
            </span>
          </div>
          <div className="mt-4 h-2 rounded-full bg-white/15 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink to-white"
              style={{ width: `${Math.min(100, Math.round((programDay / programTotalDays) * 100))}%` }}
            />
          </div>
        </Card>
      )}

      <Card className="mt-6 p-6 sm:p-7 flex flex-wrap items-center justify-between gap-6 !bg-status-pending-bg/40 border-status-pending-fg/20">
        <div className="max-w-sm">
          <h2 className="text-[19px] font-semibold text-text">{t("intern.dashboard.journeyTitle")}</h2>
          {nextStep ? (
            <>
              <p className="mt-2 text-[15px] font-medium text-text">{t(nextStep.labelKey)}</p>
              <Link href={nextStep.href}>
                <Button size="sm" className="mt-4">
                  {t("intern.dashboard.continueNow")}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.3} className="w-4 h-4 rtl:-scale-x-100">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Button>
              </Link>
            </>
          ) : (
            <>
              <p className="mt-2 text-[15px] font-medium text-text">{t("intern.dashboard.allSet")}</p>
              <p className="mt-1 text-[13px] text-text-2">{t("intern.dashboard.allSetDesc")}</p>
            </>
          )}
        </div>
        <ProgressRing percent={progressPct} label={t("intern.dashboard.completedPct")} />
      </Card>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon="goals"
          tint="bg-[#efe6ff] text-[#7c4dff]"
          value={goalCount}
          label={t("nav.myGoals")}
          description={goalCount === 0 ? t("intern.dashboard.noGoalsYet") : ""}
          action={t("intern.dashboard.setGoals")}
          href="/intern/goals"
        />
        <StatCard
          icon="certificate"
          tint="bg-[#fbe6ee] text-[#c2185b]"
          value={certified ? t("intern.dashboard.certReady") : t("intern.dashboard.certNotAvailable")}
          label={t("nav.certificate")}
          description={certReady ? "" : t("intern.dashboard.certAvailableAfter")}
          action={t("intern.dashboard.viewDetails")}
          href="/intern/certificate"
        />
        <StatCard
          icon="folder"
          tint="bg-[#fff3d6] text-[#b8860b]"
          value={docsCount}
          label={t("intern.dashboard.documents")}
          description={t("intern.dashboard.documentsDesc")}
          action={t("intern.dashboard.viewDocuments")}
          href="/intern/training-documents"
        />
        <Card className="p-5 flex flex-col">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-[#dcf5e6] text-[#1e8e5a]">
            <NavIcon name="calendar" className="w-5 h-5" />
          </div>
          <p className="mt-4 text-[15px] font-semibold text-text">{t("intern.dashboard.nextEvent")}</p>
          <p className="mt-1 text-[13px] font-medium text-status-approved-fg flex-1">
            {nextMeeting
              ? `${nextMeeting.type === "GOAL_SETTING" ? "Goal Setting Meeting" : "Mid-Internship Review"}${
                  nextMeeting.dueDate ? ` — ${format(new Date(nextMeeting.dueDate), "d MMM")}` : ""
                }`
              : t("intern.dashboard.noUpcomingEvents")}
          </p>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
        <ActivityFeed items={activity} />

        <Card className="p-6 flex flex-col justify-center !bg-[#4a1730] text-white border-none relative overflow-hidden">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 opacity-60 mb-2">
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
          </svg>
          <p className="text-[15px] font-medium leading-snug">{t("intern.dashboard.quote")}</p>
          <p className="mt-3 text-[12.5px] opacity-70">— {t("intern.dashboard.quoteAuthor")}</p>
        </Card>
      </div>

      <div className="mt-5">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.6px] text-text-3 mb-3">
          {t("intern.dashboard.achievements")}
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {achievements.map((a) => {
            const meta = ACHIEVEMENT_META[a.key];
            return (
              <span
                key={a.key}
                className={`inline-flex items-center gap-2 h-9 pl-2.5 pr-3.5 rounded-full border text-[13px] font-medium ${
                  a.unlocked
                    ? "bg-card border-card-line text-text"
                    : "bg-field-bg border-transparent text-text-3 opacity-50"
                }`}
              >
                <span aria-hidden>{meta.icon}</span>
                {t(meta.labelKey)}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
