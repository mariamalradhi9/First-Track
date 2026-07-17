import { type HTMLAttributes } from "react";
import clsx from "clsx";

export function Card({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx("bg-card border border-card-line rounded-card", className)}
      {...rest}
    >
      {children}
    </div>
  );
}
