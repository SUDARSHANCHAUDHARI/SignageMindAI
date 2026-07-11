// Cloudflare Pages Function — serves POST /api/chat.
// Ported from app/api/chat/route.ts. Sessions persist in Cloudflare KV
// (binding: SESSIONS_KV) instead of the filesystem, which Workers lack.
import { nanoid } from 'nanoid'
import { retrieve } from '../../lib/rag'
import { chat, type AIProvider } from '../../lib/ai'
import { KVChatRepository, type KVNamespaceLike } from '../../lib/storage/kv'
import type { Message } from '../../lib/types'

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

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

export const onRequestPost = async (context: {
  request: Request
  env: { SESSIONS_KV: KVNamespaceLike }
}): Promise<Response> => {
  try {
    const { sessionId, message } = (await context.request.json()) as {
      sessionId?: string
      message: string
    }

    if (!message || typeof message !== 'string') {
      return json({ error: 'message is required' }, 400)
    }
    if (message.length > MAX_MESSAGE_CHARS) {
      return json({ error: `message must be ${MAX_MESSAGE_CHARS} characters or fewer` }, 413)
    }
    if (sessionId && sessionId.length > MAX_SESSION_ID_CHARS) {
      return json({ error: `sessionId must be ${MAX_SESSION_ID_CHARS} characters or fewer` }, 400)
    }

    // Bring-your-own-key: the API key is supplied by the user, never stored server-side.
    const apiKey = context.request.headers.get('x-api-key') ?? ''
    const provider: AIProvider = context.request.headers.get('x-ai-provider') === 'openai' ? 'openai' : 'claude'
    if (!apiKey) {
      return json({ error: 'Add your API key in Settings to start chatting.' }, 401)
    }

    const repo = new KVChatRepository(context.env.SESSIONS_KV)

    const sid = sessionId ?? nanoid()
    ;(await repo.getSession(sid)) ?? (await repo.createSession(sid, message))

    // Retrieve relevant knowledge
    const sources = retrieve(message, 3)

    const contextText = sources.length > 0
      ? sources.map(s => `## ${s.platform} — ${s.title}\n${s.content}`).join('\n\n---\n\n')
      : 'No specific knowledge base entries matched. Answer from general expertise.'

    const userPrompt = `Relevant knowledge base context:
${contextText}

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
    await repo.addMessage(sid, userMsg)

    // Call AI
    let answer: string
    try {
      answer = await chat(SYSTEM_PROMPT, userPrompt, { provider, apiKey })
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
    await repo.addMessage(sid, assistantMsg)

    return json({ sessionId: sid, message: assistantMsg })
  } catch (error) {
    console.error('POST /api/chat error:', error)
    return json({ error: 'Internal server error' }, 500)
  }
}
