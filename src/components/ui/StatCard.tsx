import Link from "next/link";
import { Card } from "./Card";
import { Button } from "./Button";
import { NavIcon } from "@/components/layout/icons";
import type { NavIconName } from "@/lib/nav-config";

interface Props {
  icon: NavIconName;
  tint: string;
  value: string | number;
  label: string;
  description?: string;
  action?: string;
  href?: string;
}

export function StatCard({ icon, tint, value, label, description, action, href }: Props) {
  return (
    <Card className="p-5 flex flex-col items-center text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-20px_rgba(0,0,0,0.5)]">
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-200 ${tint}`}>
        <NavIcon name={icon} className="w-5 h-5" />
      </div>
      <p className="mt-4 text-[22px] font-bold text-text leading-none">{value}</p>
      <p className="mt-1.5 text-[13.5px] font-semibold text-text">{label}</p>
      {description && <p className="mt-1 text-[12px] text-text-3">{description}</p>}
      {action && href && (
        <Link href={href} className="mt-4 sm:w-auto">
          <Button size="sm" variant="secondary" className="px-7">
            {action}
          </Button>
        </Link>
      )}
    </Card>
  );
}
