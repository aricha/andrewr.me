'use client'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useScroll, motion, useMotionValueEvent } from 'framer-motion'

export interface NavigationProps {
  scrollContainer?: React.RefObject<HTMLElement>
}

export function Navigation({ scrollContainer }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { scrollY } = useScroll({ container: scrollContainer })
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
  })

  useMotionValueEvent(scrollY, 'change', (latest: number) => {
    setHasScrolled(latest > 10)
  })

  // Don't render theme toggle until mounted
  const renderThemeChanger = () => {
    if (!mounted) return null

    return (
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    )
  }

  return (
    <motion.nav
      className={`fixed top-0 w-full transition-colors duration-300 ease-in-out ${
        hasScrolled ? 'bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md' : 'bg-transparent'
      } z-50`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Andrew Richardson</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link
              href="/work"
              className={`text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white ${
                pathname === '/work' ? 'font-bold' : ''
              }`}
            >
              Work
            </Link>
            <Link
              href="/travel"
              className={`text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white ${
                pathname === '/travel' ? 'font-bold' : ''
              }`}
            >
              Travel
            </Link>
            {renderThemeChanger()}
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
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/work"
              className={`block px-3 py-2 rounded-md text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                pathname === '/work' ? 'font-bold' : ''
              }`}
            >
              Work
            </Link>
            <Link
              href="/travel"
              className={`block px-3 py-2 rounded-md text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                pathname === '/travel' ? 'font-bold' : ''
              }`}
            >
              Travel
            </Link>
          </div>
        </div>
      )}
    </motion.nav>
  )
}