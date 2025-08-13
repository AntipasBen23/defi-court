import { useState, useEffect, useCallback } from 'react'
import {
  Dispute,
  CreateDisputeForm,
  DisputeStatus,
  DisputeCategory,
  VoteDecision,
} from '@/lib/types'
import { useWalletContext } from '@/context/WalletContext'

// Mock data for development - replace with actual API calls
const mockDisputes: Dispute[] = [
  {
    id: '1',
    title: 'DeFi Protocol Exploit - Lost 50 ETH',
    description:
      'Lost funds due to a smart contract vulnerability in XYZ protocol during yield farming operation.',
    plaintiff: '0x1234567890123456789012345678901234567890',
    defendant: '0x0987654321098765432109876543210987654321',
    amount: '50',
    token: 'ETH',
    status: DisputeStatus.VOTING,
    category: DisputeCategory.DEFI_PROTOCOL,
    evidence: [],
    votes: [],
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    jurorPool: [],
    requiredVotes: 5,
    currentVotes: 2,
  },
  {
    id: '2',
    title: 'NFT Trade Dispute',
    description: 'Bought NFT but received different item than advertised.',
    plaintiff: '0x2345678901234567890123456789012345678901',
    amount: '2.5',
    token: 'ETH',
    status: DisputeStatus.OPEN,
    category: DisputeCategory.NFT_TRADE,
    evidence: [],
    votes: [],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    jurorPool: [],
    requiredVotes: 3,
    currentVotes: 0,
  },
]

export const useDisputes = () => {
  const { wallet } = useWalletContext()
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all disputes
  const fetchDisputes = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In real app, this would be an API call:
      // const response = await fetch('/api/disputes')
      // const data = await response.json()

      setDisputes(mockDisputes)
    } catch (err) {
      setError('Failed to fetch disputes')
      console.error('Error fetching disputes:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Get dispute by ID
  const getDispute = useCallback(
    async (id: string): Promise<Dispute | null> => {
      try {
        // In real app: const response = await fetch(`/api/disputes/${id}`)
        const dispute = mockDisputes.find((d) => d.id === id)
        return dispute || null
      } catch (err) {
        console.error('Error fetching dispute:', err)
        return null
      }
    },
    []
  )

  // Create new dispute
  const createDispute = useCallback(
    async (disputeData: CreateDisputeForm): Promise<boolean> => {
      if (!wallet.isConnected) {
        setError('Wallet not connected')
        return false
      }

      setLoading(true)
      setError(null)

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // In real app, this would create the dispute on blockchain and backend:
        // const response = await fetch('/api/disputes', {
        //   method: 'POST',
        //   body: JSON.stringify(disputeData)
        // })

        const newDispute: Dispute = {
          id: Date.now().toString(),
          title: disputeData.title,
          description: disputeData.description,
          plaintiff: wallet.address!,
          defendant: disputeData.defendant,
          amount: disputeData.amount,
          token: disputeData.token,
          status: DisputeStatus.OPEN,
          category: disputeData.category,
          evidence: [],
          votes: [],
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          jurorPool: [],
          requiredVotes: 5,
          currentVotes: 0,
        }

        setDisputes((prev) => [newDispute, ...prev])
        return true
      } catch (err) {
        setError('Failed to create dispute')
        console.error('Error creating dispute:', err)
        return false
      } finally {
        setLoading(false)
      }
    },
    [wallet]
  )

  // Get user's disputes
  const getUserDisputes = useCallback((): Dispute[] => {
    if (!wallet.address) return []
    return disputes.filter(
      (dispute) =>
        dispute.plaintiff.toLowerCase() === wallet.address!.toLowerCase() ||
        dispute.defendant?.toLowerCase() === wallet.address!.toLowerCase()
    )
  }, [disputes, wallet.address])

  // Get disputes by status
  const getDisputesByStatus = useCallback(
    (status: DisputeStatus): Dispute[] => {
      return disputes.filter((dispute) => dispute.status === status)
    },
    [disputes]
  )

  // Vote on dispute (for jurors)
  const voteOnDispute = useCallback(
    async (
      disputeId: string,
      decision: 'plaintiff' | 'defendant' | 'abstain',
      reasoning?: string
    ): Promise<boolean> => {
      if (!wallet.isConnected) {
        setError('Wallet not connected')
        return false
      }

      setLoading(true)
      setError(null)

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // In real app: POST to /api/disputes/${disputeId}/vote

        // Update local state
        setDisputes((prev) =>
          prev.map((dispute) => {
            if (dispute.id === disputeId) {
              return {
                ...dispute,
                currentVotes: dispute.currentVotes + 1,
                votes: [
                  ...dispute.votes,
                  {
                    id: Date.now().toString(),
                    disputeId,
                    juror: wallet.address!,
                    decision: decision as VoteDecision,
                    reasoning,
                    votedAt: new Date(),
                    weight: 1,
                  },
                ],
              }
            }
            return dispute
          })
        )

        return true
      } catch (err) {
        setError('Failed to submit vote')
        console.error('Error voting:', err)
        return false
      } finally {
        setLoading(false)
      }
    },
    [wallet]
  )

  // Load disputes on mount
  useEffect(() => {
    fetchDisputes()
  }, [fetchDisputes])

  return {
    disputes,
    loading,
    error,
    fetchDisputes,
    getDispute,
    createDispute,
    getUserDisputes,
    getDisputesByStatus,
    voteOnDispute,
    clearError: () => setError(null),
  }
}
