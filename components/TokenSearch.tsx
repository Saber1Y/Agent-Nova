'use client'

import { useState } from 'react'
import { Search, Sparkles } from 'lucide-react'

interface TokenSearchProps {
  onAnalyze: (address: string) => void
  isLoading?: boolean
}

export default function TokenSearch({ onAnalyze, isLoading }: TokenSearchProps) {
  const [address, setAddress] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (address.trim()) {
      onAnalyze(address.trim())
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-nova-600" />
        <div>
          <h2 className="text-2xl font-bold">Ask AI About Any Token</h2>
          <p className="text-gray-500">Enter a token address for instant AI analysis</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter token address (e.g., 0x...)"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nova-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !address.trim()}
          className="px-6 py-3 bg-nova-600 text-white rounded-lg font-medium hover:bg-nova-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-sm text-gray-500">Try:</span>
        {['SOL', 'BONK', 'WIF'].map((symbol) => (
          <button
            key={symbol}
            onClick={() => setAddress(symbol)}
            className="text-sm px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            {symbol}
          </button>
        ))}
      </div>
    </div>
  )
}
