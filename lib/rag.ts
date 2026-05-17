import { KNOWLEDGE_BASE } from './knowledge'
import type { KnowledgeEntry } from './types'

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean)
}

function score(entry: KnowledgeEntry, queryTokens: string[]): number {
  const entryText = [
    entry.title,
    entry.content,
    entry.category,
    entry.platform,
    entry.tags.join(' '),
  ].join(' ')

  const entryTokens = new Set(tokenize(entryText))
  let hits = 0
  for (const token of queryTokens) {
    if (token.length < 3) continue
    if (entryTokens.has(token)) {
      // Tag and title matches are worth more
      const inTitle = tokenize(entry.title).includes(token)
      const inTags = entry.tags.some(t => t.includes(token))
      hits += inTitle || inTags ? 3 : 1
    }
  }
  return hits
}

export function retrieve(query: string, topK = 3): KnowledgeEntry[] {
  const queryTokens = tokenize(query)
  if (queryTokens.length === 0) return []

  const scored = KNOWLEDGE_BASE.map(entry => ({ entry, score: score(entry, queryTokens) }))
  scored.sort((a, b) => b.score - a.score)

  return scored
    .filter(r => r.score > 0)
    .slice(0, topK)
    .map(r => r.entry)
}
