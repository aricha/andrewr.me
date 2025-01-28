import { motion, AnimatePresence } from 'framer-motion';
import { socialLinks, getSocialLinkName } from '@/lib/social-links';
import Link from 'next/link';

interface SocialLinksDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  anchor: HTMLElement | null;
}

export function SocialLinksDropdown({ isOpen, onClose, anchor }: SocialLinksDropdownProps) {
  if (!anchor) return null;

  const rect = anchor.getBoundingClientRect();

  return (
    <>
      <AnimatePresence mode="sync">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.001 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
            className="fixed inset-0 z-[100]"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: rect.bottom + 8,
              right: window.innerWidth - rect.right,
              transformOrigin: 'top right',
            }}
            className="z-[100] w-64 p-2 rounded-xl bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl border border-zinc-200/20 shadow-lg"
          >
            <div className="py-1">
              {socialLinks.map(({ href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors"
                >
                  <Icon size={20} />
                  <span>{getSocialLinkName(href)}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 