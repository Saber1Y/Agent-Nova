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
  const data = await fetchBirdeye<{
    data: {
      items?: Array<{
        address: string
        name: string
        symbol: string
        liquidity: number
        logoURI?: string
      }>
    }
  }>('/defi/v2/tokens/new_listing', {
    limit: '20',
  })
  return (data.data?.items || []).map(item => ({
    address: item.address,
    name: item.name,
    symbol: item.symbol,
    price: 0,
    priceChange24h: 0,
    volume24h: 0,
    liquidity: item.liquidity || 0,
    marketCap: 0,
    logoURI: item.logoURI,
  }))
}

export async function getTrendingTokens(): Promise<TokenData[]> {
  const data = await fetchBirdeye<{
    data: {
      tokens?: Array<{
        address: string
        name: string
        symbol: string
        price: number
        price24hChangePercent?: number
        volume24hUSD?: number
        liquidity: number
        marketcap?: number
        logoURI?: string
        rank?: number
      }>
    }
  }>('/defi/token_trending', {
    limit: '20',
  })
  return (data.data?.tokens || []).map(token => ({
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    price: token.price,
    priceChange24h: token.price24hChangePercent || 0,
    volume24h: token.volume24hUSD || 0,
    volume24hUSD: token.volume24hUSD,
    liquidity: token.liquidity || 0,
    marketCap: token.marketcap || 0,
    marketcap: token.marketcap,
    logoURI: token.logoURI,
    rank: token.rank,
  }))
}


