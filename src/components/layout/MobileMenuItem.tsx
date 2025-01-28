import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface MobileMenuItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  isExternal?: boolean;
}

export function MobileMenuItem({ href, icon: Icon, label, isActive, isExternal }: MobileMenuItemProps) {
  const className = `flex items-center gap-3 py-2 rounded-md text-zinc-700 dark:text-zinc-200 ${isActive ? 'font-bold' : ''}`;
  const MotionLink = motion(isExternal ? 'a' : Link);
  
  return (
    <MotionLink
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={className}
      whileHover={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Icon size={24} />
      </motion.div>
      <span>{label}</span>
    </MotionLink>
  );
} 