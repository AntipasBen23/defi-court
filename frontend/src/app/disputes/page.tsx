'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DisputeList } from '@/components/dispute/DisputeList'
import { DisputeForm } from '@/components/dispute/DisputeForm'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { StatsCard } from '@/components/ui/Card'
import { useDisputes } from '@/hooks/useDisputes'
import { useWalletContext } from '@/context/WalletContext'
import { DisputeStatus, CreateDisputeForm, Dispute } from '@/lib/types'

export default function DisputesPage() {
  const router = useRouter()
  const { wallet } = useWalletContext()
  const { disputes, loading, createDispute, getDisputesByStatus } =
    useDisputes()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateDispute = async (disputeData: CreateDisputeForm) => {
    setIsCreating(true)
    try {
      const success = await createDispute(disputeData)
      if (success) {
        setShowCreateModal(false)
      }
    } finally {
      setIsCreating(false)
    }
  }

  const handleDisputeClick = (dispute: Dispute) => {
    router.push(`/disputes/${dispute.id}`)
  }

  const stats = {
    total: disputes.length,
    open: getDisputesByStatus(DisputeStatus.OPEN).length,
    voting: getDisputesByStatus(DisputeStatus.VOTING).length,
    resolved: getDisputesByStatus(DisputeStatus.RESOLVED).length,
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Disputes</h1>
            <p className="text-gray-400 mt-2">
              Browse and manage disputes in the DeFi Court
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="primary"
            size="lg"
            disabled={!wallet.isConnected}
            className="mt-4 sm:mt-0"
          >
            {wallet.isConnected ? 'Create Dispute' : 'Connect Wallet'}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Disputes"
            value={stats.total}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
          />
          <StatsCard
            title="Open"
            value={stats.open}
            change={stats.open > 0 ? `${stats.open} active` : undefined}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <StatsCard
            title="Voting"
            value={stats.voting}
            change={stats.voting > 0 ? `${stats.voting} pending` : undefined}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 4V2c0-.553.448-1 1-1h8c.552 0 1 .447 1 1v2h3c.552 0 1 .447 1 1s-.448 1-1 1h-1v12c0 1.103-.897 2-2 2H7c-1.103 0-2-.897-2-2V6H4c-.552 0-1-.447-1-1s.448-1 1-1h3z"
                />
              </svg>
            }
          />
          <StatsCard
            title="Resolved"
            value={stats.resolved}
            change={
              stats.resolved > 0 ? `${stats.resolved} complete` : undefined
            }
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
        </div>

        {/* Disputes List */}
        <DisputeList
          disputes={disputes}
          loading={loading}
          onDisputeClick={handleDisputeClick}
          showFilters={true}
        />

        {/* Create Dispute Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Dispute"
          size="lg"
        >
          <DisputeForm
            onSubmit={handleCreateDispute}
            isSubmitting={isCreating}
          />
        </Modal>
      </div>
    </div>
  )
}
