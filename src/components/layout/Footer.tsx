'use client'

export function Footer({ className }: { className?: string }) {
  const currentYear = new Date().getFullYear()
  
  return (
    <div className={`w-full text-center text-xs text-zinc-100/40 ${className}`}>
      <p>© {currentYear} Andrew Richardson. All rights reserved.</p>
    </div>
  )
}