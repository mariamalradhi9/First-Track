"use client";

import { format } from "date-fns";
import BackLink from "@/components/BackLink";
import { Card } from "@/components/ui/Card";
import { InitialsAvatar } from "@/components/InitialsAvatar";

interface Item {
  label: string;
  value: string;
}

export function CeoFeedbackDetailClient({
  name,
  department,
  submittedAt,
  items,
}: {
  name: string;
  department: string;
  submittedAt: string;
  items: Item[];
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <BackLink />
      <div className="flex items-center gap-3.5">
        <InitialsAvatar name={name} size={44} />
        <h1 className="text-[24px] sm:text-[28px] font-semibold">{name}</h1>
      </div>
      <p className="mt-1.5 ms-[59px] text-[14px] text-text-2">
        {department} · Submitted {format(new Date(submittedAt), "d MMM yyyy")}
      </p>

      <Card className="mt-6 p-5 sm:p-7 flex flex-col gap-5">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-text-3">{item.label}</p>
            <p className="mt-1.5 text-[14px] text-text">{item.value}</p>
          </div>
        ))}
      </Card>
    </div>
  );
}
