"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { ThemeLangProvider } from "@/lib/theme-lang";
import { ToastProvider } from "@/components/ui/Toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeLangProvider>
        <ToastProvider>{children}</ToastProvider>
      </ThemeLangProvider>
    </SessionProvider>
  );
}
