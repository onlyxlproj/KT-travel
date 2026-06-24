import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getDemoGeminiResponse } from '@/lib/demo-data'

const TRAVEL_SYSTEM_PROMPT = `You are an AI travel assistant for Kanakoo Travels. You help users plan trips, find destinations, and get personalized travel recommendations.

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
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY

    // If no API key, return demo response
    if (!apiKey || apiKey === '') {
      const demoResponse = getDemoGeminiResponse(message)
      return NextResponse.json({ response: demoResponse })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: TRAVEL_SYSTEM_PROMPT,
    })

    const result = await model.generateContent(message)
    const text = result.response.text()

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error('Gemini API error:', error)

    // Return demo response on error
    const demoResponse = getDemoGeminiResponse('error')
    return NextResponse.json({ response: demoResponse })
  }
}
