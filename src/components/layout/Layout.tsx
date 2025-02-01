'use client'
import { Navigation, NavBarMaxWidth } from './Navigation'
import { usePathname } from 'next/navigation'

interface LayoutProps {
  children: React.ReactNode
  navBarMaxWidth?: NavBarMaxWidth
}

export function Layout({ children, navBarMaxWidth = 'regular' }: LayoutProps) {
  const pathname = usePathname()
  const hideNavBar = pathname === '/'

  return (
    <>
      {hideNavBar ? null : <Navigation navBarMaxWidth={navBarMaxWidth} />}
      <main>
        {children}
      </main>
    </>
  )
}
