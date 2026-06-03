import type { ChatSession, Message } from '../types'

export interface ChatRepository {
  createSession(id: string, firstMessage?: string): Promise<ChatSession>
  getSession(id: string): Promise<ChatSession | undefined>
  listSessions(): Promise<ChatSession[]>
  addMessage(sessionId: string, message: Message): Promise<ChatSession | null>
}
