import clsx from "clsx";

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("skeleton rounded-md", className)} />;
}

export function SkeletonRows({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-3.5 border-b border-line last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
