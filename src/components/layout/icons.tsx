import type { NavItem } from "@/lib/nav-config";

const strokeProps = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function NavIcon({ name, className }: { name: NavItem["icon"]; className?: string }) {
  switch (name) {
    case "dashboard":
      return (
        <svg viewBox="0 0 24 24" {...strokeProps} className={className}>
          <rect x="3" y="3" width="8" height="9" rx="1.5" />
          <rect x="13" y="3" width="8" height="5" rx="1.5" />
          <rect x="13" y="10" width="8" height="11" rx="1.5" />
          <rect x="3" y="14" width="8" height="7" rx="1.5" />
        </svg>
      );
    case "add":
      return (
        <svg viewBox="0 0 24 24" {...strokeProps} className={className}>
          <circle cx="9" cy="8" r="3.5" />
          <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
          <path d="M18 8v6M15 11h6" />
        </svg>
      );
    case "list":
      return (
        <svg viewBox="0 0 24 24" {...strokeProps} className={className}>
          <circle cx="9" cy="7" r="3.2" />
          <path d="M3 20a6 6 0 0 1 12 0" />
          <path d="M16 8h5M16 12h5M16 16h3" />
        </svg>
      );
    case "university":
      return (
        <svg viewBox="0 0 24 24" {...strokeProps} className={className}>
          <path d="m3 9 9-5 9 5-9 5-9-5Z" />
          <path d="M7 12v5c0 1.1 2.24 2 5 2s5-.9 5-2v-5" />
          <path d="M21 9v6" />
        </svg>
      );
    case "current":
      return (
        <svg viewBox="0 0 24 24" {...strokeProps} className={className}>
          <circle cx="8" cy="8" r="3" />
          <circle cx="16" cy="8" r="3" />
          <path d="M2 20a5 5 0 0 1 6-4.9M22 20a5 5 0 0 0-6-4.9" />
          <path d="M8 20a4.5 4.5 0 0 1 8 0" />
        </svg>
      );
    case "completed":
      return (
        <svg viewBox="0 0 24 24" {...strokeProps} className={className}>
          <path d="M9 12.5 11.2 15 15.5 9" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
    case "goals":
      return (
        <svg viewBox="0 0 24 24" {...strokeProps} className={className}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1" />
        </svg>
      );
    case "feedback":
      return (
        <svg viewBox="0 0 24 24" {...strokeProps} className={className}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "training":
      return (
        <svg viewBox="0 0 24 24" {...strokeProps} className={className}>
          <path d="M2 3h20v14H2z" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      );
    case "users":
      return (
        <svg viewBox="0 0 24 24" {...strokeProps} className={className}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "settings":
      return (
        <svg viewBox="0 0 24 24" {...strokeProps} className={className}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case "profile":
      return (
        <svg viewBox="0 0 24 24" {...strokeProps} className={className}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );
    case "certificate":
      return (
        <svg viewBox="0 0 24 24" {...strokeProps} className={className}>
          <circle cx="12" cy="8" r="5.5" />
          <path d="M8.5 12.8 7 21l5-2.5L17 21l-1.5-8.2" />
        </svg>
      );
    case "closed":
      return (
        <svg viewBox="0 0 24 24" {...strokeProps} className={className}>
          <rect x="3" y="7" width="18" height="14" rx="1.5" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <circle cx="12" cy="14" r="1.5" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 24 24" {...strokeProps} className={className}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      );
    case "folder":
      return (
        <svg viewBox="0 0 24 24" {...strokeProps} className={className}>
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
      );
    case "bell":
      return (
        <svg viewBox="0 0 24 24" {...strokeProps} className={className}>
          <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
          <path d="M9.5 19a2.5 2.5 0 0 0 5 0" />
        </svg>
      );
    default:
      return null;
  }
}
