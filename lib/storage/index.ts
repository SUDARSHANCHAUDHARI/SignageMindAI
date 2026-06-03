import { FileChatRepository } from './file'
import { MemoryChatRepository } from './memory'
import type { ChatRepository } from './types'

const repository: ChatRepository =
  process.env.SIGNAGE_STORAGE_DRIVER === 'memory'
    ? new MemoryChatRepository()
    : new FileChatRepository()

export function getChatRepository(): ChatRepository {
  return repository
}
