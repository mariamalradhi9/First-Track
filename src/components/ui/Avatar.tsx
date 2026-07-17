import clsx from "clsx";

interface Props {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = { sm: "w-7 h-7 text-[11px]", md: "w-9 h-9 text-[13px]", lg: "w-14 h-14 text-[18px]" };

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function Avatar({ name, src, size = "md", className }: Props) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} className={clsx("rounded-full object-cover", sizes[size], className)} />;
  }
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center rounded-full bg-wine/15 text-wine font-semibold flex-none",
        sizes[size],
        className
      )}
    >
      {initials(name)}
    </span>
  );
}
