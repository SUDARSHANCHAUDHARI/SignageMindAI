import type { ChatSession, Message } from '../types'
import type { ChatRepository } from './types'

export class MemoryChatRepository implements ChatRepository {
  private readonly sessions = new Map<string, ChatSession>()

  async createSession(id: string, firstMessage?: string): Promise<ChatSession> {
    const session: ChatSession = {
      id,
      title: firstMessage ? firstMessage.slice(0, 60) : 'New conversation',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.sessions.set(id, session)
    return session
  }

  async getSession(id: string): Promise<ChatSession | undefined> {
    return this.sessions.get(id)
  }

  async listSessions(): Promise<ChatSession[]> {
    return Array.from(this.sessions.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  }

  async addMessage(sessionId: string, message: Message): Promise<ChatSession | null> {
    const session = this.sessions.get(sessionId)
    if (!session) return null
    session.messages.push(message)
    session.updatedAt = new Date().toISOString()
    if (session.messages.length === 1) {
      session.title = message.content.slice(0, 60)
    }
    return session
  }
}
