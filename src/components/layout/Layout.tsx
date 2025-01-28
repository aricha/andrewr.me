'use client'
import { Navigation, NavBarMaxWidth } from './Navigation'
import { usePathname } from 'next/navigation'

interface LayoutProps {
  children: React.ReactNode
  scrollContainer?: React.RefObject<HTMLDivElement | null>
  navBarMaxWidth?: NavBarMaxWidth
}

export function Layout({ children, scrollContainer, navBarMaxWidth = 'regular' }: LayoutProps) {
  const pathname = usePathname()
  const hideNavBar = pathname === '/'

  return (
    <div className={`flex flex-col min-h-screen`}>
      {hideNavBar ? null : <Navigation navBarMaxWidth={navBarMaxWidth} scrollContainer={scrollContainer} />}
      <main className="flex-grow">{children}</main>
      {/* <Footer /> */}
    </div>
  )
}
