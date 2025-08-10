import { DisputeCategory, DisputeStatus } from './types'

// Network Configuration
export const SUPPORTED_NETWORKS = {
  ETHEREUM_MAINNET: 1,
  ETHEREUM_SEPOLIA: 11155111,
  POLYGON: 137,
  POLYGON_MUMBAI: 80001,
} as const

export const DEFAULT_NETWORK = SUPPORTED_NETWORKS.ETHEREUM_SEPOLIA

export const NETWORK_NAMES = {
  [SUPPORTED_NETWORKS.ETHEREUM_MAINNET]: 'Ethereum',
  [SUPPORTED_NETWORKS.ETHEREUM_SEPOLIA]: 'Sepolia Testnet',
  [SUPPORTED_NETWORKS.POLYGON]: 'Polygon',
  [SUPPORTED_NETWORKS.POLYGON_MUMBAI]: 'Mumbai Testnet',
} as const

// Contract Addresses (Update these with your deployed contracts)
export const CONTRACT_ADDRESSES = {
  [SUPPORTED_NETWORKS.ETHEREUM_SEPOLIA]: {
    DEFI_COURT: '0x0000000000000000000000000000000000000000',
    JUROR_TOKEN: '0x0000000000000000000000000000000000000000',
    EVIDENCE_STORAGE: '0x0000000000000000000000000000000000000000',
  },
  [SUPPORTED_NETWORKS.POLYGON_MUMBAI]: {
    DEFI_COURT: '0x0000000000000000000000000000000000000000',
    JUROR_TOKEN: '0x0000000000000000000000000000000000000000',
    EVIDENCE_STORAGE: '0x0000000000000000000000000000000000000000',
  },
} as const

// Dispute Configuration
export const DISPUTE_LIMITS = {
  MIN_AMOUNT: '0.01', // Minimum dispute amount in ETH
  MAX_AMOUNT: '1000', // Maximum dispute amount in ETH
  MIN_TITLE_LENGTH: 10,
  MAX_TITLE_LENGTH: 100,
  MIN_DESCRIPTION_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 2000,
  MAX_EVIDENCE_FILES: 5,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
} as const

export const DISPUTE_CATEGORIES = [
  { value: DisputeCategory.DEFI_PROTOCOL, label: 'DeFi Protocol Issue' },
  { value: DisputeCategory.NFT_TRADE, label: 'NFT Trade Dispute' },
  { value: DisputeCategory.TOKEN_SWAP, label: 'Token Swap Problem' },
  { value: DisputeCategory.LENDING, label: 'Lending/Borrowing' },
  { value: DisputeCategory.YIELD_FARMING, label: 'Yield Farming' },
  { value: DisputeCategory.OTHER, label: 'Other' },
] as const

export const DISPUTE_STATUS_LABELS = {
  [DisputeStatus.OPEN]: 'Open',
  [DisputeStatus.VOTING]: 'Under Voting',
  [DisputeStatus.RESOLVED]: 'Resolved',
  [DisputeStatus.EXECUTED]: 'Executed',
  [DisputeStatus.CANCELLED]: 'Cancelled',
} as const

// Juror Configuration
export const JUROR_CONFIG = {
  MIN_STAKE: '100', // Minimum stake in tokens
  LOCK_PERIODS: [
    { days: 30, multiplier: 1.0, label: '30 days (1x voting power)' },
    { days: 90, multiplier: 1.5, label: '90 days (1.5x voting power)' },
    { days: 180, multiplier: 2.0, label: '180 days (2x voting power)' },
    { days: 365, multiplier: 3.0, label: '1 year (3x voting power)' },
  ],
  VOTING_DEADLINE_DAYS: 7,
  MIN_REPUTATION: 0,
  SLASH_PERCENTAGE: 10, // Percentage slashed for malicious voting
} as const

// Supported Tokens
export const SUPPORTED_TOKENS = {
  [SUPPORTED_NETWORKS.ETHEREUM_SEPOLIA]: [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      isNative: true,
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0x94a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c8',
      decimals: 6,
      isNative: false,
    },
    {
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      address: '0xff34b3d4aee8ddcd6f9afffb6fe49bd371b8a357',
      decimals: 18,
      isNative: false,
    },
  ],
} as const

// UI Configuration
export const UI_CONFIG = {
  ITEMS_PER_PAGE: 20,
  SEARCH_DEBOUNCE_MS: 300,
  TOAST_DURATION: 5000,
  MODAL_CLOSE_DELAY: 200,
  LOADING_SPINNER_DELAY: 300,
} as const

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const

// IPFS Configuration
export const IPFS_CONFIG = {
  GATEWAY_URL: 'https://ipfs.io/ipfs/',
  PINATA_GATEWAY: 'https://gateway.pinata.cloud/ipfs/',
  MAX_UPLOAD_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_FILE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'text/plain',
    'application/json',
  ],
} as const

// Time Constants
export const TIME_CONSTANTS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
} as const

// Error Messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet',
  WRONG_NETWORK: 'Please switch to the correct network',
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  TRANSACTION_FAILED: 'Transaction failed',
  INVALID_ADDRESS: 'Invalid Ethereum address',
  FILE_TOO_LARGE: 'File size exceeds limit',
  INVALID_FILE_TYPE: 'Invalid file type',
  NETWORK_ERROR: 'Network error. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  DISPUTE_CREATED: 'Dispute created successfully',
  VOTE_SUBMITTED: 'Vote submitted successfully',
  STAKE_SUCCESSFUL: 'Stake successful',
  EVIDENCE_UPLOADED: 'Evidence uploaded successfully',
  SETTINGS_SAVED: 'Settings saved successfully',
} as const

// Feature Flags
export const FEATURES = {
  ENABLE_GOVERNANCE: true,
  ENABLE_REPUTATION_SYSTEM: true,
  ENABLE_EVIDENCE_UPLOAD: true,
  ENABLE_EMAIL_NOTIFICATIONS: false,
  ENABLE_MOBILE_APP: false,
} as const

// Social Links
export const SOCIAL_LINKS = {
  WEBSITE: 'https://defi-court.com',
  TWITTER: 'https://twitter.com/defi-court',
  DISCORD: 'https://discord.gg/defi-court',
  GITHUB: 'https://github.com/defi-court',
  DOCS: 'https://docs.defi-court.com',
} as const
