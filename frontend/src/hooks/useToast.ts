import { useState, useCallback } from 'react'
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/lib/constants'

export interface Toast {
  id: string
  title: string
  message?: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2)
    setToasts((prev) => [...prev, { ...toast, id }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  // Helper methods with predefined messages
  const success = useCallback(
    (title: string, message?: string, duration?: number) => {
      addToast({
        title,
        message,
        type: 'success',
        duration: duration || 5000,
      })
    },
    [addToast]
  )

  const error = useCallback(
    (title: string, message?: string, duration?: number) => {
      addToast({
        title,
        message,
        type: 'error',
        duration: duration || 7000,
      })
    },
    [addToast]
  )

  const warning = useCallback(
    (title: string, message?: string, duration?: number) => {
      addToast({
        title,
        message,
        type: 'warning',
        duration: duration || 6000,
      })
    },
    [addToast]
  )

  const info = useCallback(
    (title: string, message?: string, duration?: number) => {
      addToast({
        title,
        message,
        type: 'info',
        duration: duration || 5000,
      })
    },
    [addToast]
  )

  // Predefined toast methods for common actions
  const disputeCreated = useCallback(() => {
    success('Dispute Created', SUCCESS_MESSAGES.DISPUTE_CREATED)
  }, [success])

  const voteSubmitted = useCallback(() => {
    success('Vote Submitted', SUCCESS_MESSAGES.VOTE_SUBMITTED)
  }, [success])

  const stakeSuccessful = useCallback(() => {
    success('Stake Successful', SUCCESS_MESSAGES.STAKE_SUCCESSFUL)
  }, [success])

  const walletNotConnected = useCallback(() => {
    error('Wallet Required', ERROR_MESSAGES.WALLET_NOT_CONNECTED)
  }, [error])

  const transactionFailed = useCallback(
    (message?: string) => {
      error('Transaction Failed', message || ERROR_MESSAGES.TRANSACTION_FAILED)
    },
    [error]
  )

  const wrongNetwork = useCallback(() => {
    warning('Wrong Network', ERROR_MESSAGES.WRONG_NETWORK)
  }, [warning])

  const insufficientBalance = useCallback(() => {
    error('Insufficient Balance', ERROR_MESSAGES.INSUFFICIENT_BALANCE)
  }, [error])

  // Network-related toasts
  const networkError = useCallback(
    (message?: string) => {
      error('Network Error', message || ERROR_MESSAGES.NETWORK_ERROR)
    },
    [error]
  )

  // Form validation toasts
  const invalidAddress = useCallback(() => {
    error('Invalid Address', ERROR_MESSAGES.INVALID_ADDRESS)
  }, [error])

  const fileTooLarge = useCallback(() => {
    error('File Too Large', ERROR_MESSAGES.FILE_TOO_LARGE)
  }, [error])

  const invalidFileType = useCallback(() => {
    error('Invalid File Type', ERROR_MESSAGES.INVALID_FILE_TYPE)
  }, [error])

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    // Basic methods
    success,
    error,
    warning,
    info,
    // Predefined methods
    disputeCreated,
    voteSubmitted,
    stakeSuccessful,
    walletNotConnected,
    transactionFailed,
    wrongNetwork,
    insufficientBalance,
    networkError,
    invalidAddress,
    fileTooLarge,
    invalidFileType,
  }
}
