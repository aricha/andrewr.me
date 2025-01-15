import { Github, Instagram, Linkedin, LucideIcon, Mail } from 'lucide-react'

interface SocialLink {
  href: string
  icon: LucideIcon
}

const socialLinks: SocialLink[] = [
  { href: 'https://github.com/aricha', icon: Github },
  { href: 'https://linkedin.com/in/aricha', icon: Linkedin },
  { href: 'https://instagram.com/andrewgoesto', icon: Instagram },
  { href: 'mailto:hello@andrewr.me', icon: Mail },
]

export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={`flex justify-center space-x-6 ${className}`}>
      {socialLinks.map(({ href, icon: Icon }) => (
        <a key={href} href={href}
          className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <Icon size={24} />
        </a>
      ))}
    </div>
  )
} 