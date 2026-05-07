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

    const [trending, newListings] = await Promise.all([
      getTrendingTokens(),
      getNewListings().catch(() => []),
    ])

    const allTokens = [...trending, ...newListings]
    const input = address.trim().toLowerCase()

    const token = allTokens.find(t => 
      t.address.toLowerCase() === input ||
      t.symbol.toLowerCase() === input ||
      t.name.toLowerCase().includes(input)
    )

    // If not found, try re-fetching trending to get latest
    if (!token) {
      const freshTrending = await getTrendingTokens()
      const freshToken = freshTrending.find(t =>
        t.address.toLowerCase() === input ||
        t.symbol.toLowerCase() === input ||
        t.name.toLowerCase().includes(input)
      )
      if (!freshToken) {
        return NextResponse.json(
          { error: `Token "${address}" not found in trending. Try a token address.` },
          { status: 404 }
        )
      }
      const analysis = await analyzeToken({
        name: freshToken.name,
        symbol: freshToken.symbol,
        price: freshToken.price,
        priceChange24h: freshToken.priceChange24h || 0,
        volume24h: freshToken.volume24h || 0,
        liquidity: freshToken.liquidity || 0,
        marketCap: freshToken.marketCap || 0,
      })
      return NextResponse.json({ token: freshToken, analysis })
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
