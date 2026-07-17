import { formatDistanceToNow } from "date-fns";
import { Card } from "./Card";
import { NavIcon } from "@/components/layout/icons";
import type { NavIconName } from "@/lib/nav-config";
import { useT } from "@/lib/i18n";

interface ActivityItem {
  id: string;
  label: string;
  date: string;
}

export function ActivityFeed({ items, icon = "list" }: { items: ActivityItem[]; icon?: NavIconName }) {
  const t = useT();

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-[14px] font-semibold text-text mb-1">{t("common.recentActivity")}</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-[13px] text-text-3">{t("common.noActivity")}</p>
      ) : (
        <div className="mt-4 flex flex-col">
          {items.map((a, i) => (
            <div key={a.id} className="flex gap-3.5">
              <div className="flex flex-col items-center">
                <span className="w-9 h-9 rounded-full flex items-center justify-center bg-wine/10 text-wine flex-none ring-4 ring-card">
                  <NavIcon name={icon} className="w-4 h-4" />
                </span>
                {i < items.length - 1 && <span className="w-px flex-1 bg-line min-h-[14px]" aria-hidden />}
              </div>
              <div className={`min-w-0 flex-1 ${i < items.length - 1 ? "pb-5" : ""}`}>
                <p className="text-[13px] text-text leading-snug">{a.label}</p>
                <p className="mt-0.5 text-[11.5px] text-text-3">{formatDistanceToNow(new Date(a.date), { addSuffix: true })}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
