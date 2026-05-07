interface AnalysisData {
  risk: string
  opportunity: string
  insight: string
  verdict: string
  score: number
}

interface TokenData {
  name: string
  symbol: string
  price: number
  priceChange24h: number
}

interface AIInsightProps {
  analysis?: AnalysisData
  token?: TokenData
}

export default function AIInsight({ analysis, token }: AIInsightProps) {
  if (!analysis || !token) {
    return null
  }

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
            {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{analysis.risk}</p>
          <p className="text-sm text-gray-600 mt-1">Risk Level</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{analysis.opportunity}</p>
          <p className="text-sm text-gray-600 mt-1">Opportunity</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-nova-600">{analysis.score}</p>
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
        <span className="text-sm text-gray-500">
          Real-time analysis
        </span>
      </div>
    </div>
  )
}
