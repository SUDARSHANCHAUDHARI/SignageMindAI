// Cloudflare Pages Function — GET /api/sessions.
// Disabled: it listed every visitor's chat sessions from KV, and the app has no
// per-visitor identity to scope the list to. The chat UI never called it.
export const onRequestGet = async (): Promise<Response> =>
  new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 'content-type': 'application/json' },
  })
