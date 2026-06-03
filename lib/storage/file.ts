import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import type { ChatSession, Message } from '../types'
import type { ChatRepository } from './types'

export class FileChatRepository implements ChatRepository {
  private readonly filePath: string
  private writeQueue = Promise.resolve()

  constructor(dataDir = process.env.SIGNAGE_DATA_DIR ?? join(process.cwd(), '.signage-data')) {
    this.filePath = join(dataDir, 'chat-sessions.json')
  }

  async createSession(id: string, firstMessage?: string): Promise<ChatSession> {
    const session: ChatSession = {
      id,
      title: firstMessage ? firstMessage.slice(0, 60) : 'New conversation',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await this.withWriteLock(async () => {
      const sessions = await this.readAll()
      const next = new Map(sessions.map(item => [item.id, item]))
      next.set(id, session)
      await this.writeAll(Array.from(next.values()))
    })

    return session
  }

  async getSession(id: string): Promise<ChatSession | undefined> {
    return (await this.readAll()).find(session => session.id === id)
  }

  async listSessions(): Promise<ChatSession[]> {
    return (await this.readAll()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  }

  async addMessage(sessionId: string, message: Message): Promise<ChatSession | null> {
    let updatedSession: ChatSession | null = null

    await this.withWriteLock(async () => {
      const sessions = await this.readAll()
      const next = sessions.map(session => {
        if (session.id !== sessionId) return session
        updatedSession = {
          ...session,
          title: session.messages.length === 0 ? message.content.slice(0, 60) : session.title,
          messages: [...session.messages, message],
          updatedAt: new Date().toISOString(),
        }
        return updatedSession
      })
      await this.writeAll(next)
    })

    return updatedSession
  }

  private async readAll(): Promise<ChatSession[]> {
    try {
      const raw = await readFile(this.filePath, 'utf8')
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed as ChatSession[] : []
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
      throw error
    }
  }

  private async writeAll(sessions: ChatSession[]): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true })
    const tempPath = `${this.filePath}.tmp`
    await writeFile(tempPath, `${JSON.stringify(sessions, null, 2)}\n`, 'utf8')
    await rename(tempPath, this.filePath)
  }

  private async withWriteLock(operation: () => Promise<void>): Promise<void> {
    this.writeQueue = this.writeQueue.then(operation, operation)
    return this.writeQueue
  }
}
