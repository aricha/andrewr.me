import { ImageAssetKey, getBlurDataUrl } from '@/types/image-asset'
import { CldImage } from 'next-cloudinary'
import { CSSProperties } from 'react'

interface StickyBackgroundProps {
  image: ImageAssetKey
  hasBlur?: boolean
  imageStyle?: CSSProperties
  blurClassName?: string
  lazy?: boolean
}

export function StickyBackground({
  image,
  hasBlur = false,
  imageStyle,
  blurClassName = "backdrop-blur-md bg-neutral-500/30",
  lazy = false
}: StickyBackgroundProps) {
  const blurDataURL = getBlurDataUrl(image)
  return (
    <div className='absolute top-0 -z-10 h-full w-full'>
      <div className="sticky top-0 w-full h-screen">
        <CldImage 
          src={image} 
          alt="Background" 
          fill 
          sizes='100vw' 
          className='object-cover'
          style={imageStyle}
          loading={lazy ? "lazy" : "eager"}
          placeholder={blurDataURL ? "blur" : "empty"}
          blurDataURL={blurDataURL}
        />
        {hasBlur && <div className={`absolute inset-0 ${blurClassName}`} />}
      </div>
    </div>
  )
} 