export type MessageRole = 'user' | 'assistant'

export interface Message {
  id: string
  role: MessageRole
  content: string
  sources: KnowledgeEntry[]
  createdAt: string
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}

export interface KnowledgeEntry {
  id: string
  platform: Platform
  category: string
  title: string
  content: string
  tags: string[]
}

export type Platform = 'Signage device' | 'Windows' | 'FireOS' | 'Tizen' | 'webOS' | 'Iframe' | 'General'
