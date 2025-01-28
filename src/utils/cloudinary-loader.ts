import { constructCloudinaryUrl } from '@cloudinary-util/url-loader'

export default function cloudinaryLoader({ src, width, quality }: { 
  src: string, width: number, quality: number 
}) {
  // Check if it's an SVG
  if (src.endsWith('.svg')) {
    // Use default Next.js loader behavior for SVGs
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`
  }

  // Remove any leading slash from src
  const cleanSrc = src.replace(/^\//, '')
  
  const url = constructCloudinaryUrl({
    options: {
      src: cleanSrc,
      width: width,
      quality: quality || 75,
    },
    config: {
      cloud: {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      },
    },
    analytics: false
  })

  return url
}