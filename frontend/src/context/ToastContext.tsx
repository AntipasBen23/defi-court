import React, { createContext, useContext, ReactNode } from 'react'
import { ToastContainer } from '@/components/ui/Toast'
import { useToast, Toast } from '@/hooks/useToast'

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearAllToasts: () => void
  success: (title: string, message?: string, duration?: number) => void
  error: (title: string, message?: string, duration?: number) => void
  warning: (title: string, message?: string, duration?: number) => void
  info: (title: string, message?: string, duration?: number) => void
  // Predefined methods
  disputeCreated: () => void
  voteSubmitted: () => void
  stakeSuccessful: () => void
  walletNotConnected: () => void
  transactionFailed: (message?: string) => void
  wrongNetwork: () => void
  insufficientBalance: () => void
  networkError: (message?: string) => void
  invalidAddress: () => void
  fileTooLarge: () => void
  invalidFileType: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToastContext = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const toastHook = useToast()

  return (
    <ToastContext.Provider value={toastHook}>
      {children}
      <ToastContainer
        toasts={toastHook.toasts}
        onClose={toastHook.removeToast}
      />
    </ToastContext.Provider>
  )
}
