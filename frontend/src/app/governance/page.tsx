'use client'

import React, { useState } from 'react'
import { Card, CardContent, StatsCard } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useWalletContext } from '@/context/WalletContext'
import { useToastContext } from '@/context/ToastContext'
import { formatAddress, timeAgo, formatCountdown } from '@/lib/utils'

interface Proposal {
  id: string
  title: string
  description: string
  proposer: string
  status: 'active' | 'passed' | 'failed' | 'executed'
  votesFor: number
  votesAgainst: number
  totalVotes: number
  quorum: number
  endTime: Date
  createdAt: Date
}

const mockProposals: Proposal[] = [
  {
    id: '1',
    title: 'Increase Juror Minimum Stake to 200 DCT',
    description: 'Proposal to increase the minimum stake required for jurors from 100 DCT to 200 DCT to improve the quality of jurors.',
    proposer: '0x1234567890123456789012345678901234567890',
    status: 'active',
    votesFor: 1250,
    votesAgainst: 340,
    totalVotes: 1590,
    quorum: 2000,
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    title: 'Reduce Voting Period to 5 Days',
    description: 'Reduce the voting period for disputes from 7 days to 5 days to speed up dispute resolution.',
    proposer: '0x2345678901234567890123456789012345678901',
    status: 'passed',
    votesFor: 2100,
    votesAgainst: 890,
    totalVotes: 2990,
    quorum: 2000,
    endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
  }
]

export default function GovernancePage() {
  const { wallet } = useWalletContext()
  const { success, walletNotConnected, transactionFailed } = useToastContext()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [voteChoice, setVoteChoice] = useState<'for' | 'against'>('for')
  const [proposalTitle, setProposalTitle] = useState('')
  const [proposalDescription, setProposalDescription] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredProposals = mockProposals.filter(proposal => {
    const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateProposal = async () => {
    if (!wallet.isConnected) return walletNotConnected()
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      success('Proposal Created', 'Your proposal has been submitted for voting')
      setShowCreateModal(false)
      setProposalTitle('')
      setProposalDescription('')
    } catch {
      transactionFailed('Failed to create proposal')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVote = async () => {
    if (!selectedProposal) return
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      success('Vote Submitted', `You voted ${voteChoice} on proposal`)
      setShowVoteModal(false)
      setSelectedProposal(null)
    } catch {
      transactionFailed('Failed to submit vote')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string): 'default' | 'success' | 'info' | 'danger' | 'outline' | 'warning' => {
    const statusMap = {
      active: 'info' as const,
      passed: 'success' as const,
      failed: 'danger' as const,
      executed: 'success' as const
    }
    return statusMap[status as keyof typeof statusMap] || 'default'
  }

  const stats = {
    total: mockProposals.length,
    active: mockProposals.filter(p => p.status === 'active').length,
    passed: mockProposals.filter(p => p.status === 'passed').length,
    votingPower: wallet.isConnected ? '150 DCT' : '0 DCT'
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">Governance</h1>
            <p className="text-gray-400 mt-2">Participate in protocol governance and shape the future of DeFi Court</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} disabled={!wallet.isConnected}>
            {wallet.isConnected ? 'Create Proposal' : 'Connect Wallet'}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Total Proposals" value={stats.total} />
          <StatsCard title="Active" value={stats.active} />
          <StatsCard title="Passed" value={stats.passed} />
          <StatsCard title="Your Voting Power" value={stats.votingPower} />
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Search proposals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
                <option value="executed">Executed</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Proposals */}
        <div className="space-y-4">
          {filteredProposals.map((proposal) => (
            <Card key={proposal.id} hover clickable>
              <CardContent>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{proposal.title}</h3>
                    <p className="text-gray-400 text-sm">{proposal.description}</p>
                  </div>
                  <div className="ml-4 flex flex-col items-end space-y-2">
                    <Badge variant={getStatusColor(proposal.status)} className="capitalize">
                      {proposal.status}
                    </Badge>
                    {proposal.status === 'active' && (
                      <span className="text-sm text-gray-400">
                        {formatCountdown(proposal.endTime.getTime())}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-6 text-sm">
                    <span className="text-gray-400">By {formatAddress(proposal.proposer)}</span>
                    <span className="text-gray-400">{timeAgo(proposal.createdAt.getTime())}</span>
                  </div>
                  {proposal.status === 'active' && wallet.isConnected && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedProposal(proposal)
                        setShowVoteModal(true)
                      }}
                    >
                      Vote
                    </Button>
                  )}
                </div>

                {/* Voting Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">For: {proposal.votesFor}</span>
                    <span className="text-red-400">Against: {proposal.votesAgainst}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(proposal.votesFor / proposal.totalVotes) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Quorum: {Math.min((proposal.totalVotes / proposal.quorum) * 100, 100).toFixed(1)}%</span>
                    <span>Total: {proposal.totalVotes} votes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Proposal Modal */}
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Proposal" size="lg">
          <div className="space-y-4">
            <Input
              label="Proposal Title"
              value={proposalTitle}
              onChange={(e) => setProposalTitle(e.target.value)}
              placeholder="Enter proposal title"
            />
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Description</label>
              <textarea
                value={proposalDescription}
                onChange={(e) => setProposalDescription(e.target.value)}
                placeholder="Describe your proposal in detail..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                rows={4}
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleCreateProposal}
                loading={isSubmitting}
                disabled={!proposalTitle || !proposalDescription}
                className="flex-1"
              >
                Create Proposal
              </Button>
            </div>
          </div>
        </Modal>

        {/* Vote Modal */}
        <Modal isOpen={showVoteModal} onClose={() => setShowVoteModal(false)} title="Vote on Proposal">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">{selectedProposal?.title}</h4>
              <p className="text-sm text-gray-400">{selectedProposal?.description}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Your Vote</label>
              <div className="space-y-2">
                {(['for', 'against'] as const).map((choice) => (
                  <label key={choice} className="flex items-center">
                    <input
                      type="radio"
                      value={choice}
                      checked={voteChoice === choice}
                      onChange={(e) => setVoteChoice(e.target.value as 'for' | 'against')}
                      className="mr-2"
                    />
                    <span className={choice === 'for' ? 'text-green-400' : 'text-red-400'}>
                      Vote {choice === 'for' ? 'For' : 'Against'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex space-x-3 pt-4">
              <Button variant="outline" onClick={() => setShowVoteModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button variant="primary" onClick={handleVote} loading={isSubmitting} className="flex-1">
                Submit Vote
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}