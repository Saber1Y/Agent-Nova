import { TrendingUp, TrendingDown, Shield, AlertTriangle, AlertCircle } from 'lucide-react'
import { TokenData } from '@/lib/birdeye'
import { AIInsight } from '@/lib/ai'

interface TokenCardProps {
  token: TokenData
  analysis?: AIInsight
  onClick?: () => void
}

const RiskBadge = ({ risk }: { risk: string }) => {
  const styles = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800',
  }
  const icons = {
    Low: Shield,
    Medium: AlertTriangle,
    High: AlertCircle,
  }
  const Icon = icons[risk as keyof typeof icons] || AlertCircle

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[risk as keyof typeof styles]}`}>
      <Icon className="w-3 h-3" />
      {risk} Risk
    </span>
  )
}

export default function TokenCard({ token, analysis, onClick }: TokenCardProps) {
  const isPositive = token.priceChange24h > 0

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg">{token.name}</h3>
          <p className="text-gray-500 text-sm">{token.symbol}</p>
        </div>
        {analysis && <RiskBadge risk={analysis.risk} />}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Price</span>
          <span className="font-mono">${token.price.toFixed(6)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">24h Change</span>
          <span className={`font-mono flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {isPositive ? '+' : ''}{token.priceChange24h.toFixed(2)}%
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Volume 24h</span>
          <span className="font-mono">${(token.volume24h / 1000000).toFixed(2)}M</span>
        </div>

        {analysis && (
          <>
            <div className="pt-3 border-t">
              <p className="text-sm text-gray-700 italic">"{analysis.insight}"</p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-600">Score: {analysis.score}/100</span>
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                analysis.verdict === 'Potential Entry' ? 'bg-green-100 text-green-800' :
                analysis.verdict === 'Avoid' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {analysis.verdict}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
