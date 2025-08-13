import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { CreateDisputeForm, DisputeCategory } from '@/lib/types'
import {
  DISPUTE_CATEGORIES,
  DISPUTE_LIMITS,
  SUPPORTED_TOKENS,
  DEFAULT_NETWORK,
} from '@/lib/constants'
import { useWalletContext } from '@/context/WalletContext'

interface DisputeFormProps {
  onSubmit: (data: CreateDisputeForm) => Promise<void>
  isSubmitting?: boolean
}

export const DisputeForm: React.FC<DisputeFormProps> = ({
  onSubmit,
  isSubmitting = false,
}) => {
  const { wallet } = useWalletContext()
  const [formData, setFormData] = useState<CreateDisputeForm>({
    title: '',
    description: '',
    defendant: '',
    amount: '',
    token: 'ETH',
    category: DisputeCategory.OTHER,
    evidence: [],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (
      !formData.title ||
      formData.title.length < DISPUTE_LIMITS.MIN_TITLE_LENGTH
    ) {
      newErrors.title = `Title must be at least ${DISPUTE_LIMITS.MIN_TITLE_LENGTH} characters`
    }

    if (
      !formData.description ||
      formData.description.length < DISPUTE_LIMITS.MIN_DESCRIPTION_LENGTH
    ) {
      newErrors.description = `Description must be at least ${DISPUTE_LIMITS.MIN_DESCRIPTION_LENGTH} characters`
    }

    if (
      !formData.amount ||
      parseFloat(formData.amount) < parseFloat(DISPUTE_LIMITS.MIN_AMOUNT)
    ) {
      newErrors.amount = `Amount must be at least ${DISPUTE_LIMITS.MIN_AMOUNT} ETH`
    }

    if (parseFloat(formData.amount) > parseFloat(DISPUTE_LIMITS.MAX_AMOUNT)) {
      newErrors.amount = `Amount cannot exceed ${DISPUTE_LIMITS.MAX_AMOUNT} ETH`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!wallet.isConnected) {
      setErrors({ general: 'Please connect your wallet' })
      return
    }

    if (!validateForm()) return

    try {
      await onSubmit(formData)
      // Reset form on success
      setFormData({
        title: '',
        description: '',
        defendant: '',
        amount: '',
        token: 'ETH',
        category: DisputeCategory.OTHER,
        evidence: [],
      })
      setErrors({})
    } catch {
      setErrors({ general: 'Failed to create dispute. Please try again.' })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > DISPUTE_LIMITS.MAX_EVIDENCE_FILES) {
      setErrors({
        evidence: `Maximum ${DISPUTE_LIMITS.MAX_EVIDENCE_FILES} files allowed`,
      })
      return
    }

    setFormData((prev) => ({ ...prev, evidence: files }))
    setErrors((prev) => ({ ...prev, evidence: '' }))
  }

  const tokens = SUPPORTED_TOKENS[DEFAULT_NETWORK] || []

  return (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Create New Dispute</h2>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Dispute Title"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="Brief description of the dispute"
          error={errors.title}
          maxLength={DISPUTE_LIMITS.MAX_TITLE_LENGTH}
        />

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Detailed explanation of what happened"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={4}
            maxLength={DISPUTE_LIMITS.MAX_DESCRIPTION_LENGTH}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-400">{errors.description}</p>
          )}
        </div>

        <Input
          label="Defendant Address (Optional)"
          value={formData.defendant}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, defendant: e.target.value }))
          }
          placeholder="0x..."
          error={errors.defendant}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, amount: e.target.value }))
            }
            placeholder="0.0"
            error={errors.amount}
          />

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Token
            </label>
            <select
              value={formData.token}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, token: e.target.value }))
              }
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {tokens.map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                category: e.target.value as DisputeCategory,
              }))
            }
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {DISPUTE_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Evidence Files (Optional)
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            accept=".pdf,.jpg,.jpeg,.png,.gif,.txt,.json"
          />
          {errors.evidence && (
            <p className="mt-1 text-sm text-red-400">{errors.evidence}</p>
          )}
          <p className="mt-1 text-sm text-gray-400">
            Max {DISPUTE_LIMITS.MAX_EVIDENCE_FILES} files, 10MB each
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          disabled={!wallet.isConnected}
          className="w-full"
        >
          {!wallet.isConnected ? 'Connect Wallet' : 'Create Dispute'}
        </Button>
      </form>
    </Card>
  )
}
