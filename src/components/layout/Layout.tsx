'use client'
import { Navigation } from './Navigation'
import { Footer } from './Footer'
import { usePathname } from 'next/navigation'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname()
  const hideNavBar = pathname === '/'

  return (
    <div className={`flex flex-col min-h-screen`}>
      {hideNavBar ? null : <Navigation />}
      <main className="flex-grow">{children}</main>
      {/* <Footer /> */}
    </div>
  )
}
