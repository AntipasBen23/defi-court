import { renderHook, act } from '@testing-library/react'
import { useWallet } from '@/hooks/useWallet'

// Mock window.ethereum
const mockEthereum = {
  request: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
}

// Helper to setup window.ethereum mock
const setupEthereumMock = (isInstalled = true) => {
  if (isInstalled) {
    Object.defineProperty(window, 'ethereum', {
      value: mockEthereum,
      writable: true,
    })
  } else {
    delete (window as unknown as Record<string, unknown>).ethereum
  }
}

describe('useWallet', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    setupEthereumMock(true)
  })

  afterEach(() => {
    delete (window as unknown as Record<string, unknown>).ethereum
  })

  describe('wallet detection', () => {
    it('detects when wallet is installed', () => {
      setupEthereumMock(true)
      const { result } = renderHook(() => useWallet())

      expect(result.current.isWalletInstalled).toBe(true)
    })

    it('detects when wallet is not installed', () => {
      setupEthereumMock(false)
      const { result } = renderHook(() => useWallet())

      expect(result.current.isWalletInstalled).toBe(false)
    })
  })

  describe('wallet connection', () => {
    it('connects wallet successfully', async () => {
      const mockAddress = '0x1234567890123456789012345678901234567890'
      const mockChainId = '0xaa36a7' // Sepolia testnet
      const mockBalance = '0x1bc16d674ec80000' // 2 ETH in wei

      mockEthereum.request
        .mockResolvedValueOnce([mockAddress]) // eth_requestAccounts
        .mockResolvedValueOnce(mockChainId) // eth_chainId
        .mockResolvedValueOnce(mockBalance) // eth_getBalance

      const { result } = renderHook(() => useWallet())

      await act(async () => {
        const success = await result.current.connect()
        expect(success).toBe(true)
      })

      expect(result.current.wallet.isConnected).toBe(true)
      expect(result.current.wallet.address).toBe(mockAddress)
      expect(result.current.wallet.chainId).toBe(11155111) // Sepolia chain ID
      expect(result.current.wallet.balance).toBe('2.0000')
    })

    it('handles connection failure', async () => {
      mockEthereum.request.mockRejectedValueOnce(new Error('User rejected'))

      const { result } = renderHook(() => useWallet())

      await act(async () => {
        const success = await result.current.connect()
        expect(success).toBe(false)
      })

      expect(result.current.wallet.isConnected).toBe(false)
      expect(result.current.error).toBe('User rejected')
    })

    it('handles case when no accounts available', async () => {
      mockEthereum.request.mockResolvedValueOnce([]) // No accounts

      const { result } = renderHook(() => useWallet())

      await act(async () => {
        const success = await result.current.connect()
        expect(success).toBe(false)
      })

      expect(result.current.wallet.isConnected).toBe(false)
      expect(result.current.error).toBe('No accounts found')
    })

    it('sets error when wallet not installed', async () => {
      setupEthereumMock(false)
      const { result } = renderHook(() => useWallet())

      await act(async () => {
        const success = await result.current.connect()
        expect(success).toBe(false)
      })

      expect(result.current.error).toBe('MetaMask is not installed')
    })
  })

  describe('wallet disconnection', () => {
    it('disconnects wallet and clears state', async () => {
      // First connect
      const mockAddress = '0x1234567890123456789012345678901234567890'
      mockEthereum.request
        .mockResolvedValueOnce([mockAddress])
        .mockResolvedValueOnce('0xaa36a7')
        .mockResolvedValueOnce('0x1bc16d674ec80000')

      const { result } = renderHook(() => useWallet())

      await act(async () => {
        await result.current.connect()
      })

      expect(result.current.wallet.isConnected).toBe(true)

      // Then disconnect
      act(() => {
        result.current.disconnect()
      })

      expect(result.current.wallet.isConnected).toBe(false)
      expect(result.current.wallet.address).toBeUndefined()
      expect(result.current.wallet.chainId).toBeUndefined()
      expect(result.current.wallet.balance).toBeUndefined()
      expect(result.current.error).toBeNull()
    })
  })

  describe('network switching', () => {
    it('switches network successfully', async () => {
      mockEthereum.request.mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useWallet())

      await act(async () => {
        const success = await result.current.switchNetwork(1)
        expect(success).toBe(true)
      })

      expect(mockEthereum.request).toHaveBeenCalledWith({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      })
    })

    it('handles network switch failure', async () => {
      const error = new Error('Network switch failed')
      Object.assign(error, { code: 4001 })
      mockEthereum.request.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useWallet())

      await act(async () => {
        const success = await result.current.switchNetwork(1)
        expect(success).toBe(false)
      })

      expect(result.current.error).toBe('Network switch failed')
    })

    it('handles network not added error', async () => {
      const error = new Error('Network not found')
      Object.assign(error, { code: 4902 })
      mockEthereum.request.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useWallet())

      await act(async () => {
        const success = await result.current.switchNetwork(1)
        expect(success).toBe(false)
      })

      expect(result.current.error).toBe('Network not added to wallet')
    })
  })

  describe('network validation', () => {
    it('validates correct network', async () => {
      const mockAddress = '0x1234567890123456789012345678901234567890'
      const mockChainId = '0xaa36a7' // Sepolia testnet (supported)

      mockEthereum.request
        .mockResolvedValueOnce([mockAddress])
        .mockResolvedValueOnce(mockChainId)
        .mockResolvedValueOnce('0x0')

      const { result } = renderHook(() => useWallet())

      await act(async () => {
        await result.current.connect()
      })

      expect(result.current.wallet.isCorrectNetwork).toBe(true)
    })

    it('detects wrong network', async () => {
      const mockAddress = '0x1234567890123456789012345678901234567890'
      const mockChainId = '0x1' // Ethereum mainnet (not default)

      mockEthereum.request
        .mockResolvedValueOnce([mockAddress])
        .mockResolvedValueOnce(mockChainId)
        .mockResolvedValueOnce('0x0')

      const { result } = renderHook(() => useWallet())

      await act(async () => {
        await result.current.connect()
      })

      expect(result.current.wallet.isCorrectNetwork).toBe(false)
    })
  })

  describe('loading states', () => {
    it('shows loading state during connection', async () => {
      let resolvePromise: (value: string[]) => void
      const promise = new Promise<string[]>((resolve) => {
        resolvePromise = resolve
      })

      mockEthereum.request.mockReturnValueOnce(promise)

      const { result } = renderHook(() => useWallet())

      act(() => {
        result.current.connect()
      })

      expect(result.current.isConnecting).toBe(true)

      await act(async () => {
        resolvePromise(['0x1234567890123456789012345678901234567890'])
        await promise
      })

      expect(result.current.isConnecting).toBe(false)
    })
  })

  describe('error handling', () => {
    it('clears error when requested', async () => {
      setupEthereumMock(false)
      const { result } = renderHook(() => useWallet())

      await act(async () => {
        await result.current.connect()
      })

      expect(result.current.error).toBeTruthy()

      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
    })
  })

  describe('event listeners', () => {
    it('sets up event listeners on mount', () => {
      renderHook(() => useWallet())

      expect(mockEthereum.on).toHaveBeenCalledWith(
        'accountsChanged',
        expect.any(Function)
      )
      expect(mockEthereum.on).toHaveBeenCalledWith(
        'chainChanged',
        expect.any(Function)
      )
    })
  })
})
