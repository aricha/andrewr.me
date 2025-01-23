import Image, { StaticImageData } from 'next/image'
import { CSSProperties } from 'react'

interface StickyBackgroundProps {
  image: StaticImageData
  hasBlur?: boolean
  imageStyle?: CSSProperties
  blurClassName?: string
}

export function StickyBackground({
  image,
  hasBlur = false,
  imageStyle,
  blurClassName = "backdrop-blur-md bg-neutral-500/30"
}: StickyBackgroundProps) {
  return (
    <div className='absolute top-0 -z-10 h-full w-full'>
      <div className="sticky top-0 w-full h-screen">
        <Image 
          src={image} 
          alt="Background" 
          fill 
          sizes='100vw' 
          className='object-cover'
          style={imageStyle} 
        />
        {hasBlur && <div className={`absolute inset-0 ${blurClassName}`} />}
      </div>
    </div>
  )
} 