'use client'

import { useState, useRef, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DemoBanner from '@/components/DemoBanner'
import { useAuth } from '@/lib/auth-context'
import { isDemoMode, getDemoGeminiResponse } from '@/lib/demo-data'
import { Send, Loader2, Bot, User, Sparkles } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const suggestedPrompts = [
  'Where should I travel for a beach vacation?',
  'Suggest adventure destinations for solo travelers',
  'Best family-friendly tours for summer',
  'Budget-friendly European destinations',
]

export default function AssistantPage() {
  const { isDemo } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      let response: string

      if (isDemoMode() || isDemo) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        response = getDemoGeminiResponse(content)
      } else {
        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            context: 'travel_assistant',
          }),
        })

        if (!res.ok) {
          throw new Error('Failed to get response')
        }

        const data = await res.json()
        response = data.response
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DemoBanner />
      <Header />

      <main className="flex-1 flex flex-col">
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col px-4 py-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Gemini Travel Assistant</h1>
            <p className="text-gray-600 mt-1">
              Ask me anything about travel destinations, planning, and recommendations!
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 text-primary-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-6">
                  Start a conversation or try one of these suggestions:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(prompt)}
                      className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm hover:bg-primary-100 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] flex ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    } items-start gap-3`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user'
                          ? 'bg-primary-600'
                          : 'bg-gradient-to-br from-primary-500 to-accent-500'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content.split('\n').map((line, i) => {
                          if (line.startsWith('**') && line.endsWith('**')) {
                            return (
                              <p key={i} className="font-bold mb-2">
                                {line.slice(2, -2)}
                              </p>
                            )
                          }
                          if (line.startsWith('- ')) {
                            return (
                              <p key={i} className="ml-2">
                                • {line.slice(2)}
                              </p>
                            )
                          }
                          if (line.startsWith('*') && line.endsWith('*')) {
                            return (
                              <p key={i} className="text-xs opacity-75 mt-2 italic">
                                {line.slice(1, -1)}
                              </p>
                            )
                          }
                          return line ? <p key={i}>{line}</p> : <br key={i} />
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-gray-100">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about destinations, planning tips, or get recommendations..."
              className="flex-1 input py-3"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary px-6 flex items-center space-x-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </button>
          </form>

          {(isDemoMode() || isDemo) && (
            <p className="text-center text-xs text-gray-500 mt-3">
              Demo mode active. Add your GEMINI_API_KEY in Vercel to enable full AI capabilities.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
