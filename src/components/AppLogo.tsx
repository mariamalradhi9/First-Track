import clsx from "clsx";

interface Props {
  size?: number;
  className?: string;
  spin?: boolean; // idle continuous rotation (header/nav usage)
}

// Flat 2D rendition of the Almoayyed mark — burgundy cardinal arrows (inward),
// brushed-silver diagonal arrows (outward), polished-silver core. Colors are
// theme-aware via --mark-cardinal / --mark-diagonal / --mark-core (globals.css).
export function AppLogo({ size = 34, className, spin = false }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={clsx("flex-none", spin && "animate-spin-slow", className)}
      aria-label="Almoayyed Computers"
      role="img"
    >
      <g fill="var(--mark-cardinal)">
        <path d="M50 12 L59 26 L54 26 L54 46 L46 46 L46 26 L41 26 Z" />
        <path d="M50 12 L59 26 L54 26 L54 46 L46 46 L46 26 L41 26 Z" transform="rotate(90 50 50)" />
        <path d="M50 12 L59 26 L54 26 L54 46 L46 46 L46 26 L41 26 Z" transform="rotate(180 50 50)" />
        <path d="M50 12 L59 26 L54 26 L54 46 L46 46 L46 26 L41 26 Z" transform="rotate(270 50 50)" />
      </g>
      <g fill="var(--mark-diagonal)">
        <path d="M50 43 L44 31 L48 31 L48 15 L52 15 L52 31 L56 31 Z" transform="rotate(45 50 50)" />
        <path d="M50 43 L44 31 L48 31 L48 15 L52 15 L52 31 L56 31 Z" transform="rotate(135 50 50)" />
        <path d="M50 43 L44 31 L48 31 L48 15 L52 15 L52 31 L56 31 Z" transform="rotate(225 50 50)" />
        <path d="M50 43 L44 31 L48 31 L48 15 L52 15 L52 31 L56 31 Z" transform="rotate(315 50 50)" />
      </g>
      <circle cx="50" cy="50" r="8.5" fill="var(--mark-core)" />
    </svg>
  );
}
