

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

interface AIInsight {
  risk: string
  opportunity: string
  insight: string
  verdict: string
  score: number
}

interface TokenCardProps {
  token: TokenData
  analysis?: AIInsight
  onClick?: () => void
}



export default function TokenCard({ token, analysis, onClick }: TokenCardProps) {
  const isPositive = (token.priceChange24h || 0) > 0

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-2xl hover:border-nova-200 transition-all duration-300 cursor-pointer animate-slide-up"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          {token.logoURI ? (
            <img src={token.logoURI} alt={token.name} className="w-12 h-12 rounded-full bg-gray-100 p-1" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-nova-500 to-blue-500 flex items-center justify-center text-white font-bold">
              {token.symbol?.[0] || '?'}
            </div>
          )}
          <div>
            <h3 className="font-black text-lg group-hover:text-nova-600 transition-colors">{token.name}</h3>
            <p className="text-gray-500 text-sm font-mono">{token.symbol}</p>
          </div>
        </div>
        {token.rank && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-bold">
            #{token.rank}
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">Price</span>
          <span className="font-mono font-bold">${token.price?.toFixed(6) || '0.000000'}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">24h Change</span>
          <span className={`font-mono font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{(token.priceChange24h || 0).toFixed(2)}%
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">Volume 24h</span>
          <span className="font-mono font-medium">${((token.volume24h || 0) / 1000000).toFixed(2)}M</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">Liquidity</span>
          <span className="font-mono font-medium">${((token.liquidity || 0) / 1000000).toFixed(2)}M</span>
        </div>

        {analysis && (
          <>
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-700 italic leading-relaxed">"{analysis.insight}"</p>
            </div>
            <div className="flex justify-between items-center pt-2">
              <div>
                <span className="text-sm font-bold text-gray-700">Score: <span className="text-nova-600">{analysis.score}</span>/100</span>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                analysis.verdict === 'Potential Entry' ? 'bg-green-100 text-green-800 border border-green-200' :
                analysis.verdict === 'Avoid' ? 'bg-red-100 text-red-800 border border-red-200' :
                'bg-blue-100 text-blue-800 border border-blue-200'
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
