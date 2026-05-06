import { NextResponse } from 'next/server'
import { getTokenDetails, getTokenSecurity } from '@/lib/birdeye'
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

    const [token, security] = await Promise.all([
      getTokenDetails(address),
      getTokenSecurity(address).catch(() => null),
    ])

    const analysis = await analyzeToken({
      name: token.name,
      symbol: token.symbol,
      price: token.price,
      priceChange24h: token.priceChange24h,
      volume24h: token.volume24h,
      liquidity: token.liquidity,
      marketCap: token.marketCap,
      security: security || undefined,
    })

    return NextResponse.json({ token, analysis })
  } catch (error) {
    console.error('Error analyzing token:', error)
    return NextResponse.json(
      { error: 'Failed to analyze token' },
      { status: 500 }
    )
  }
}
