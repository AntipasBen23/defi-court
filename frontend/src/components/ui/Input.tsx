import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  variant?: 'default' | 'filled' | 'outline'
  inputSize?: 'sm' | 'md' | 'lg'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      variant = 'default',
      inputSize = 'md',
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'w-full rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'

    const variantStyles = {
      default:
        'border-gray-700 bg-gray-800 text-white placeholder:text-gray-400 focus:border-blue-500',
      filled:
        'border-transparent bg-gray-700 text-white placeholder:text-gray-400 focus:bg-gray-600',
      outline:
        'border-gray-600 bg-transparent text-white placeholder:text-gray-400 focus:border-blue-500',
    }

    const sizeStyles = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-6 py-4 text-lg',
    }

    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : ''
    const errorStyles = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : ''

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-200 mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            type={type}
            className={cn(
              baseStyles,
              variantStyles[variant],
              sizeStyles[inputSize],
              disabledStyles,
              errorStyles,
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-400">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
