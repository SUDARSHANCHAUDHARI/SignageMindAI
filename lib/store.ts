import type { ChatSession, Message } from './types'

const sessions = new Map<string, ChatSession>()

export function createSession(id: string, firstMessage?: string): ChatSession {
  const session: ChatSession = {
    id,
    title: firstMessage ? firstMessage.slice(0, 60) : 'New conversation',
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  sessions.set(id, session)
  return session
}

export function getSession(id: string): ChatSession | undefined {
  return sessions.get(id)
}

export function listSessions(): ChatSession[] {
  return Array.from(sessions.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

export function addMessage(sessionId: string, message: Message): ChatSession | null {
  const session = sessions.get(sessionId)
  if (!session) return null
  session.messages.push(message)
  session.updatedAt = new Date().toISOString()
  if (session.messages.length === 1) {
    session.title = message.content.slice(0, 60)
  }
  return session
}
