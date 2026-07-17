"use client";

import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n";

export default function BackLink() {
  const router = useRouter();
  const t = useT();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center gap-1.5 text-[13px] text-text-2 hover:text-text transition-colors mb-4"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 rtl:-scale-x-100">
        <path d="m15 18-6-6 6-6" />
      </svg>
      {t("common.back")}
    </button>
  );
}
