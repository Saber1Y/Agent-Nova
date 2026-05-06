'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import TokenCard from '@/components/TokenCard'
import TokenTable from '@/components/TokenTable'
import AIInsight from '@/components/AIInsight'
import TokenSearch from '@/components/TokenSearch'
import { Rocket, TrendingUp, Sparkles, Search, Zap, Bot, BarChart3 } from 'lucide-react'

interface TokenData {
  address: string
  name: string
  symbol: string
  price: number
  priceChange24h: number
  volume24h: number
  liquidity: number
  marketCap: number
  logoURI?: string
  rank?: number
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
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ['tokens', 'trending'],
    queryFn: async () => {
      const res = await fetch('/api/tokens?type=trending')
      return res.json()
    },
    refetchInterval: 15000,
  })

  const { data: newListingsData, isLoading: newListingsLoading } = useQuery({
    queryKey: ['tokens', 'new'],
    queryFn: async () => {
      const res = await fetch('/api/tokens?type=new')
      return res.json()
    },
    refetchInterval: 30000,
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
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <header className="mb-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-nova-600 to-blue-600 rounded-2xl shadow-lg">
              <Rocket className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-black mb-4">
            <span className="gradient-text">Agent Nova</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            AI-powered crypto intelligence that turns raw data into 
            <span className="font-bold text-nova-600">actionable decisions</span>
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Real-time Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-green-500" />
              <span>AI-Powered Insights</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              <span>Token Scoring</span>
            </div>
          </div>
        </header>

        <div className="space-y-16">
          {/* Section 1: Top Opportunities */}
          <section className="animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Top Opportunities</h2>
                <p className="text-gray-500">Curated tokens with high potential</p>
              </div>
            </div>
            {trendingLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-100 rounded"></div>
                      <div className="h-3 bg-gray-100 rounded"></div>
                      <div className="h-3 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingData?.tokens?.slice(0, 6).map((token: TokenData) => (
                  <TokenCard key={token.address} token={token} />
                ))}
              </div>
            )}
          </section>

          {/* Section 2: New Listings */}
          <section className="animate-slide-up">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">New Listings</h2>
                <p className="text-gray-500">Fresh tokens just launched</p>
              </div>
            </div>
            {newListingsLoading ? (
              <div className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="h-64 bg-gray-100 rounded"></div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <TokenTable tokens={newListingsData?.tokens || []} />
              </div>
            )}
          </section>

          {/* Section 3: Trending Analysis */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Trending Analysis</h2>
                <p className="text-gray-500">Why these tokens are moving</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingData?.tokens?.slice(0, 3).map((token: TokenData) => (
                <div key={token.address} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    {token.logoURI && (
                      <img src={token.logoURI} alt={token.name} className="w-12 h-12 rounded-full" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{token.name}</h3>
                      <p className="text-gray-500 text-sm">{token.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm">${token.price?.toFixed(6)}</p>
                      <p className={`text-sm font-medium ${token.priceChange24h > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {token.priceChange24h > 0 ? '+' : ''}{(token.priceChange24h || 0).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-gray-700 text-sm italic">
                      "Strong momentum with {(token.volume24h || token.volume24hUSD || 0) > 1000000 ? 'high' : 'moderate'} volume suggests {(token.priceChange24h || 0) > 50 ? 'strong' : 'growing'} market interest."
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Ask AI */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-green-100 rounded-lg">
                <Search className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Ask AI Anything</h2>
                <p className="text-gray-500">Get instant analysis on any token</p>
              </div>
            </div>
            <TokenSearch onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
          </section>

          {/* Analysis Result */}
          {analysis && (
            <section className="animate-slide-up">
              <AIInsight token={analysis.token} analysis={analysis.analysis} />
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>Built for the hackathon • Agent Nova • AI-Powered Crypto Intelligence</p>
        </footer>
      </div>
    </main>
  )
}
