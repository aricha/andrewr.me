import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { CldImage } from "next-cloudinary"
import { ImageAssetKey } from "@/types/image-asset"

interface CardProps {
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

export function Card({ className, style, children }: CardProps) {
  return (
    <div className={`rounded-3xl bg-zinc-50/50 dark:bg-zinc-950/40 backdrop-blur-xl ${className}`} style={style}>
      {children}
    </div>
  )
}

export function CardLink({ 
    href, label, imageSrc, imageAlt 
  }: { 
    href: string
    label: string
    imageSrc: ImageAssetKey
    imageAlt: string
  }) {
    return (
      <Link href={href}>
        <Card className="w-full h-full text-2xl aspect-square sm:aspect-auto duration-300 cursor-pointer group overflow-hidden">
          <CldImage
            src={imageSrc} alt={imageAlt} fill
            className="object-cover rounded-xl sm:rounded-3xl group-hover:scale-105 transition-transform ease-out duration-500"
            style={{ objectPosition: '50% 100%' }}
            sizes="(max-width: 768px) 100vw, (max-width: 896px) 50vw, 420px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 w-full p-1 sm:p-2">
            <div className={`inline-flex items-center px-4 py-2 text-2xl font-semibold text-zinc-800 dark:text-zinc-200`}>
              {label}
              <ChevronRight className="h-8 w-8" />
            </div>
          </div>
        </Card>
      </Link>
    )
  }
  