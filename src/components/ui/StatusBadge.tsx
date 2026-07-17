import clsx from "clsx";

export type StatusTone = "pending" | "approved" | "rejected" | "completed" | "inprogress" | "neutral";

const toneClasses: Record<StatusTone, string> = {
  pending: "bg-status-pending-bg text-status-pending-fg",
  approved: "bg-status-approved-bg text-status-approved-fg",
  rejected: "bg-status-rejected-bg text-status-rejected-fg",
  completed: "bg-status-completed-bg text-status-completed-fg",
  inprogress: "bg-status-inprogress-bg text-status-inprogress-fg",
  neutral: "bg-field-bg text-text-2",
};

// Maps backend enum values to a visual tone. Each pair of statuses that can
// appear together in the same list/tab set is deliberately given a distinct
// tone (e.g. REGISTERED vs ACTIVE, COMPLETED vs CERTIFIED, SHORTLISTED vs
// RECOMMENDED_OTHER_DEPT) — several of these previously resolved to the same
// tone (or tones that render as literally the same color, since "approved"
// and "completed" share identical hex values in globals.css), making
// same-page statuses visually indistinguishable.
export const STATUS_TONE_MAP: Record<string, StatusTone> = {
  SHORTLISTED: "pending",
  HOD_APPROVED: "approved",
  HOD_REJECTED: "rejected",
  RECOMMENDED_OTHER_DEPT: "inprogress",
  UNIVERSITY_CONFIRMED: "inprogress",
  REGISTERED: "pending",
  ACTIVE: "inprogress",
  COMPLETED: "pending",
  CERTIFIED: "approved",
  DEACTIVATED: "neutral",
};

interface Props {
  tone?: StatusTone;
  status?: string;
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ tone, status, children, className }: Props) {
  const resolved = tone ?? (status ? STATUS_TONE_MAP[status] ?? "neutral" : "neutral");
  return (
    <span
      className={clsx(
        "inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-semibold tracking-[0.4px] whitespace-nowrap",
        toneClasses[resolved],
        className
      )}
    >
      {children}
    </span>
  );
}
