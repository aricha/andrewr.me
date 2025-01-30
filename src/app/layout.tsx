import { Inter } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'
import { getCldOgImageUrl } from 'next-cloudinary'
import { Metadata } from 'next'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Andrew Richardson',
  description: 'Portfolio of Andrew Richardson, a software engineer and traveler.',
  icons: {
    icon: [
      { url: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}