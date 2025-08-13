import React, { useState, useMemo } from 'react'
import { DisputeCard } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge, StatusBadge, CategoryBadge } from '@/components/ui/Badge'
import { LoadingCard } from '@/components/ui/Loading'
import { Dispute, DisputeStatus, DisputeCategory } from '@/lib/types'
import { DISPUTE_CATEGORIES, UI_CONFIG } from '@/lib/constants'
import { formatCurrency, timeAgo } from '@/lib/utils'

interface DisputeListProps {
  disputes: Dispute[]
  loading?: boolean
  onDisputeClick: (dispute: Dispute) => void
  showFilters?: boolean
}

export const DisputeList: React.FC<DisputeListProps> = ({
  disputes,
  loading = false,
  onDisputeClick,
  showFilters = true
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<DisputeStatus | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<DisputeCategory | 'all'>('all')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredDisputes = useMemo(() => {
    return disputes.filter(dispute => {
      const matchesSearch = dispute.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dispute.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || dispute.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || dispute.category === categoryFilter
      
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [disputes, searchTerm, statusFilter, categoryFilter])

  const paginatedDisputes = useMemo(() => {
    const startIndex = (currentPage - 1) * UI_CONFIG.ITEMS_PER_PAGE
    return filteredDisputes.slice(startIndex, startIndex + UI_CONFIG.ITEMS_PER_PAGE)
  }, [filteredDisputes, currentPage])

  const totalPages = Math.ceil(filteredDisputes.length / UI_CONFIG.ITEMS_PER_PAGE)

  const getTimeLeft = (dispute: Dispute) => {
    if (dispute.status !== DisputeStatus.VOTING) return null
    const timeLeft = dispute.deadline.getTime() - Date.now()
    if (timeLeft <= 0) return 'Ended'
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h left`
    return `${hours}h left`
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search disputes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:col-span-2"
            />
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as DisputeStatus | 'all')}
              className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value={DisputeStatus.OPEN}>Open</option>
              <option value={DisputeStatus.VOTING}>Voting</option>
              <option value={DisputeStatus.RESOLVED}>Resolved</option>
              <option value={DisputeStatus.EXECUTED}>Executed</option>
              <option value={DisputeStatus.CANCELLED}>Cancelled</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as DisputeCategory | 'all')}
              className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {DISPUTE_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-gray-400">
          {filteredDisputes.length} dispute{filteredDisputes.length !== 1 ? 's' : ''} found
        </p>
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {paginatedDisputes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No disputes found</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {paginatedDisputes.map((dispute) => (
            <div key={dispute.id} className="relative">
              <DisputeCard
                title={dispute.title}
                description={dispute.description}
                amount={`${dispute.amount} ${dispute.token}`}
                status={dispute.status}
                onClick={() => onDisputeClick(dispute)}
              />
              
              {/* Additional info overlay */}
              <div className="absolute top-4 right-4 flex flex-col items-end space-y-2">
                <CategoryBadge category={dispute.category} />
                {getTimeLeft(dispute) && (
                  <Badge variant="info" size="sm">
                    {getTimeLeft(dispute)}
                  </Badge>
                )}
                <span className="text-xs text-gray-500">
                  {timeAgo(dispute.createdAt.getTime())}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}