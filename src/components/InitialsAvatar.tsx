const PALETTE = [
  { bg: "#efe6ff", fg: "#7c4dff" },
  { bg: "#dcf5e6", fg: "#1e8e5a" },
  { bg: "#fff3d6", fg: "#b8860b" },
  { bg: "#fbe6ee", fg: "#c2185b" },
  { bg: "#e0f2fe", fg: "#0369a1" },
  { bg: "#fde8e0", fg: "#c2410c" },
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  return hash;
}

function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function InitialsAvatar({ name, size = 32 }: { name: string; size?: number }) {
  const { bg, fg } = PALETTE[hashString(name) % PALETTE.length];
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-bold flex-none"
      style={{ width: size, height: size, backgroundColor: bg, color: fg, fontSize: size * 0.36 }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
