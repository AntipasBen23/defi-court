import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format wallet address to show first 6 and last 4 characters
 */
export function formatAddress(address: string): string {
  if (!address) return ''
  if (address.length < 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatNumber(num: number): string {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + 'B'
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M'
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * Format currency values with proper decimals
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format token amounts with appropriate decimal places
 */
export function formatTokenAmount(amount: number): string {
  if (amount === 0) return '0'
  
  // For very small amounts, show more decimals
  if (amount < 0.01) {
    return amount.toFixed(6)
  }
  
  // For normal amounts, show 2-4 decimals
  if (amount < 1000) {
    return amount.toFixed(4)
  }
  
  // For large amounts, use K/M notation
  return formatNumber(amount)
}

/**
 * Calculate time ago from timestamp
 */
export function timeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  }
  return 'Just now'
}

/**
 * Format countdown timer
 */
export function formatCountdown(endTime: number): string {
  const now = Date.now()
  const diff = endTime - now
  
  if (diff <= 0) return 'Ended'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
    return false
  }
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Check if address is valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Get dispute status color
 */
export function getDisputeStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'text-yellow-400 bg-yellow-900/20'
    case 'active':
      return 'text-blue-400 bg-blue-900/20'
    case 'resolved':
      return 'text-green-400 bg-green-900/20'
    case 'rejected':
      return 'text-red-400 bg-red-900/20'
    default:
      return 'text-gray-400 bg-gray-900/20'
  }
}

/**
 * Calculate voting deadline
 */
export function calculateVotingDeadline(createdAt: number, votingPeriod: number): number {
  return createdAt + (votingPeriod * 24 * 60 * 60 * 1000) // votingPeriod in days
}

/**
 * Get progress percentage
 */
export function getProgressPercentage(current: number, total: number): number {
  if (total === 0) return 0
  return Math.min(Math.round((current / total) * 100), 100)
}