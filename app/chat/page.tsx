'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Message, KnowledgeEntry } from '@/lib/types'

interface ApiMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources: KnowledgeEntry[]
  createdAt: string
}

function PlatformBadge({ platform }: { platform: string }) {
  const colors: Record<string, string> = {
    'Signage device': 'bg-blue-900 text-blue-300',
    Windows: 'bg-cyan-900 text-cyan-300',
    FireOS: 'bg-orange-900 text-orange-300',
    Tizen: 'bg-indigo-900 text-indigo-300',
    webOS: 'bg-red-900 text-red-300',
    Iframe: 'bg-violet-900 text-violet-300',
    General: 'bg-gray-800 text-gray-400',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[platform] ?? 'bg-gray-800 text-gray-400'}`}>
      {platform}
    </span>
  )
}

function ChatContent() {
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<ApiMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const didAutoSend = useRef(false)

  useEffect(() => {
    const q = searchParams.get('q')
    if (q && !didAutoSend.current) {
      didAutoSend.current = true
      setInput(q)
      sendMessage(q)
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text?: string) {
    const msg = (text ?? input).trim()
    if (!msg || loading) return
    setInput('')
    setLoading(true)

    const userMsg: ApiMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: msg,
      sources: [],
      createdAt: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: msg }),
      })
      const data = (await res.json()) as { sessionId: string; message: ApiMessage }
      setSessionId(data.sessionId)
      setMessages(prev => [...prev, data.message])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Failed to get a response. Please try again.',
          sources: [],
          createdAt: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800 bg-gray-950">
        <a href="/" className="text-gray-500 hover:text-gray-300 text-sm">← Back</a>
        <div className="font-semibold text-gray-200">SignageMind AI</div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-gray-600 mt-20 text-sm">
            Ask anything about signage devices, Tizen, webOS, FireOS, Windows signage, or iframe issues.
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-2' : ''}`}>
              {msg.role === 'user' ? (
                <div className="bg-blue-700 rounded-2xl rounded-tr-sm px-4 py-3 text-sm">
                  {msg.content}
                </div>
              ) : (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="text-sm whitespace-pre-wrap leading-relaxed text-gray-200">
                    {msg.content}
                  </div>
                  {msg.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-800">
                      <div className="text-xs text-gray-500 mb-2">Sources</div>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map(s => (
                          <div key={s.id} className="flex items-center gap-1.5">
                            <PlatformBadge platform={s.platform} />
                            <span className="text-xs text-gray-500">{s.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-gray-800 bg-gray-950">
        <form
          onSubmit={e => { e.preventDefault(); sendMessage() }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about signage devices, Tizen, webOS, FireOS, iframe issues..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-600"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-medium transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense>
      <ChatContent />
    </Suspense>
  )
}
