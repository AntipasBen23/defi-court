export default function Page() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">⚖️ DeFi Court</h1>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
            Connect Wallet
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        {/* Hero Section */}
        <div className="text-center py-12">
          <h2 className="text-4xl font-bold mb-4">
            Decentralized Dispute Resolution
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            A fair, transparent, and decentralized court system for DeFi disputes. 
            Stake tokens, vote on cases, and earn rewards for honest arbitration.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors">
              File a Dispute →
            </button>
            <button className="border border-gray-600 hover:border-gray-500 px-6 py-3 rounded-lg font-medium transition-colors">
              Become a Juror 👨‍⚖️
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {/* File Disputes */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="text-2xl mb-3">📋</div>
            <h3 className="text-xl font-semibold mb-2">File Disputes</h3>
            <p className="text-gray-400">
              Submit evidence of DeFi transaction issues with on-chain proofs and documentation.
            </p>
          </div>

          {/* Stake & Vote */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="text-2xl mb-3">🗳️</div>
            <h3 className="text-xl font-semibold mb-2">Stake & Vote</h3>
            <p className="text-gray-400">
              Jurors stake tokens and vote on disputes based on evidence and merit.
            </p>
          </div>

          {/* Earn Rewards */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="text-2xl mb-3">💰</div>
            <h3 className="text-xl font-semibold mb-2">Earn Rewards</h3>
            <p className="text-gray-400">
              Honest jurors earn rewards while dishonest votes are slashed through game theory.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-12">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">$2.4M</div>
            <div className="text-sm text-gray-400">Total Disputes Resolved</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">847</div>
            <div className="text-sm text-gray-400">Active Jurors</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">156</div>
            <div className="text-sm text-gray-400">Cases This Month</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">98.2%</div>
            <div className="text-sm text-gray-400">Resolution Rate</div>
          </div>
        </div>
      </main>
    </div>
  );
}