import Link from 'next/link'
import { ArrowRight, Shield, Gavel, Users, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Gavel className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">DeFi Court</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/disputes" className="text-gray-300 hover:text-white transition-colors">
                Disputes
              </Link>
              <Link href="/juror" className="text-gray-300 hover:text-white transition-colors">
                Become a Juror
              </Link>
              <Link href="/governance" className="text-gray-300 hover:text-white transition-colors">
                Governance
              </Link>
            </nav>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Connect Wallet
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
            Decentralized
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              {' '}Dispute Resolution
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            A fair, transparent, and decentralized court system for DeFi disputes. 
            Stake tokens, vote on cases, and earn rewards for honest arbitration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/disputes/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              File a Dispute
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/juror"
              className="border border-gray-600 hover:border-gray-500 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              Become a Juror
              <Users className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How DeFi Court Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
              <Shield className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">File Disputes</h3>
              <p className="text-gray-300">
                Submit evidence of DeFi transaction issues with on-chain proofs and documentation.
              </p>
            </div>
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
              <Gavel className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">Stake & Vote</h3>
              <p className="text-gray-300">
                Jurors stake tokens and vote on disputes based on evidence and merit.
              </p>
            </div>
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
              <Zap className="h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">Earn Rewards</h3>
              <p className="text-gray-300">
                Honest jurors earn rewards while dishonest votes are slashed through game theory.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">$2.4M</div>
              <div className="text-gray-300">Total Disputes Resolved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">847</div>
              <div className="text-gray-300">Active Jurors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">94%</div>
              <div className="text-gray-300">Resolution Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">48h</div>
              <div className="text-gray-300">Avg Resolution Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Gavel className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-semibold text-white">DeFi Court</span>
            </div>
            <div className="flex space-x-6 text-gray-400">
              <Link href="/docs" className="hover:text-white transition-colors">
                Documentation
              </Link>
              <Link href="/security" className="hover:text-white transition-colors">
                Security
              </Link>
              <Link href="/governance" className="hover:text-white transition-colors">
                Governance
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 DeFi Court. Decentralized dispute resolution for DeFi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}