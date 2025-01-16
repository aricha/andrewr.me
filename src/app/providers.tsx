'use client'

import { ThemeProvider } from 'next-themes'
import { Layout } from '@/components/layout/Layout'
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
      <Layout>{children}</Layout>
    </ThemeProvider>
  )
}