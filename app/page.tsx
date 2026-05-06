'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import TokenCard from '@/components/TokenCard'
import TokenTable from '@/components/TokenTable'
import AIInsight from '@/components/AIInsight'
import TokenSearch from '@/components/TokenSearch'

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
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h1 className="text-6xl md:text-7xl font-black mb-6">
            <span className="gradient-text">Agent Nova</span>
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            AI-powered crypto intelligence that turns raw data into 
            <span className="font-bold text-nova-600">actionable decisions</span>
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Real-time Analysis</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span>AI-Powered Insights</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              <span>Token Scoring</span>
            </div>
          </motion.div>
        </motion.header>

        <div className="space-y-20">
          {/* Section 1: Top Opportunities */}
          <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              initial={{ x: -20 }}
              whileInView={{ x: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-black mb-3">Top Opportunities</h2>
              <p className="text-gray-500 text-lg">Curated tokens with high potential</p>
            </motion.div>
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
                {trendingData?.tokens?.slice(0, 6).map((token: TokenData, index: number) => (
                  <motion.div
                    key={token.address}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <TokenCard token={token} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>

          {/* Section 2: New Listings */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              initial={{ x: -20 }}
              whileInView={{ x: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-black mb-3">New Listings</h2>
              <p className="text-gray-500 text-lg">Fresh tokens just launched</p>
            </motion.div>
            {newListingsLoading ? (
              <div className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="h-64 bg-gray-100 rounded"></div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <TokenTable tokens={newListingsData?.tokens || []} />
              </motion.div>
            )}
          </motion.section>

          {/* Section 3: Trending Analysis */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              initial={{ x: -20 }}
              whileInView={{ x: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-black mb-3">Trending Analysis</h2>
              <p className="text-gray-500 text-lg">Why these tokens are moving</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingData?.tokens?.slice(0, 3).map((token: TokenData, index: number) => (
                <motion.div
                  key={token.address}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4 mb-4">
                    {token.logoURI ? (
                      <img src={token.logoURI} alt={token.name} className="w-12 h-12 rounded-full bg-gray-100 p-1" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-nova-500 to-blue-500 flex items-center justify-center text-white font-bold">
                        {token.symbol?.[0] || '?'}
                      </div>
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
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="bg-blue-50 rounded-lg p-4 border border-blue-100"
                  >
                    <p className="text-gray-700 text-sm italic leading-relaxed">
                      "Strong momentum with {(token.volume24h || 0) > 1000000 ? 'high' : 'moderate'} volume suggests {(token.priceChange24h || 0) > 50 ? 'strong' : 'growing'} market interest."
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Section 4: Ask AI */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              initial={{ x: -20 }}
              whileInView={{ x: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-black mb-3">Ask AI Anything</h2>
              <p className="text-gray-500 text-lg">Get instant analysis on any token</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <TokenSearch onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
            </motion.div>
          </motion.section>

          {/* Analysis Result */}
          <AnimatePresence>
            {analysis && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
              >
                <AIInsight token={analysis.token} analysis={analysis.analysis} />
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>Built for the hackathon • Agent Nova • AI-Powered Crypto Intelligence</p>
        </footer>
      </div>
    </main>
  )
}
