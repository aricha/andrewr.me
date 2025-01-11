'use client'

import { ThemeProvider } from 'next-themes'
import { Layout } from '@/components/layout/Layout'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Layout>{children}</Layout>
    </ThemeProvider>
  )
}