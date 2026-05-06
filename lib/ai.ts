import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
})

export interface AIInsight {
  risk: 'Low' | 'Medium' | 'High'
  opportunity: 'Low' | 'Medium' | 'High'
  insight: string
  verdict: 'Watch' | 'Avoid' | 'Potential Entry'
  score: number
}

export async function analyzeToken(tokenData: {
  name: string
  symbol: string
  price: number
  priceChange24h: number
  volume24h: number
  liquidity: number
  marketCap: number
  holderCount?: number
  topHolderPercent?: number
  security?: {
    isHoneypot: boolean
    canSell: boolean
    buyTax: number
    sellTax: number
    ownershipRenounced: boolean
  }
}): Promise<AIInsight> {

  const prompt = `Analyze this token and return a JSON response:

Token: ${tokenData.name} (${tokenData.symbol})
Price: $${tokenData.price}
24h Change: ${tokenData.priceChange24h}%
Volume 24h: $${tokenData.volume24h.toLocaleString()}
Liquidity: $${tokenData.liquidity.toLocaleString()}
Market Cap: $${tokenData.marketCap?.toLocaleString() || 'N/A'}
${tokenData.topHolderPercent ? `Top Holder: ${tokenData.topHolderPercent}%` : ''}
Security: ${tokenData.security ? `
- Honeypot: ${tokenData.security.isHoneypot}
- Can Sell: ${tokenData.security.canSell}
- Buy Tax: ${tokenData.security.buyTax}%
- Sell Tax: ${tokenData.security.sellTax}%
` : 'N/A'}

Return ONLY a JSON object with this structure:
{
  "risk": "Low" | "Medium" | "High",
  "opportunity": "Low" | "Medium" | "High",
  "insight": "max 2 sentences",
  "verdict": "Watch" | "Avoid" | "Potential Entry",
  "score": 0-100
}`

  const completion = await openai.chat.completions.create({
    model: 'openai/gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a professional crypto market analyst. Return only valid JSON.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
  })

  const result = JSON.parse(completion.choices[0].message.content || '{}')

  return {
    risk: result.risk || 'Medium',
    opportunity: result.opportunity || 'Low',
    insight: result.insight || '',
    verdict: result.verdict || 'Watch',
    score: result.score || 50,
  }
}
