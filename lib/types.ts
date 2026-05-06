export interface TokenData {
  address: string
  name: string
  symbol: string
  price: number
  priceChange24h: number
  volume24h: number
  liquidity: number
  marketCap: number
}

export interface AIInsight {
  risk: string
  opportunity: string
  insight: string
  verdict: string
  score: number
}
