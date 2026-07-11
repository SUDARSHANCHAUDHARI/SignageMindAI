import type { ChatSession, Message } from '../types'
import type { ChatRepository } from './types'

// Minimal shape of a Cloudflare KV namespace — only the methods this driver uses.
// Declared locally so lib/ stays typecheckable without @cloudflare/workers-types.
export interface KVNamespaceLike {
  get(key: string): Promise<string | null>
  put(key: string, value: string): Promise<void>
  delete(key: string): Promise<void>
  list(options?: { prefix?: string }): Promise<{ keys: { name: string }[] }>
}

const KEY_PREFIX = 'session:'
const keyFor = (id: string) => `${KEY_PREFIX}${id}`

/**
 * Cloudflare KV-backed chat store. Each session is one JSON value under
 * `session:<id>`. Persists across requests/isolates (unlike the memory driver),
 * which is what production on Cloudflare Pages needs.
 */
export class KVChatRepository implements ChatRepository {
  constructor(private readonly kv: KVNamespaceLike) {}

  async createSession(id: string, firstMessage?: string): Promise<ChatSession> {
    const now = new Date().toISOString()
    const session: ChatSession = {
      id,
      title: firstMessage ? firstMessage.slice(0, 60) : 'New conversation',
      messages: [],
      createdAt: now,
      updatedAt: now,
    }
    await this.kv.put(keyFor(id), JSON.stringify(session))
    return session
  }

  async getSession(id: string): Promise<ChatSession | undefined> {
    const raw = await this.kv.get(keyFor(id))
    return raw ? (JSON.parse(raw) as ChatSession) : undefined
  }

  async listSessions(): Promise<ChatSession[]> {
    const { keys } = await this.kv.list({ prefix: KEY_PREFIX })
    const sessions = await Promise.all(
      keys.map(async (k) => {
        const raw = await this.kv.get(k.name)
        return raw ? (JSON.parse(raw) as ChatSession) : null
      })
    )
    return sessions
      .filter((s): s is ChatSession => s !== null)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }

  async addMessage(sessionId: string, message: Message): Promise<ChatSession | null> {
    const session = await this.getSession(sessionId)
    if (!session) return null
    session.messages.push(message)
    session.updatedAt = new Date().toISOString()
    if (session.messages.length === 1) {
      session.title = message.content.slice(0, 60)
    }
    await this.kv.put(keyFor(sessionId), JSON.stringify(session))
    return session
  }
}
