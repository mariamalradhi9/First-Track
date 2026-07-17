import type { DictKey } from "./i18n";

export type NavIconName =
  | "dashboard"
  | "add"
  | "list"
  | "university"
  | "current"
  | "completed"
  | "goals"
  | "feedback"
  | "training"
  | "users"
  | "settings"
  | "profile"
  | "certificate"
  | "closed"
  | "calendar"
  | "folder"
  | "bell";

export interface NavItem {
  href: string;
  labelKey: DictKey;
  icon: NavIconName;
  group?: DictKey;
}

export const HR_NAV: NavItem[] = [
  { href: "/hr/dashboard", labelKey: "nav.dashboard", icon: "dashboard", group: "nav.group.main" },
  { href: "/hr/shortlisted/new", labelKey: "nav.addShortlisted", icon: "add", group: "nav.group.applications" },
  { href: "/hr/shortlisted", labelKey: "nav.shortlisted", icon: "list", group: "nav.group.applications" },
  { href: "/hr/by-university", labelKey: "nav.byUniversity", icon: "university", group: "nav.group.applications" },
  { href: "/hr/university-interns", labelKey: "nav.universityInterns", icon: "university", group: "nav.group.applications" },
  { href: "/hr/current", labelKey: "nav.current", icon: "current", group: "nav.group.interns" },
  { href: "/hr/completed", labelKey: "nav.completed", icon: "completed", group: "nav.group.interns" },
];

export const HOD_NAV: NavItem[] = [
  { href: "/hod/dashboard", labelKey: "nav.dashboard", icon: "dashboard", group: "nav.group.main" },
  { href: "/hod/shortlisted", labelKey: "nav.hodShortlisted", icon: "list", group: "nav.group.applications" },
  { href: "/hod/current", labelKey: "nav.current", icon: "current", group: "nav.group.interns" },
  { href: "/hod/completed", labelKey: "nav.completed", icon: "completed", group: "nav.group.interns" },
  { href: "/hod/closed", labelKey: "nav.closed", icon: "closed", group: "nav.group.interns" },
  { href: "/hod/training-documents", labelKey: "nav.trainingDocs", icon: "training", group: "nav.group.resources" },
  { href: "/hod/feedback", labelKey: "nav.feedback", icon: "feedback", group: "nav.group.resources" },
];

export const MENTOR_NAV: NavItem[] = [
  { href: "/mentor/dashboard", labelKey: "nav.dashboard", icon: "dashboard", group: "nav.group.main" },
  { href: "/mentor/goals", labelKey: "nav.manageGoals", icon: "goals", group: "nav.group.management" },
  { href: "/mentor/midterm", labelKey: "nav.midterm", icon: "current", group: "nav.group.management" },
  { href: "/mentor/final-remarks", labelKey: "nav.finalRemarks", icon: "completed", group: "nav.group.management" },
  { href: "/mentor/training-documents", labelKey: "nav.trainingDocs", icon: "training", group: "nav.group.documents" },
];

export const INTERN_NAV: NavItem[] = [
  { href: "/intern/dashboard", labelKey: "nav.dashboard", icon: "dashboard", group: "nav.group.main" },
  { href: "/intern/profile", labelKey: "nav.profile", icon: "profile", group: "nav.group.main" },
  { href: "/intern/announcements", labelKey: "nav.announcements", icon: "bell", group: "nav.group.main" },
  { href: "/intern/questionnaire", labelKey: "nav.questionnaire", icon: "list", group: "nav.group.internship" },
  { href: "/intern/goals", labelKey: "nav.myGoals", icon: "goals", group: "nav.group.internship" },
  { href: "/intern/feedback", labelKey: "nav.postFeedback", icon: "feedback", group: "nav.group.internship" },
  { href: "/intern/certificate", labelKey: "nav.certificate", icon: "certificate", group: "nav.group.internship" },
  { href: "/intern/training-documents", labelKey: "nav.trainingDocs", icon: "training", group: "nav.group.documents" },
];

export const CEO_NAV: NavItem[] = [
  { href: "/ceo/dashboard", labelKey: "nav.dashboard", icon: "dashboard", group: "nav.group.main" },
  { href: "/ceo/interns", labelKey: "nav.allInterns", icon: "list", group: "nav.group.interns" },
  { href: "/ceo/feedback", labelKey: "nav.feedback", icon: "feedback", group: "nav.group.feedback" },
  { href: "/ceo/feedback/statistics", labelKey: "nav.feedbackStats", icon: "goals", group: "nav.group.feedback" },
];

export const ADMIN_NAV: NavItem[] = [
  { href: "/admin/dashboard", labelKey: "nav.dashboard", icon: "dashboard", group: "nav.group.main" },
  { href: "/admin/users", labelKey: "nav.manageUsers", icon: "users", group: "nav.group.main" },
  { href: "/admin/departments", labelKey: "nav.manageDepartments", icon: "university", group: "nav.group.masterData" },
  { href: "/admin/training-topics", labelKey: "nav.manageTopics", icon: "training", group: "nav.group.masterData" },
  { href: "/admin/nationalities", labelKey: "nav.manageNationalities", icon: "list", group: "nav.group.masterData" },
  { href: "/admin/settings/email-notifications", labelKey: "nav.emailSettings", icon: "settings", group: "nav.group.settings" },
];
