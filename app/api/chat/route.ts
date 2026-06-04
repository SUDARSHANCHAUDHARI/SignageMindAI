import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { retrieve } from '@/lib/rag'
import { chat } from '@/lib/ai'
import { createSession, getSession, addMessage } from '@/lib/store'
import type { Message } from '@/lib/types'

const MAX_MESSAGE_CHARS = 8_000
const MAX_SESSION_ID_CHARS = 120

const SYSTEM_PROMPT = `You are SignageMind AI, an expert support chatbot specialized in digital signage systems. You have deep knowledge of:
- Signage devices — crashes, updates, display issues, network
- Windows signage — performance, kiosk mode, DirectX issues
- FireOS (Amazon Fire TV / Fire Stick) — sideloading, ADB, display, network
- Samsung Tizen displays — SSSP, MagicInfo, web app deployment
- LG webOS Signage — ares-cli, SuperSign, app crashes
- Iframe problems — X-Frame-Options, CSP frame-ancestors, mixed content, auth walls
- General signage — media formats, network requirements, troubleshooting

You will be given relevant knowledge base excerpts. Use them to give precise, actionable answers.
Keep answers concise and practical. Use numbered steps for procedures.
If you don't know something specific, say so — don't guess.`

export async function POST(request: NextRequest) {
  try {
    const { sessionId, message } = (await request.json()) as {
      sessionId?: string
      message: string
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'message is required' }, { status: 400 })
    }
    if (message.length > MAX_MESSAGE_CHARS) {
      return NextResponse.json({ error: `message must be ${MAX_MESSAGE_CHARS} characters or fewer` }, { status: 413 })
    }
    if (sessionId && sessionId.length > MAX_SESSION_ID_CHARS) {
      return NextResponse.json({ error: `sessionId must be ${MAX_SESSION_ID_CHARS} characters or fewer` }, { status: 400 })
    }

    const sid = sessionId ?? nanoid()
    await getSession(sid) ?? await createSession(sid, message)

    // Retrieve relevant knowledge
    const sources = retrieve(message, 3)

    // Build context from sources
    const context = sources.length > 0
      ? sources.map(s => `## ${s.platform} — ${s.title}\n${s.content}`).join('\n\n---\n\n')
      : 'No specific knowledge base entries matched. Answer from general expertise.'

    const userPrompt = `Relevant knowledge base context:
${context}

---

User question: ${message}`

    // Save user message
    const userMsg: Message = {
      id: nanoid(),
      role: 'user',
      content: message,
      sources: [],
      createdAt: new Date().toISOString(),
    }
    await addMessage(sid, userMsg)

    // Call AI
    let answer: string
    try {
      answer = await chat(SYSTEM_PROMPT, userPrompt)
    } catch {
      answer = sources.length > 0
        ? `Based on our knowledge base:\n\n${sources[0]?.content ?? 'No information found.'}`
        : 'AI is unavailable. Please check your API key configuration.'
    }

    // Save assistant message
    const assistantMsg: Message = {
      id: nanoid(),
      role: 'assistant',
      content: answer,
      sources,
      createdAt: new Date().toISOString(),
    }
    await addMessage(sid, assistantMsg)

    return NextResponse.json({ sessionId: sid, message: assistantMsg })
  } catch (error) {
    console.error('POST /api/chat error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
