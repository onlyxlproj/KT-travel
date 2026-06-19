import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getDemoClaudeResponse } from '@/lib/demo-data'

const TRAVEL_SYSTEM_PROMPT = `You are Claude, an AI travel assistant for Kanakoo Travels. You help users plan trips, find destinations, and get personalized travel recommendations.

Your expertise includes:
- Destination recommendations based on interests, budget, and travel style
- Trip planning and itinerary suggestions
- Travel tips and best practices
- Seasonal travel advice
- Budget optimization, with a focus on affordable, real-world bookable options
- Cultural insights and local recommendations

Be friendly, helpful, and enthusiastic about travel. Prioritize affordable, great-value recommendations. Provide specific, actionable recommendations when possible. If recommending destinations, mention why they match the user's criteria.

Keep responses concise but informative. Use bullet points and headers for readability when appropriate.`

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.ANTHROPIC_API_KEY

    // If no API key, return demo response
    if (!apiKey || apiKey === '') {
      const demoResponse = getDemoClaudeResponse(message)
      return NextResponse.json({ response: demoResponse })
    }

    const anthropic = new Anthropic({
      apiKey,
    })

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: TRAVEL_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    })

    const textContent = response.content.find((block) => block.type === 'text')
    const text = textContent && textContent.type === 'text' ? textContent.text : 'I apologize, but I could not generate a response.'

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error('Claude API error:', error)

    // Return demo response on error
    const demoResponse = getDemoClaudeResponse('error')
    return NextResponse.json({ response: demoResponse })
  }
}
