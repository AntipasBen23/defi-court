import { useState, useEffect, useCallback } from 'react'
import { WalletState } from '@/lib/types'
import {
  SUPPORTED_NETWORKS,
  DEFAULT_NETWORK,
  ERROR_MESSAGES,
} from '@/lib/constants'

declare global {
  interface Window {
    ethereum?: {
      request: (args: {
        method: string
        params?: unknown[]
      }) => Promise<unknown>
      on: (event: string, callback: (...args: unknown[]) => void) => void
      removeListener: (
        event: string,
        callback: (...args: unknown[]) => void
      ) => void
    }
  }
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: undefined,
    chainId: undefined,
    balance: undefined,
    isCorrectNetwork: false,
  })

  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if wallet is installed
  const isWalletInstalled = useCallback(() => {
    return typeof window !== 'undefined' && Boolean(window.ethereum)
  }, [])

  // Get current account
  const getCurrentAccount = useCallback(async (): Promise<string | null> => {
    if (!isWalletInstalled() || !window.ethereum) return null

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      })
      const accountsArray = Array.isArray(accounts)
        ? (accounts as string[])
        : []
      return accountsArray[0] || null
    } catch (err) {
      console.error('Error getting accounts:', err)
      return null
    }
  }, [isWalletInstalled])

  // Get network ID
  const getNetworkId = useCallback(async (): Promise<number | undefined> => {
    if (!isWalletInstalled() || !window.ethereum) return undefined

    try {
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      })
      const chainIdStr = typeof chainId === 'string' ? chainId : String(chainId)
      return parseInt(chainIdStr, 16)
    } catch (err) {
      console.error('Error getting network:', err)
      return undefined
    }
  }, [isWalletInstalled])

  // Get balance
  const getBalance = useCallback(
    async (address: string): Promise<string> => {
      if (!isWalletInstalled() || !address || !window.ethereum) return '0'

      try {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest'],
        })
        const balanceStr =
          typeof balance === 'string' ? balance : String(balance)
        // Convert from wei to ether (simplified)
        const balanceInEth = parseInt(balanceStr, 16) / Math.pow(10, 18)
        return balanceInEth.toFixed(4)
      } catch (err) {
        console.error('Error getting balance:', err)
        return '0'
      }
    },
    [isWalletInstalled]
  )

  // Connect wallet
  const connect = useCallback(async (): Promise<boolean> => {
    if (!isWalletInstalled()) {
      setError('MetaMask is not installed')
      return false
    }

    if (!window.ethereum) {
      setError('Ethereum provider not found')
      return false
    }

    setIsConnecting(true)
    setError(null)

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      const accountsArray = Array.isArray(accounts)
        ? (accounts as string[])
        : []

      if (accountsArray.length === 0) {
        setError('No accounts found')
        return false
      }

      const address = accountsArray[0]
      const chainId = await getNetworkId()
      const balance = await getBalance(address)
      const isCorrectNetwork = chainId === DEFAULT_NETWORK

      setWallet({
        isConnected: true,
        address,
        chainId,
        balance,
        isCorrectNetwork,
      })

      return true
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : ERROR_MESSAGES.WALLET_NOT_CONNECTED
      setError(errorMessage)
      return false
    } finally {
      setIsConnecting(false)
    }
  }, [isWalletInstalled, getNetworkId, getBalance])

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setWallet({
      isConnected: false,
      address: undefined,
      chainId: undefined,
      balance: undefined,
      isCorrectNetwork: false,
    })
    setError(null)
  }, [])

  // Switch network
  const switchNetwork = useCallback(
    async (networkId: number): Promise<boolean> => {
      if (!isWalletInstalled() || !window.ethereum) return false

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${networkId.toString(16)}` }],
        })
        return true
      } catch (err: unknown) {
        if (err instanceof Error && 'code' in err && err.code === 4902) {
          setError('Network not added to wallet')
        } else {
          const errorMessage =
            err instanceof Error ? err.message : ERROR_MESSAGES.NETWORK_ERROR
          setError(errorMessage)
        }
        return false
      }
    },
    [isWalletInstalled]
  )

  // Update wallet state
  const updateWalletState = useCallback(async () => {
    const address = await getCurrentAccount()

    if (!address) {
      disconnect()
      return
    }

    const chainId = await getNetworkId()
    const balance = await getBalance(address)
    const isCorrectNetwork = chainId
      ? (Object.values(SUPPORTED_NETWORKS) as number[]).includes(chainId)
      : false

    setWallet({
      isConnected: true,
      address,
      chainId,
      balance,
      isCorrectNetwork,
    })
  }, [getCurrentAccount, getNetworkId, getBalance, disconnect])

  // Setup event listeners
  useEffect(() => {
    if (!isWalletInstalled() || !window.ethereum) return

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = Array.isArray(args[0]) ? (args[0] as string[]) : []
      if (accounts.length === 0) {
        disconnect()
      } else {
        updateWalletState()
      }
    }

    const handleChainChanged = () => {
      updateWalletState()
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    // Initial check
    updateWalletState()

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [isWalletInstalled, updateWalletState, disconnect])

  return {
    wallet,
    isConnecting,
    error,
    isWalletInstalled: isWalletInstalled(),
    connect,
    disconnect,
    switchNetwork,
    clearError: () => setError(null),
  }
}
