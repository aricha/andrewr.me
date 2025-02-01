import { Inter } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'
import { getCldOgImageUrl } from 'next-cloudinary'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Metadata, Viewport } from 'next'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Andrew Richardson',
  description: 'Portfolio of Andrew Richardson, a software engineer and traveler.',
  icons: {
    icon: [
      { url: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
  },
  openGraph: {
    images: [
      {
        url: getCldOgImageUrl({
          src: 'home/profile',
          width: 1200,
          height: 630,
          crop: 'fill',
        }),
        alt: 'Andrew Richardson',
      }
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className='snap-y snap-mandatory dark'>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}