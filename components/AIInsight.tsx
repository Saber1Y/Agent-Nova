import { Shield, AlertTriangle, AlertCircle, TrendingUp, TrendingDown, Clock } from 'lucide-react'

interface AIInsightProps {
  analysis: {
    risk: string
    opportunity: string
    insight: string
    verdict: string
    score: number
  }
  token: {
    name: string
    symbol: string
    price: number
    priceChange24h: number
  }
}

const RiskIcon = ({ risk }: { risk: string }) => {
  if (risk === 'Low') return <Shield className="w-5 h-5 text-green-600" />
  if (risk === 'Medium') return <AlertTriangle className="w-5 h-5 text-yellow-600" />
  return <AlertCircle className="w-5 h-5 text-red-600" />
}

export default function AIInsight({ analysis, token }: AIInsightProps) {
  const priceChange = token?.priceChange24h ?? 0
  const isPositive = priceChange > 0

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{token?.name} ({token?.symbol})</h2>
          <p className="text-gray-500">AI Analysis</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">${token?.price?.toFixed(6) ?? '0.000000'}</p>
          <p className={`flex items-center gap-1 justify-end ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <RiskIcon risk={analysis.risk} />
          <p className="text-sm text-gray-600 mt-2">Risk Level</p>
          <p className="font-bold text-lg">{analysis.risk}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <TrendingUp className="w-5 h-5 text-blue-600 mx-auto" />
          <p className="text-sm text-gray-600 mt-2">Opportunity</p>
          <p className="font-bold text-lg">{analysis.opportunity}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-nova-600">{analysis.score}</div>
          <p className="text-sm text-gray-600 mt-1">Score</p>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <p className="text-gray-800 italic">"{analysis.insight}"</p>
      </div>

      <div className="flex items-center justify-between">
        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
          analysis.verdict === 'Potential Entry' ? 'bg-green-100 text-green-800' :
          analysis.verdict === 'Avoid' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {analysis.verdict}
        </span>
        <span className="text-sm text-gray-500 flex items-center gap-1">
          <Clock className="w-4 h-4" />
          Real-time analysis
        </span>
      </div>
    </div>
  )
}
