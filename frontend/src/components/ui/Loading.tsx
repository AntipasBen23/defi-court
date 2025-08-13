import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Spinner: React.FC<LoadingProps> = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-600 border-t-blue-500',
        sizes[size],
        className
      )}
    />
  )
}

export const LoadingDots: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div className={cn('flex space-x-1', className)}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
        style={{ animationDelay: `${i * 0.2}s` }}
      />
    ))}
  </div>
)

export const LoadingCard: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div
    className={cn(
      'p-6 border border-gray-700 rounded-xl bg-gray-800',
      className
    )}
  >
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-700 rounded w-3/4" />
      <div className="h-3 bg-gray-700 rounded w-1/2" />
      <div className="h-3 bg-gray-700 rounded w-2/3" />
    </div>
  </div>
)

export const LoadingTable: React.FC<{ rows?: number; className?: string }> = ({
  rows = 3,
  className,
}) => (
  <div className={cn('space-y-3', className)}>
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className="animate-pulse flex space-x-4 p-4 border border-gray-700 rounded-lg"
      >
        <div className="w-10 h-10 bg-gray-700 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-700 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
)

interface LoadingPageProps {
  message?: string
  className?: string
}

export const LoadingPage: React.FC<LoadingPageProps> = ({
  message = 'Loading...',
  className,
}) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center min-h-64 space-y-4',
      className
    )}
  >
    <Spinner size="lg" />
    <p className="text-gray-400">{message}</p>
  </div>
)

export const LoadingOverlay: React.FC<{
  isVisible: boolean
  message?: string
}> = ({ isVisible, message = 'Loading...' }) => {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-xl p-6 flex items-center space-x-4 border border-gray-700">
        <Spinner />
        <span className="text-white">{message}</span>
      </div>
    </div>
  )
}
