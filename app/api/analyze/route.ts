import { NextResponse } from 'next/server'
import { analyzeToken } from '@/lib/ai'

export async function POST(request: Request) {
  try {
    const { name, symbol, price, priceChange24h, volume24h, liquidity, marketCap } = await request.json()

    if (!name || !symbol) {
      return NextResponse.json(
        { error: 'Token name and symbol required' },
        { status: 400 }
      )
    }

    const analysis = await analyzeToken({
      name,
      symbol,
      price: price || 0,
      priceChange24h: priceChange24h || 0,
      volume24h: volume24h || 0,
      liquidity: liquidity || 0,
      marketCap: marketCap || 0,
    })

    return NextResponse.json({ token: { name, symbol, price, priceChange24h, volume24h, liquidity, marketCap }, analysis })
  } catch (error) {
    console.error('Error analyzing token:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to analyze token', details: message },
      { status: 500 }
    )
  }
}
