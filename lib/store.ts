import type { ChatSession, Message } from './types'
import { getChatRepository } from './storage'

export async function createSession(id: string, firstMessage?: string): Promise<ChatSession> {
  return getChatRepository().createSession(id, firstMessage)
}

export async function getSession(id: string): Promise<ChatSession | undefined> {
  return getChatRepository().getSession(id)
}

export async function listSessions(): Promise<ChatSession[]> {
  return getChatRepository().listSessions()
}

export async function addMessage(sessionId: string, message: Message): Promise<ChatSession | null> {
  return getChatRepository().addMessage(sessionId, message)
}
