import { socialLinks } from '@/lib/social-links';
import Link from 'next/link';

export function InlineSocialLinks({ className }: { className?: string }) {
  return (
    <div className={`flex justify-center space-x-6 ${className}`}>
      {socialLinks.map(({ href, icon: Icon }) => (
        <Link key={href} href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <Icon size={24} />
        </Link>
      ))}
    </div>
  )
} 