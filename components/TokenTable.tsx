import { TokenData } from '@/lib/birdeye'

interface TokenTableProps {
  tokens: TokenData[]
  onSelectToken?: (address: string) => void
}

export default function TokenTable({ tokens, onSelectToken }: TokenTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left p-3">Token</th>
            <th className="text-right p-3">Price</th>
            <th className="text-right p-3">24h Change</th>
            <th className="text-right p-3">Liquidity</th>
            <th className="text-right p-3">Volume 24h</th>
            <th className="text-right p-3">Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr
              key={token.address}
              onClick={() => onSelectToken?.(token.address)}
              className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="p-3">
                <div>
                  <p className="font-medium">{token.name}</p>
                  <p className="text-gray-500 text-xs">{token.symbol}</p>
                </div>
              </td>
              <td className="text-right p-3 font-mono">${token.price.toFixed(6)}</td>
              <td className={`text-right p-3 font-mono ${token.priceChange24h > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
              </td>
              <td className="text-right p-3 font-mono">${(token.liquidity / 1000).toFixed(0)}K</td>
              <td className="text-right p-3 font-mono">${(token.volume24h / 1000000).toFixed(2)}M</td>
              <td className="text-right p-3 font-mono">${(token.marketCap / 1000000).toFixed(2)}M</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
