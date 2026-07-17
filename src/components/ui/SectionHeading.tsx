import { NavIcon } from "@/components/layout/icons";
import type { NavItem } from "@/lib/nav-config";

export function SectionHeading({ icon, children, className }: { icon: NavItem["icon"]; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#e0f2fe] text-[#0369a1] flex-none">
        <NavIcon name={icon} className="w-3.5 h-3.5" />
      </span>
      <h2 className="text-[13px] font-semibold uppercase tracking-[0.6px] text-text-3">{children}</h2>
    </div>
  );
}
