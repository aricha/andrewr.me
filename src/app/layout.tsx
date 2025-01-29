import { Inter } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'
import { getCldOgImageUrl } from 'next-cloudinary'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Andrew Richardson',
  description: 'Portfolio of Andrew Richardson, a software engineer and traveler.',
  icons: {
    icon: { url: '/icon.svg', type: 'image/svg+xml' },
  },
  openGraph: {
    title: 'Andrew Richardson',
    description: 'Portfolio of Andrew Richardson, a software engineer and traveler.',
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