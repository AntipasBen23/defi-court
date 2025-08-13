import React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
}

const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-gray-600 text-gray-100',
    success: 'bg-green-600 text-green-100',
    warning: 'bg-yellow-600 text-yellow-100',
    danger: 'bg-red-600 text-red-100',
    info: 'bg-blue-600 text-blue-100',
    outline: 'border border-gray-400 text-gray-300 bg-transparent'
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      )}
      {children}
    </span>
  )
}

// Preset badges for common use cases
export const StatusBadge: React.FC<{
  status: string
  className?: string
}> = ({ status, className }) => {
  const statusConfig = {
    open: { variant: 'warning' as const, label: 'Open' },
    voting: { variant: 'info' as const, label: 'Voting' },
    resolved: { variant: 'success' as const, label: 'Resolved' },
    executed: { variant: 'success' as const, label: 'Executed' },
    cancelled: { variant: 'danger' as const, label: 'Cancelled' },
    pending: { variant: 'warning' as const, label: 'Pending' },
    active: { variant: 'info' as const, label: 'Active' },
    inactive: { variant: 'default' as const, label: 'Inactive' }
  }

  const config = statusConfig[status.toLowerCase() as keyof typeof statusConfig] || statusConfig.pending

  return (
    <Badge variant={config.variant} className={className} dot>
      {config.label}
    </Badge>
  )
}

export const CategoryBadge: React.FC<{
  category: string
  className?: string
}> = ({ category, className }) => {
  const categoryLabels = {
    defi_protocol: 'DeFi Protocol',
    nft_trade: 'NFT Trade',
    token_swap: 'Token Swap',
    lending: 'Lending',
    yield_farming: 'Yield Farming',
    other: 'Other'
  }

  const label = categoryLabels[category as keyof typeof categoryLabels] || category

  return (
    <Badge variant="outline" size="sm" className={className}>
      {label}
    </Badge>
  )
}

export const PriorityBadge: React.FC<{
  priority: 'low' | 'medium' | 'high' | 'critical'
  className?: string
}> = ({ priority, className }) => {
  const priorityConfig = {
    low: { variant: 'default' as const, label: 'Low' },
    medium: { variant: 'info' as const, label: 'Medium' },
    high: { variant: 'warning' as const, label: 'High' },
    critical: { variant: 'danger' as const, label: 'Critical' }
  }

  const config = priorityConfig[priority]

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}

export { Badge }