const BIRDEYE_API_KEY = process.env.BIRDEYE_API_KEY || ''
const BIRDEYE_BASE_URL = 'https://public-api.birdeye.so'

export interface TokenData {
  address: string
  name: string
  symbol: string
  price: number
  priceChange24h: number
  volume24h: number
  liquidity: number
  marketCap: number
  holderCount?: number
  topHolderPercent?: number
}

export interface TokenSecurity {
  isHoneypot: boolean
  canSell: boolean
  isAntiWhale: boolean
  buyTax: number
  sellTax: number
  ownershipRenounced: boolean
}

export interface TokenAnalysis {
  token: TokenData
  security?: TokenSecurity
}

async function fetchBirdeye<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(endpoint, BIRDEYE_BASE_URL)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }

  const response = await fetch(url.toString(), {
    headers: {
      'X-API-KEY': BIRDEYE_API_KEY,
      'accept': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Birdeye API error: ${response.statusText}`)
  }

  return response.json()
}

export async function getNewListings(): Promise<TokenData[]> {
  const data = await fetchBirdeye<{ tokens: TokenData[] }>('/v2/tokens/new_listing', {
    limit: '20',
    sort_by: 'created_at',
    sort_type: 'desc',
  })
  return data.tokens || []
}

export async function getTrendingTokens(): Promise<TokenData[]> {
  const data = await fetchBirdeye<{ tokens: TokenData[] }>('/defi/token_trending', {
    limit: '20',
  })
  return data.tokens || []
}

export async function getTokenSecurity(address: string): Promise<TokenSecurity> {
  const data = await fetchBirdeye<{ security: TokenSecurity }>('/defi/token_security', {
    address,
  })
  return data.security
}

export async function getTokenDetails(address: string): Promise<TokenData> {
  const data = await fetchBirdeye<{ token: TokenData }>('/defi/token_overview', {
    address,
  })
  return data.token
}
