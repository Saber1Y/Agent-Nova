const BIRDEYE_API_KEY = process.env.BIRDEYE_API_KEY || ''
const BIRDEYE_BASE_URL = 'https://public-api.birdeye.so'

export interface TokenData {
  address: string
  name: string
  symbol: string
  price: number
  priceChange24h: number
  volume24h: number
  volume24hUSD?: number
  liquidity: number
  marketCap: number
  marketcap?: number
  holderCount?: number
  topHolderPercent?: number
  logoURI?: string
  rank?: number
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

  console.log('Fetching Birdeye:', url.toString())
  
  const response = await fetch(url.toString(), {
    headers: {
      'X-API-KEY': BIRDEYE_API_KEY,
      'accept': 'application/json',
    },
  })

  console.log('Birdeye response status:', response.status)
  
  if (!response.ok) {
    const text = await response.text()
    console.error('Birdeye error response:', text)
    throw new Error(`Birdeye API error: ${response.statusText}`)
  }

  const data = await response.json()
  console.log('Birdeye data received:', JSON.stringify(data).slice(0, 200))
  return data
}

export async function getNewListings(): Promise<TokenData[]> {
  const data = await fetchBirdeye<{ data: { tokens?: TokenData[] } }>('/v2/tokens/new_listing', {
    limit: '20',
    sort_by: 'created_at',
    sort_type: 'desc',
  })
  return data.data?.tokens || []
}

export async function getTrendingTokens(): Promise<TokenData[]> {
  const data = await fetchBirdeye<{ data: { tokens?: TokenData[] } }>('/defi/token_trending', {
    limit: '20',
  })
  return data.data?.tokens || []
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
