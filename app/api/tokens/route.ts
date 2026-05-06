import { NextResponse } from 'next/server'
import { getNewListings, getTrendingTokens } from '@/lib/birdeye'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'trending'

  try {
    let tokens
    if (type === 'new') {
      tokens = await getNewListings()
    } else {
      tokens = await getTrendingTokens()
    }

    return NextResponse.json({ tokens })
  } catch (error) {
    console.error('Error fetching tokens:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tokens' },
      { status: 500 }
    )
  }
}
