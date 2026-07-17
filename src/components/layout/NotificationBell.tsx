"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import clsx from "clsx";
import { useT } from "@/lib/i18n";
import { getMyNotifications, markAllNotificationsRead, markNotificationRead, type NotificationItem } from "@/lib/notificationActions";

export function NotificationBell() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMyNotifications().then((data) => {
      setItems(data);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const unreadCount = items.filter((i) => !i.read).length;

  function handleOpen() {
    setOpen((v) => !v);
  }

  function handleItemClick(item: NotificationItem) {
    if (item.read) return;
    setItems((rows) => rows.map((r) => (r.id === item.id ? { ...r, read: true } : r)));
    startTransition(async () => {
      await markNotificationRead(item.id);
    });
  }

  function handleMarkAll() {
    setItems((rows) => rows.map((r) => ({ ...r, read: true })));
    startTransition(async () => {
      await markAllNotificationsRead();
    });
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={handleOpen}
        className="relative inline-flex items-center justify-center w-[38px] h-[38px] rounded-full border border-ctrl-line bg-ctrl-bg text-text-2 hover:text-text transition-colors"
        aria-label={t("common.notifications")}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-4 h-4">
          <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
          <path d="M9.5 19a2.5 2.5 0 0 0 5 0" />
        </svg>
        {loaded && unreadCount > 0 && (
          <span className="absolute -top-0.5 -end-0.5 min-w-[16px] h-4 px-1 rounded-full bg-wine text-white text-[9.5px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute end-0 mt-2 w-80 max-w-[90vw] bg-bg-solid border border-card-line rounded-float shadow-2xl py-2 z-[70]">
          <div className="flex items-center justify-between px-3.5 py-2 border-b border-line mb-1">
            <p className="text-[13.5px] font-semibold text-text">{t("common.notifications")}</p>
            {unreadCount > 0 && (
              <button type="button" onClick={handleMarkAll} className="text-[11.5px] font-semibold text-wine hover:opacity-80 transition-opacity">
                {t("common.markAllRead")}
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <p className="px-3.5 py-6 text-center text-[13px] text-text-3">{t("common.noNotifications")}</p>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className={clsx(
                    "w-full text-start px-3.5 py-2.5 flex items-start gap-2.5 hover:bg-field-bg transition-colors",
                    !item.read && "bg-wine/[0.05]"
                  )}
                >
                  <span
                    className={clsx("mt-1.5 w-1.5 h-1.5 rounded-full flex-none", !item.read ? "bg-wine" : "bg-transparent")}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold text-text truncate">{item.subject}</span>
                    {item.body && <span className="block mt-0.5 text-[12px] text-text-2 line-clamp-2">{item.body}</span>}
                    <span className="block mt-0.5 text-[11px] text-text-3">
                      {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
