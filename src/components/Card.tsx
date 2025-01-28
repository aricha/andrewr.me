import { LucideIcon, ChevronRight } from "lucide-react"
import Link from "next/link"
import { CldImage } from "next-cloudinary"

export function Card({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={`rounded-3xl bg-zinc-50/50 dark:bg-zinc-950/40 backdrop-blur-xl ${className}`}>
      {children}
    </div>
  )
}

export function CardLink({ 
    href, icon: Icon, label, imageSrc, imageAlt 
  }: { 
    href: string
    icon: LucideIcon
    label: string
    imageSrc: string
    imageAlt: string
  }) {
    return (
      <Link href={href}>
        <Card className="w-full h-full text-2xl aspect-[5/4] sm:aspect-auto hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
          <CldImage
            src={imageSrc} alt={imageAlt} fill
            className="object-cover rounded-xl sm:rounded-3xl"
            style={{ objectPosition: '50% 100%' }}
            sizes="(max-width: 768px) 100vw, (max-width: 896px) 50vw, 420px"
          />
          <div className="absolute bottom-0 w-full rounded-b-xl sm:rounded-b-3xl bg-zinc-50/50 dark:bg-zinc-950/20 backdrop-blur-xl p-1 sm:p-2">
            <div className={`inline-flex items-center px-2 sm:py-2 text-lg sm:text-2xl font-semibold text-zinc-800 dark:text-zinc-200`}>
              <Icon className="mr-2 h-4 sm:h-8 w-4 sm:w-8" />
              {label}
              <ChevronRight className="h-5 sm:h-8 w-5 sm:w-8" />
            </div>
          </div>
        </Card>
      </Link>
    )
  }
  