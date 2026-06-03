import { MemoryChatRepository } from './memory'
import type { ChatRepository } from './types'

const repository: ChatRepository = new MemoryChatRepository()

export function getChatRepository(): ChatRepository {
  return repository
}
