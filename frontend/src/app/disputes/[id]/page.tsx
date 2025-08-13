'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, StatusBadge, CategoryBadge } from '@/components/ui/Badge'
import { LoadingPage } from '@/components/ui/Loading'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { useDisputes } from '@/hooks/useDisputes'
import { useWalletContext } from '@/context/WalletContext'
import { Dispute, DisputeStatus, VoteDecision } from '@/lib/types'
import { formatAddress, timeAgo, formatCountdown } from '@/lib/utils'

export default function DisputeDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { wallet } = useWalletContext()
  const { getDispute, voteOnDispute } = useDisputes()

  const [dispute, setDispute] = useState<Dispute | null>(null)
  const [loading, setLoading] = useState(true)
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [voteDecision, setVoteDecision] = useState<VoteDecision>(
    VoteDecision.ABSTAIN
  )
  const [voteReasoning, setVoteReasoning] = useState('')
  const [isVoting, setIsVoting] = useState(false)

  const disputeId = params.id as string

  useEffect(() => {
    const fetchDispute = async () => {
      setLoading(true)
      const disputeData = await getDispute(disputeId)
      setDispute(disputeData)
      setLoading(false)
    }
    if (disputeId) fetchDispute()
  }, [disputeId, getDispute])

  const handleVote = async () => {
    if (!dispute) return
    setIsVoting(true)
    const success = await voteOnDispute(dispute.id, voteDecision, voteReasoning)
    if (success) {
      setShowVoteModal(false)
      const updatedDispute = await getDispute(disputeId)
      setDispute(updatedDispute)
    }
    setIsVoting(false)
  }

  const canVote = () => {
    if (
      !dispute ||
      !wallet.isConnected ||
      dispute.status !== DisputeStatus.VOTING
    )
      return false
    return !dispute.votes.some(
      (vote) => vote.juror.toLowerCase() === wallet.address?.toLowerCase()
    )
  }

  const getVoteDistribution = () => {
    if (!dispute) return { plaintiff: 0, defendant: 0, abstain: 0 }
    return dispute.votes.reduce(
      (acc, vote) => {
        acc[vote.decision]++
        return acc
      },
      { plaintiff: 0, defendant: 0, abstain: 0 } as Record<VoteDecision, number>
    )
  }

  if (loading) return <LoadingPage message="Loading dispute details..." />

  if (!dispute) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Dispute Not Found</h1>
          <p className="text-gray-400 mb-6">
            The dispute you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push('/disputes')}>
            Back to Disputes
          </Button>
        </div>
      </div>
    )
  }

  const voteDistribution = getVoteDistribution()
  const timeLeft =
    dispute.status === DisputeStatus.VOTING
      ? formatCountdown(dispute.deadline.getTime())
      : null

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <Button
          variant="outline"
          onClick={() => router.push('/disputes')}
          className="mb-4"
        >
          ← Back to Disputes
        </Button>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{dispute.title}</h1>
            <div className="flex items-center space-x-3">
              <StatusBadge status={dispute.status} />
              <CategoryBadge category={dispute.category} />
              {timeLeft && <Badge variant="info">{timeLeft}</Badge>}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">
              {dispute.amount} {dispute.token}
            </p>
            <p className="text-gray-400 text-sm">
              Created {timeAgo(dispute.createdAt.getTime())}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{dispute.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Parties Involved</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Plaintiff</p>
                  <p className="font-mono text-blue-400">
                    {formatAddress(dispute.plaintiff)}
                  </p>
                </div>
                {dispute.defendant && (
                  <div>
                    <p className="text-sm text-gray-400">Defendant</p>
                    <p className="font-mono text-red-400">
                      {formatAddress(dispute.defendant)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {dispute.evidence.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Evidence</CardTitle>
                </CardHeader>
                <CardContent>
                  {dispute.evidence.map((evidence) => (
                    <div
                      key={evidence.id}
                      className="border border-gray-700 rounded-lg p-4 mb-3"
                    >
                      <h4 className="font-medium mb-1">{evidence.title}</h4>
                      <p className="text-sm text-gray-400 mb-2">
                        {evidence.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        By {formatAddress(evidence.submitter)} •{' '}
                        {timeAgo(evidence.submittedAt.getTime())}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {dispute.status === DisputeStatus.VOTING && (
              <Card>
                <CardHeader>
                  <CardTitle>Voting</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">For Plaintiff</span>
                      <span className="text-green-400">
                        {voteDistribution.plaintiff}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">For Defendant</span>
                      <span className="text-red-400">
                        {voteDistribution.defendant}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Abstain</span>
                      <span className="text-gray-400">
                        {voteDistribution.abstain}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400 mb-2">
                      {dispute.currentVotes} / {dispute.requiredVotes} votes
                    </p>
                    <Button
                      onClick={() => setShowVoteModal(true)}
                      disabled={!canVote()}
                      className="w-full"
                    >
                      {!wallet.isConnected
                        ? 'Connect Wallet'
                        : canVote()
                          ? 'Cast Vote'
                          : 'Already Voted'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Status Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <StatusBadge status={dispute.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Category</span>
                  <CategoryBadge category={dispute.category} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Created</span>
                  <span>{timeAgo(dispute.createdAt.getTime())}</span>
                </div>
                {timeLeft && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time Left</span>
                    <span>{timeLeft}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Vote Modal */}
        <Modal
          isOpen={showVoteModal}
          onClose={() => setShowVoteModal(false)}
          title="Cast Your Vote"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Your Decision
              </label>
              <select
                value={voteDecision}
                onChange={(e) =>
                  setVoteDecision(e.target.value as VoteDecision)
                }
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value={VoteDecision.PLAINTIFF}>
                  Support Plaintiff
                </option>
                <option value={VoteDecision.DEFENDANT}>
                  Support Defendant
                </option>
                <option value={VoteDecision.ABSTAIN}>Abstain</option>
              </select>
            </div>

            <Input
              label="Reasoning (Optional)"
              value={voteReasoning}
              onChange={(e) => setVoteReasoning(e.target.value)}
              placeholder="Explain your decision..."
              helperText="Your reasoning will be public"
            />

            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowVoteModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleVote}
                loading={isVoting}
                className="flex-1"
              >
                Submit Vote
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
