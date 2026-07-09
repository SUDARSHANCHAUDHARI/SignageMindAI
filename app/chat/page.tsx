'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Message, KnowledgeEntry } from '@/lib/types'

type Provider = 'claude' | 'openai'

const KEY_STORAGE = 'signagemind_api_key'
const PROVIDER_STORAGE = 'signagemind_provider'

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
  const [apiKey, setApiKey] = useState('')
  const [provider, setProvider] = useState<Provider>('claude')
  const [showSettings, setShowSettings] = useState(false)
  const [keyDraft, setKeyDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const didAutoSend = useRef(false)

  // Load the saved key/provider from the browser on mount.
  useEffect(() => {
    const savedKey = localStorage.getItem(KEY_STORAGE) ?? ''
    const savedProvider = localStorage.getItem(PROVIDER_STORAGE)
    setApiKey(savedKey)
    setKeyDraft(savedKey)
    if (savedProvider === 'openai' || savedProvider === 'claude') setProvider(savedProvider)
  }, [])

  useEffect(() => {
    const q = searchParams.get('q')
    if (q && !didAutoSend.current) {
      didAutoSend.current = true
      setInput(q)
      const savedKey = localStorage.getItem(KEY_STORAGE) ?? ''
      if (savedKey) sendMessage(q, savedKey)
      else setShowSettings(true)
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function saveSettings() {
    const trimmed = keyDraft.trim()
    setApiKey(trimmed)
    localStorage.setItem(KEY_STORAGE, trimmed)
    localStorage.setItem(PROVIDER_STORAGE, provider)
    setShowSettings(false)
  }

  function clearKey() {
    setApiKey('')
    setKeyDraft('')
    localStorage.removeItem(KEY_STORAGE)
  }

  async function sendMessage(text?: string, keyOverride?: string) {
    const msg = (text ?? input).trim()
    if (!msg || loading) return

    const key = keyOverride ?? apiKey
    if (!key) {
      setShowSettings(true)
      return
    }

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
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'x-ai-provider': provider,
        },
        body: JSON.stringify({ sessionId, message: msg }),
      })
      if (res.status === 401) {
        setShowSettings(true)
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: 'Add a valid API key in Settings to get answers. Your key is stored only in this browser.',
            sources: [],
            createdAt: new Date().toISOString(),
          },
        ])
        return
      }
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
        <button
          onClick={() => { setKeyDraft(apiKey); setShowSettings(true) }}
          className="ml-auto text-sm px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:border-blue-600 hover:text-white transition"
        >
          {apiKey ? '⚙ Key set' : '⚙ Add API key'}
        </button>
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

      {/* Settings modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={() => setShowSettings(false)}>
          <div
            className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-md p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-lg font-semibold text-gray-100 mb-1">API key</div>
            <p className="text-sm text-gray-500 mb-4">
              This app uses your own API key. It is stored only in this browser and sent directly with your requests — never saved on the server.
            </p>

            <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">Provider</label>
            <div className="flex gap-2 mb-4">
              {(['claude', 'openai'] as Provider[]).map(p => (
                <button
                  key={p}
                  onClick={() => setProvider(p)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${
                    provider === p
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  {p === 'claude' ? 'Claude (Anthropic)' : 'OpenAI'}
                </button>
              ))}
            </div>

            <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">
              {provider === 'claude' ? 'Anthropic API key' : 'OpenAI API key'}
            </label>
            <input
              type="password"
              value={keyDraft}
              onChange={e => setKeyDraft(e.target.value)}
              placeholder={provider === 'claude' ? 'sk-ant-...' : 'sk-...'}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-600 mb-4"
            />

            <div className="flex gap-2">
              <button
                onClick={saveSettings}
                disabled={!keyDraft.trim()}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-medium transition"
              >
                Save
              </button>
              {apiKey && (
                <button
                  onClick={clearKey}
                  className="px-4 py-2.5 border border-gray-700 text-gray-300 hover:border-red-700 hover:text-red-300 rounded-xl text-sm font-medium transition"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}
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
