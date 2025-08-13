'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  StatsCard,
} from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { DisputeList } from '@/components/dispute/DisputeList'
import { useDisputes } from '@/hooks/useDisputes'
import { useWalletContext } from '@/context/WalletContext'
import { DisputeStatus } from '@/lib/types'
import { formatAddress, timeAgo } from '@/lib/utils'
import { JUROR_CONFIG } from '@/lib/constants'

export default function JurorPage() {
  const router = useRouter()
  const { wallet } = useWalletContext()
  const { getDisputesByStatus } = useDisputes()
  const [showStakeModal, setShowStakeModal] = useState(false)
  const [stakeAmount, setStakeAmount] = useState('')
  const [lockPeriod, setLockPeriod] = useState(30)
  const [isStaking, setIsStaking] = useState(false)

  // Mock juror data - replace with actual hook
  const jurorData = {
    isJuror: wallet.isConnected,
    stakedAmount: '500',
    reputation: 85,
    totalVotes: 23,
    successfulVotes: 20,
    activeDisputes: getDisputesByStatus(DisputeStatus.VOTING),
    pendingRewards: '2.5',
  }

  const handleStake = async () => {
    if (!wallet.isConnected) return

    setIsStaking(true)
    try {
      // Simulate staking transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setShowStakeModal(false)
      setStakeAmount('')
    } finally {
      setIsStaking(false)
    }
  }

  const handleUnstake = async () => {
    if (!wallet.isConnected) return
    // Handle unstaking logic
  }

  if (!wallet.isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Juror Dashboard</h1>
          <p className="text-gray-400 mb-6">
            Connect your wallet to access the juror dashboard
          </p>
          <Button onClick={() => router.push('/')}>Go Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">Juror Dashboard</h1>
            <p className="text-gray-400 mt-2">
              Manage your stake and vote on disputes •{' '}
              {formatAddress(wallet.address!)}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setShowStakeModal(true)}>
              {jurorData.isJuror ? 'Increase Stake' : 'Become Juror'}
            </Button>
            {jurorData.isJuror && (
              <Button variant="outline" onClick={handleUnstake}>
                Unstake
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatsCard
            title="Staked Amount"
            value={`${jurorData.stakedAmount} DCT`}
            icon={<span className="text-2xl">💰</span>}
          />
          <StatsCard
            title="Reputation"
            value={`${jurorData.reputation}%`}
            change={jurorData.reputation > 80 ? 'Excellent' : 'Good'}
            icon={<span className="text-2xl">⭐</span>}
          />
          <StatsCard
            title="Total Votes"
            value={jurorData.totalVotes}
            icon={<span className="text-2xl">🗳️</span>}
          />
          <StatsCard
            title="Success Rate"
            value={`${Math.round((jurorData.successfulVotes / jurorData.totalVotes) * 100)}%`}
            icon={<span className="text-2xl">✅</span>}
          />
          <StatsCard
            title="Pending Rewards"
            value={`${jurorData.pendingRewards} ETH`}
            icon={<span className="text-2xl">🎁</span>}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Disputes */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Active Voting Disputes</CardTitle>
              </CardHeader>
              <CardContent>
                {jurorData.activeDisputes.length > 0 ? (
                  <DisputeList
                    disputes={jurorData.activeDisputes}
                    onDisputeClick={(dispute) =>
                      router.push(`/disputes/${dispute.id}`)
                    }
                    showFilters={false}
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">
                      No active disputes to vote on
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => router.push('/disputes')}
                      className="mt-4"
                    >
                      Browse All Disputes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Juror Status */}
            <Card>
              <CardHeader>
                <CardTitle>Juror Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Status</span>
                    <Badge variant={jurorData.isJuror ? 'success' : 'warning'}>
                      {jurorData.isJuror ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Minimum Stake</span>
                    <span>{JUROR_CONFIG.MIN_STAKE} DCT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Your Stake</span>
                    <span className="font-semibold">
                      {jurorData.stakedAmount} DCT
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Voting Power</span>
                    <span>1.5x</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="text-gray-300">
                      Voted on &quot;DeFi Protocol Exploit&quot;
                    </p>
                    <p className="text-gray-500">
                      {timeAgo(Date.now() - 2 * 24 * 60 * 60 * 1000)}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-300">Staked 100 DCT</p>
                    <p className="text-gray-500">
                      {timeAgo(Date.now() - 5 * 24 * 60 * 60 * 1000)}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-300">Received 0.5 ETH reward</p>
                    <p className="text-gray-500">
                      {timeAgo(Date.now() - 7 * 24 * 60 * 60 * 1000)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lock Periods Info */}
            <Card>
              <CardHeader>
                <CardTitle>Lock Period Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {JUROR_CONFIG.LOCK_PERIODS.map((period) => (
                    <div key={period.days} className="flex justify-between">
                      <span className="text-gray-400">{period.days} days</span>
                      <span>{period.multiplier}x power</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stake Modal */}
        <Modal
          isOpen={showStakeModal}
          onClose={() => setShowStakeModal(false)}
          title={jurorData.isJuror ? 'Increase Stake' : 'Become a Juror'}
        >
          <div className="space-y-4">
            <Input
              label="Stake Amount (DCT)"
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="100"
              helperText={`Minimum: ${JUROR_CONFIG.MIN_STAKE} DCT`}
            />

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Lock Period
              </label>
              <select
                value={lockPeriod}
                onChange={(e) => setLockPeriod(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                {JUROR_CONFIG.LOCK_PERIODS.map((period) => (
                  <option key={period.days} value={period.days}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400">
                You will stake{' '}
                <span className="text-white font-semibold">
                  {stakeAmount || '0'} DCT
                </span>{' '}
                for{' '}
                <span className="text-white font-semibold">
                  {lockPeriod} days
                </span>
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Voting power:{' '}
                <span className="text-green-400">
                  {
                    JUROR_CONFIG.LOCK_PERIODS.find((p) => p.days === lockPeriod)
                      ?.multiplier
                  }
                  x
                </span>
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowStakeModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleStake}
                loading={isStaking}
                disabled={
                  !stakeAmount ||
                  parseFloat(stakeAmount) < parseFloat(JUROR_CONFIG.MIN_STAKE)
                }
                className="flex-1"
              >
                Stake Tokens
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
