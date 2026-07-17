"use client";

import { format } from "date-fns";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { NavIcon } from "@/components/layout/icons";
import { useT } from "@/lib/i18n";

interface Item {
  id: string;
  subject: string;
  body: string;
  date: string;
}

export function AnnouncementsClient({ items }: { items: Item[] }) {
  const t = useT();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-[26px] sm:text-[30px] font-semibold">{t("intern.announcements.title")}</h1>
      <p className="mt-1.5 text-[14px] text-text-2">{t("intern.announcements.lede")}</p>

      {items.length === 0 ? (
        <div className="mt-6">
          <EmptyState title={t("intern.announcements.empty")} />
        </div>
      ) : (
        <Card className="mt-6 p-5 sm:p-6">
          <div className="flex flex-col">
            {items.map((item, i) => (
              <div key={item.id} className="flex gap-3.5">
                <div className="flex flex-col items-center">
                  <span className="w-9 h-9 rounded-full flex items-center justify-center bg-wine/10 text-wine flex-none ring-4 ring-card">
                    <NavIcon name="bell" className="w-4 h-4" />
                  </span>
                  {i < items.length - 1 && <span className="w-px flex-1 bg-line min-h-[14px]" aria-hidden />}
                </div>
                <div className={`min-w-0 flex-1 ${i < items.length - 1 ? "pb-5" : ""}`}>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <p className="text-[14px] font-semibold text-text">{item.subject}</p>
                    <span className="text-[12px] text-text-3">{format(new Date(item.date), "d MMM yyyy")}</span>
                  </div>
                  {item.body && <p className="mt-1 text-[13px] text-text-2">{item.body}</p>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
