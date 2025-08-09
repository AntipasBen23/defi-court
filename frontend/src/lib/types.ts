// Core entity types
export interface User {
  address: string
  isJuror: boolean
  stakedAmount: string
  reputation: number
  totalVotes: number
  successfulVotes: number
}

export interface Dispute {
  id: string
  title: string
  description: string
  plaintiff: string
  defendant?: string
  amount: string
  token: string
  status: DisputeStatus
  category: DisputeCategory
  evidence: Evidence[]
  votes: Vote[]
  deadline: Date
  createdAt: Date
  jurorPool: string[]
  requiredVotes: number
  currentVotes: number
}

export interface Evidence {
  id: string
  disputeId: string
  submitter: string
  title: string
  description: string
  fileHash?: string
  fileUrl?: string
  submittedAt: Date
  verified: boolean
}

export interface Vote {
  id: string
  disputeId: string
  juror: string
  decision: VoteDecision
  reasoning?: string
  votedAt: Date
  weight: number
}

export interface JurorStake {
  juror: string
  amount: string
  stakedAt: Date
  lockPeriod: number
  isActive: boolean
}

// Enums
export enum DisputeStatus {
  OPEN = 'open',
  VOTING = 'voting', 
  RESOLVED = 'resolved',
  EXECUTED = 'executed',
  CANCELLED = 'cancelled'
}

export enum DisputeCategory {
  DEFI_PROTOCOL = 'defi_protocol',
  NFT_TRADE = 'nft_trade',
  TOKEN_SWAP = 'token_swap',
  LENDING = 'lending',
  YIELD_FARMING = 'yield_farming',
  OTHER = 'other'
}

export enum VoteDecision {
  PLAINTIFF = 'plaintiff',
  DEFENDANT = 'defendant',
  ABSTAIN = 'abstain'
}

// Form types
export interface CreateDisputeForm {
  title: string
  description: string
  defendant?: string
  amount: string
  token: string
  category: DisputeCategory
  evidence: File[]
}

export interface StakeForm {
  amount: string
  lockPeriod: number
}

export interface VoteForm {
  decision: VoteDecision
  reasoning?: string
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

// Contract interaction types
export interface ContractConfig {
  address: string
  abi: any[]
  networkId: number
}

export interface TransactionResult {
  hash: string
  blockNumber?: number
  gasUsed?: string
  status: 'success' | 'failed' | 'pending'
}

// Wallet types
export interface WalletState {
  isConnected: boolean
  address?: string
  chainId?: number
  balance?: string
  isCorrectNetwork: boolean
}

// Statistics types
export interface DisputeStats {
  totalDisputes: number
  openDisputes: number
  resolvedDisputes: number
  totalValueLocked: string
  averageResolutionTime: number
}

export interface JurorStats {
  totalJurors: number
  totalStaked: string
  averageStake: string
  averageReputation: number
}