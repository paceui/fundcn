import { ThemeProvider as NextThemesProvider } from "next-themes"

import { ThemeProvider } from "@/hooks/theme-context"

import type { ReactNode } from "react"
import { Analytics } from "@vercel/analytics/react"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <ThemeProvider>{children}</ThemeProvider>
      <Analytics />
    </NextThemesProvider>
  )
}
