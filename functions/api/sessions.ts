// Cloudflare Pages Function — serves GET /api/sessions.
// Ported from app/api/sessions/route.ts. Reads sessions from Cloudflare KV.
import { KVChatRepository, type KVNamespaceLike } from '../../lib/storage/kv'

export const onRequestGet = async (context: {
  env: { SESSIONS_KV: KVNamespaceLike }
}): Promise<Response> => {
  const repo = new KVChatRepository(context.env.SESSIONS_KV)
  const sessions = await repo.listSessions()
  return new Response(JSON.stringify(sessions), {
    headers: { 'content-type': 'application/json' },
  })
}
