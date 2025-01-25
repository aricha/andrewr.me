'use client'
import Link from 'next/link'
import { CircleUserRound, Laptop, Menu, Plane, X } from 'lucide-react'
import { useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useScroll, motion, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { InlineSocialLinks } from '../InlineSocialLinks'
import { SocialLinksDropdown } from '../SocialLinksDropdown'
import { MobileMenuItem } from './MobileMenuItem'
import { socialLinks, getSocialLinkName } from '@/lib/social-links'

export type NavBarMaxWidth = 'regular' | 'wide'

export interface NavigationProps {
  navBarMaxWidth?: NavBarMaxWidth
  scrollContainer?: React.RefObject<HTMLDivElement | null>
}

export function Navigation({ navBarMaxWidth = 'regular', scrollContainer }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSocialDropdownOpen, setIsSocialDropdownOpen] = useState(false)
  const socialButtonRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const { scrollY } = useScroll({
    container: scrollContainer, layoutEffect: false
  })
  const [hasScrolled, setHasScrolled] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest: number) => {
    setHasScrolled(latest > 10)
  })
  const wide = navBarMaxWidth === 'wide'

  return (
    <motion.nav
      className="fixed top-0 w-full z-50"
    >
      <motion.div
        className="absolute inset-0 -z-10 border-zinc-200/20 border-b bg-black/40 overflow-y-hidden"
        initial={false}
        animate={{
          opacity: hasScrolled || isMenuOpen ? 1 : 0,
          backdropFilter: `blur(${hasScrolled || isMenuOpen ? 12 : 0}px)`,
        }}
        transition={{ duration: 0.3 }}
        layout
        data-dark-backdrop
      />

      {/* Content */}
      <div className={`page-max-width-${wide ? 'wide' : 'regular'}`}>
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
              <button
                ref={socialButtonRef}
                onClick={() => setIsSocialDropdownOpen(!isSocialDropdownOpen)}
                className="text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white"
              >
                <CircleUserRound size={24} />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded-md text-zinc-700 dark:text-zinc-200"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence mode="popLayout">
          {isMenuOpen && (
            <motion.div
              className="sm:hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="py-2 space-y-1">
                <motion.div
                  className="pb-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <MobileMenuItem
                    href="/work"
                    icon={Laptop}
                    label="Work"
                    isActive={pathname === '/work'}
                  />
                  <MobileMenuItem
                    href="/travel"
                    icon={Plane}
                    label="Travel"
                    isActive={pathname === '/travel'}
                  />
                </motion.div>
                <motion.div
                  className="pt-2 border-t border-zinc-200 dark:border-zinc-300/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {socialLinks.map(({ href, icon }, index) => (
                    <motion.div
                      key={href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + (index * 0.05) }}
                    >
                      <MobileMenuItem
                        href={href}
                        icon={icon}
                        label={getSocialLinkName(href)}
                        isExternal
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <SocialLinksDropdown
          isOpen={isSocialDropdownOpen}
          onClose={() => setIsSocialDropdownOpen(false)}
          anchor={socialButtonRef.current}
        />
      </div>
    </motion.nav>
  )
}