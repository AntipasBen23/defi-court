import React, { useState } from 'react'
import Link from 'next/link'
import { useWalletContext } from '@/context/WalletContext'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatAddress } from '@/lib/utils'

export const Header: React.FC = () => {
  const { wallet, connect, disconnect, isConnecting } = useWalletContext()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/disputes', label: 'Disputes' },
    { href: '/juror', label: 'Juror' },
    { href: '/governance', label: 'Governance' },
  ]

  const handleWalletClick = () => {
    if (wallet.isConnected) {
      disconnect()
    } else {
      connect()
    }
  }

  return (
    <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">DC</span>
            </div>
            <span className="text-xl font-bold text-white">DeFi Court</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {wallet.isConnected && !wallet.isCorrectNetwork && (
              <Badge variant="warning" size="sm">
                Wrong Network
              </Badge>
            )}

            <Button
              onClick={handleWalletClick}
              loading={isConnecting}
              variant={wallet.isConnected ? 'outline' : 'primary'}
              size="sm"
            >
              {wallet.isConnected
                ? formatAddress(wallet.address!)
                : 'Connect Wallet'}
            </Button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? 'M6 18L18 6M6 6l12 12'
                      : 'M4 6h16M4 12h16M4 18h16'
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Wallet Info Bar */}
      {wallet.isConnected && (
        <div className="bg-gray-800 border-t border-gray-700 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4 text-gray-400">
              <span>Balance: {wallet.balance} ETH</span>
              {wallet.chainId && <span>Network: {wallet.chainId}</span>}
            </div>
            <Badge
              variant={wallet.isCorrectNetwork ? 'success' : 'warning'}
              size="sm"
            >
              {wallet.isCorrectNetwork ? 'Connected' : 'Wrong Network'}
            </Badge>
          </div>
        </div>
      )}
    </header>
  )
}
