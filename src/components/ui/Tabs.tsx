"use client";

import { useState, type ReactNode } from "react";
import clsx from "clsx";

export interface TabItem {
  key: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export function Tabs({ items, defaultKey }: { items: TabItem[]; defaultKey?: string }) {
  const [active, setActive] = useState(defaultKey ?? items[0]?.key);
  const activeItem = items.find((i) => i.key === active);

  return (
    <div>
      <div className="flex items-center gap-1 border-b border-line overflow-x-auto">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            disabled={item.disabled}
            onClick={() => setActive(item.key)}
            className={clsx(
              "relative px-4 py-3 text-[13.5px] font-medium whitespace-nowrap transition-colors disabled:opacity-40 disabled:pointer-events-none",
              active === item.key ? "text-wine" : "text-text-2 hover:text-text"
            )}
          >
            {item.label}
            {active === item.key && <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-wine rounded-full" />}
          </button>
        ))}
      </div>
      <div className="pt-5">{activeItem?.content}</div>
    </div>
  );
}
