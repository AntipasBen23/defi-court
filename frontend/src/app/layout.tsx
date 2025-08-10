import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
})

export const metadata: Metadata = {
  title: 'DeFi Court - Decentralized Dispute Resolution',
  description:
    'A decentralized dispute resolution protocol for DeFi transactions with stake-weighted jurors and on-chain governance.',
  keywords: [
    'DeFi',
    'dispute resolution',
    'arbitration',
    'blockchain',
    'decentralized court',
  ],
  authors: [{ name: 'DeFi Court Team' }],
  openGraph: {
    title: 'DeFi Court - Decentralized Dispute Resolution',
    description: 'Resolve DeFi disputes through decentralized arbitration',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DeFi Court - Decentralized Dispute Resolution',
    description: 'Resolve DeFi disputes through decentralized arbitration',
  },
  robots: 'index, follow',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-white antialiased`}>
        <div className="min-h-screen flex flex-col">
          {/* Global providers will be added here */}
          <div id="modal-root" />
          <div id="toast-root" />
          {children}
        </div>
      </body>
    </html>
  )
}
