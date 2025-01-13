'use client'
import { Navigation } from './Navigation'
import { Footer } from './Footer'
import { usePathname } from 'next/navigation'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname()
  const isDarkPage = pathname === '/work'

  return (
    <div className={`min-h-screen flex flex-col ${isDarkPage ? 'dark' : ''}`}>
      <Navigation />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}
