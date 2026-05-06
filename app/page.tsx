'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import TokenCard from '@/components/TokenCard'
import TokenTable from '@/components/TokenTable'
import AIInsight from '@/components/AIInsight'
import TokenSearch from '@/components/TokenSearch'
import { Rocket, TrendingUp, Sparkles, Search } from 'lucide-react'

interface TokenData {
  address: string
  name: string
  symbol: string
  price: number
  priceChange24h: number
  volume24h: number
  liquidity: number
  marketCap: number
}

interface AnalysisData {
  token: TokenData
  analysis: {
    risk: string
    opportunity: string
    insight: string
    verdict: string
    score: number
  }
}

export default function Home() {
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ['tokens', 'trending'],
    queryFn: async () => {
      const res = await fetch('/api/tokens?type=trending')
      return res.json()
    },
  })

  const { data: newListingsData, isLoading: newListingsLoading } = useQuery({
    queryKey: ['tokens', 'new'],
    queryFn: async () => {
      const res = await fetch('/api/tokens?type=new')
      return res.json()
    },
  })

  const handleAnalyze = async (address: string) => {
    setIsAnalyzing(true)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      })
      const data = await res.json()
      setAnalysis(data)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Rocket className="w-8 h-8 text-nova-600" />
            <h1 className="text-4xl font-bold">Agent Nova</h1>
          </div>
          <p className="text-gray-600 text-lg">
            AI-powered crypto intelligence that turns data into decisions
          </p>
        </header>

        <div className="space-y-12">
          <section>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-nova-600" />
              <h2 className="text-2xl font-bold">Top Opportunities</h2>
            </div>
            {trendingLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingData?.tokens?.slice(0, 6).map((token: TokenData) => (
                  <TokenCard
                    key={token.address}
                    token={token}
                    onClick={() => setSelectedToken(token.address)}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-nova-600" />
              <h2 className="text-2xl font-bold">New Listings</h2>
            </div>
            {newListingsLoading ? (
              <div className="bg-white rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6">
                <TokenTable
                  tokens={newListingsData?.tokens || []}
                  onSelectToken={setSelectedToken}
                />
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-nova-600" />
              <h2 className="text-2xl font-bold">Trending Analysis</h2>
            </div>
            {trendingData?.tokens?.slice(0, 3).map((token: TokenData) => (
              <div key={token.address} className="bg-white rounded-xl p-6 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{token.name}</h3>
                    <p className="text-gray-500">{token.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono">${token.price.toFixed(6)}</p>
                    <p className={`text-sm ${token.priceChange24h > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 italic text-sm">
                  "Strong momentum with {token.volume24h > 1000000 ? 'high' : 'moderate'} volume suggests {token.priceChange24h > 50 ? 'strong' : 'growing'} market interest."
                </p>
              </div>
            ))}
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6">
              <Search className="w-5 h-5 text-nova-600" />
              <h2 className="text-2xl font-bold">Ask AI About Any Token</h2>
            </div>
            <TokenSearch onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
          </section>

          {analysis && (
            <section>
              <h2 className="text-2xl font-bold mb-6">AI Analysis Result</h2>
              <AIInsight token={analysis.token} analysis={analysis.analysis} />
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
