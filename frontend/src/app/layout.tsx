import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import { WalletProvider } from '@/context/WalletContext'
import { ToastProvider } from '@/context/ToastContext'
import { Header } from '@/components/layout/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DeFi Court - Decentralized Dispute Resolution',
  description:
    'A fully decentralized dispute resolution protocol for DeFi transactions, governed by stake-weighted jurors and verifiable on-chain proofs.',
  keywords: ['DeFi', 'dispute resolution', 'blockchain', 'arbitration', 'Web3'],
  authors: [{ name: 'DeFi Court Team' }],
  openGraph: {
    title: 'DeFi Court - Decentralized Dispute Resolution',
    description:
      'Resolve DeFi disputes through decentralized arbitration with stake-weighted jurors.',
    url: 'https://defi-court.com',
    siteName: 'DeFi Court',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DeFi Court - Decentralized Dispute Resolution',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DeFi Court - Decentralized Dispute Resolution',
    description:
      'Resolve DeFi disputes through decentralized arbitration with stake-weighted jurors.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} antialiased bg-gray-900 text-white`}>
        <ToastProvider>
          <WalletProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <footer className="border-t border-gray-800 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 py-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">
                        DeFi Court
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Decentralized dispute resolution for the DeFi ecosystem.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-3">Platform</h4>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li>
                          <Link href="/disputes" className="hover:text-white">
                            Browse Disputes
                          </Link>
                        </li>
                        <li>
                          <Link href="/juror" className="hover:text-white">
                            Become a Juror
                          </Link>
                        </li>
                        <li>
                          <Link href="/governance" className="hover:text-white">
                            Governance
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-3">Resources</h4>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li>
                          <Link href="/docs" className="hover:text-white">
                            Documentation
                          </Link>
                        </li>
                        <li>
                          <Link href="/whitepaper" className="hover:text-white">
                            Whitepaper
                          </Link>
                        </li>
                        <li>
                          <Link href="/api" className="hover:text-white">
                            API
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-3">Community</h4>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li>
                          <a
                            href="https://discord.gg/defi-court"
                            className="hover:text-white"
                          >
                            Discord
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://twitter.com/defi-court"
                            className="hover:text-white"
                          >
                            Twitter
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://github.com/defi-court"
                            className="hover:text-white"
                          >
                            GitHub
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">
                      © 2024 DeFi Court. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 sm:mt-0">
                      <Link
                        href="/privacy"
                        className="text-gray-400 hover:text-white text-sm"
                      >
                        Privacy Policy
                      </Link>
                      <Link
                        href="/terms"
                        className="text-gray-400 hover:text-white text-sm"
                      >
                        Terms of Service
                      </Link>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </WalletProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
