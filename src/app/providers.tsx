'use client'

import { ThemeProvider } from 'next-themes'
import { usePathname } from 'next/navigation'

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDarkPage = pathname === '/work' || pathname === '/travel'

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      forcedTheme={isDarkPage ? 'dark' : undefined}
    >
      {children}
    </ThemeProvider>
  )
}