import { NextResponse } from 'next/server'
import { getNewListings, getTrendingTokens } from '@/lib/birdeye'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'trending'

  console.log('API route called, type:', type)
  console.log('BIRDEYE_KEY exists:', !!process.env.BIRDEYE_API_KEY)
  
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
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to fetch tokens', details: message },
      { status: 500 }
    )
  }
}
