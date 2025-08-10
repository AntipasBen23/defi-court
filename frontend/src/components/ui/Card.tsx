import React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated'
  hover?: boolean
  clickable?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = 'default', hover, clickable, children, ...props },
    ref
  ) => {
    const variants = {
      default: 'bg-gray-800 border-gray-700',
      outlined: 'bg-transparent border-gray-600',
      elevated: 'bg-gray-800 border-gray-700 shadow-lg',
    }

    return (
      <div
        className={cn(
          'p-6 rounded-xl border transition-all duration-200',
          variants[variant],
          hover && 'hover:border-gray-600 hover:shadow-lg',
          clickable && 'cursor-pointer hover:scale-[1.02]',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// Simple sub-components
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn('space-y-1.5', className)} {...props} />

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => (
  <h3
    className={cn('text-lg font-semibold text-white', className)}
    {...props}
  />
)

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn('pt-4', className)} {...props} />

// Preset cards
export const StatsCard: React.FC<{
  title: string
  value: string | number
  change?: string
  icon?: React.ReactNode
}> = ({ title, value, change, icon }) => (
  <Card hover>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {change && <p className="text-sm text-green-400">{change}</p>}
      </div>
      {icon && <div className="text-gray-400">{icon}</div>}
    </div>
  </Card>
)

export const DisputeCard: React.FC<{
  title: string
  description: string
  amount: string
  status: string
  onClick?: () => void
}> = ({ title, description, amount, status, onClick }) => (
  <Card hover clickable onClick={onClick}>
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      </div>
      <span className="text-lg font-semibold text-white ml-4">{amount}</span>
    </div>
    <span
      className={cn(
        'px-2 py-1 rounded-full text-xs font-medium',
        status === 'open' && 'bg-yellow-900/20 text-yellow-400',
        status === 'voting' && 'bg-blue-900/20 text-blue-400',
        status === 'resolved' && 'bg-green-900/20 text-green-400'
      )}
    >
      {status}
    </span>
  </Card>
)

export { Card }
