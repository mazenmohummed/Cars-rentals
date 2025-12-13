"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/providers/theme-provider";
import { SessionProvider } from "next-auth/react";

export function Providers({ children, session }: { children: ReactNode; session?: any }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SessionProvider session={session}>
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
}
