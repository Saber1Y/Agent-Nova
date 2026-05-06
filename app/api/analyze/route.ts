import { NextResponse } from 'next/server'
import { getTrendingTokens, getNewListings } from '@/lib/birdeye'
import { analyzeToken } from '@/lib/ai'

export async function POST(request: Request) {
  try {
    const { address } = await request.json()

    if (!address) {
      return NextResponse.json(
        { error: 'Token address required' },
        { status: 400 }
      )
    }

    // Search in free endpoints (trending + new listings)
    const [trending, newListings] = await Promise.all([
      getTrendingTokens(),
      getNewListings().catch(() => []),
    ])

    const allTokens = [...trending, ...newListings]
    const token = allTokens.find(t => 
      t.address.toLowerCase() === address.toLowerCase()
    )

    if (!token) {
      return NextResponse.json(
        { error: 'Token not found. Try a trending token address.' },
        { status: 404 }
      )
    }

    const analysis = await analyzeToken({
      name: token.name,
      symbol: token.symbol,
      price: token.price,
      priceChange24h: token.priceChange24h || 0,
      volume24h: token.volume24h || 0,
      liquidity: token.liquidity || 0,
      marketCap: token.marketCap || 0,
    })

    return NextResponse.json({ token, analysis })
  } catch (error) {
    console.error('Error analyzing token:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to analyze token', details: message },
      { status: 500 }
    )
  }
}
