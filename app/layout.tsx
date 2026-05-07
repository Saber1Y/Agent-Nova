import type { Metadata } from 'next'
import { Sora } from 'next/font/google'
import './globals.css'
import QueryProvider from '@/components/QueryProvider'

const sora = Sora({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Agent Nova - AI Crypto Intelligence',
  description: 'Real-time AI-powered token analysis and investment insights',
  icons: { icon: '/logo.png' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={sora.className}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
