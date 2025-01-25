import { LucideIcon, Github, Instagram, Linkedin, Mail, GraduationCap } from 'lucide-react';

export interface SocialLink {
  href: string;
  icon: LucideIcon;
}

export const socialLinks: SocialLink[] = [
  { href: 'https://github.com/aricha', icon: Github },
  { href: 'https://linkedin.com/in/aricha', icon: Linkedin },
  { href: 'https://instagram.com/andrewgoesto', icon: Instagram },
  { href: 'mailto:hello@andrewr.me', icon: Mail },
  { href: 'http://scholar.google.com/citations?user=h_MTlrAAAAAJ&hl=en', icon: GraduationCap },
];

export function getSocialLinkName(href: string): string {
  if (href.includes('github')) return 'GitHub';
  if (href.includes('linkedin')) return 'LinkedIn';
  if (href.includes('instagram')) return 'Instagram';
  if (href.includes('mailto')) return 'Email';
  if (href.includes('scholar.google')) return 'Google Scholar';
  return 'Link';
} 