'use client'
import Link from 'next/link'
import { Laptop, Menu, Plane, X } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useScroll, motion, useMotionValueEvent } from 'framer-motion'
import { SocialLinks } from '../SocialLinks'

export interface NavigationProps {
  scrollContainer?: React.RefObject<HTMLDivElement | null>
}

export function Navigation({ scrollContainer }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { scrollY } = useScroll({
    container: scrollContainer, layoutEffect: false
  })
  const [hasScrolled, setHasScrolled] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest: number) => {
    setHasScrolled(latest > 10)
  })

  return (
    <motion.nav
      className={`fixed top-0 w-full transition-colors duration-300 ease-in-out z-50 ${hasScrolled || isMenuOpen ? 'bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md' : 'bg-transparent'
        }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Andrew Richardson</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="flex items-center sm:space-x-8">
            <div className="hidden sm:flex sm:items-center sm:space-x-8">
              <Link
                href="/work"
                className={`text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white ${pathname === '/work' ? 'font-bold' : ''
                  }`}
              >
                Work
              </Link>
              <Link
                href="/travel"
                className={`text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white ${pathname === '/travel' ? 'font-bold' : ''
                  }`}
              >
                Travel
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-zinc-700 dark:text-zinc-200"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                href="/work"
                className={`flex items-center gap-3 py-2 rounded-md text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 ${pathname === '/work' ? 'font-bold' : ''
                  }`}
              >
                <Laptop size={24} />
                Work
              </Link>
              <Link
                href="/travel"
                className={`flex items-center gap-3 py-2 rounded-md text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 ${pathname === '/travel' ? 'font-bold' : ''
                  }`}
              >
                <Plane size={24} />
                Travel
              </Link>
              <SocialLinks className="pt-4" />
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  )
}