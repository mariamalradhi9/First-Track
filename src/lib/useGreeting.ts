"use client";

import { useEffect, useState } from "react";
import { useT } from "./i18n";

export function useGreeting() {
  const t = useT();
  const [hour, setHour] = useState<number | null>(null);
  useEffect(() => setHour(new Date().getHours()), []);
  if (hour === null) return "";
  if (hour < 12) return t("common.greetingMorning");
  if (hour < 18) return t("common.greetingAfternoon");
  return t("common.greetingEvening");
}
