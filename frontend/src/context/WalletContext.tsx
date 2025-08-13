import React, { createContext, useContext, ReactNode } from 'react'
import { useWallet } from '@/hooks/useWallet'

interface WalletContextType {
  wallet: {
    isConnected: boolean
    address?: string
    chainId?: number
    balance?: string
    isCorrectNetwork: boolean
  }
  isConnecting: boolean
  error: string | null
  isWalletInstalled: boolean
  connect: () => Promise<boolean>
  disconnect: () => void
  switchNetwork: (networkId: number) => Promise<boolean>
  clearError: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const useWalletContext = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWalletContext must be used within WalletProvider')
  }
  return context
}

interface WalletProviderProps {
  children: ReactNode
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const walletHook = useWallet()

  return (
    <WalletContext.Provider value={walletHook}>
      {children}
    </WalletContext.Provider>
  )
}
