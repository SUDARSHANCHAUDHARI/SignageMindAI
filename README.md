# SignageMind AI

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-blue)

Knowledge assistant for digital signage support. Ask platform and troubleshooting questions, get sourced answers, and keep chat sessions across restarts.

## What It Does

SignageMind AI is a support knowledge base for signage teams. It answers questions from built-in support content, cites matching knowledge entries, and saves chat sessions with durable file-backed storage.

## Features

- Chat interface for signage support questions.
- Built-in knowledge entries for signage devices, Windows, FireOS, Tizen, webOS, iframe playback, and general troubleshooting.
- Sourced responses with matched knowledge entries.
- Troubleshooting steps for common device and player issues.
- Durable chat session history through file-backed JSON storage.
- Works without ingestion because the initial knowledge base ships with the app.

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript strict mode
- Tailwind CSS
- Anthropic SDK and OpenAI SDK (called with the visitor's own key)
- Cloudflare KV storage through a repository interface

## Setup

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. No `.env` is required — see Configuration below.

## Configuration

**AI is bring-your-own-key.** There is no server-side API key. Each visitor
adds their own Anthropic or OpenAI key in the app's Settings; it is stored only
in their browser and sent per request (`x-api-key` header), so hosting the app
publicly can never bill your account. The built-in knowledge base works without
any key.

**Storage:** chat sessions persist in **Cloudflare KV** (binding `SESSIONS_KV`).
For local development the repository interface also ships `file` and `memory`
drivers, selectable via `SIGNAGE_STORAGE_DRIVER` (`memory` is handy for tests).

## Deployment

Deployed on **Cloudflare Pages** as a static export + Pages Functions:

- Build command `npx next build`, output directory `out`.
- Compatibility flag `nodejs_compat` (for the AI SDKs).
- Bind a KV namespace as `SESSIONS_KV`.
- Live at `signagemind.sudarshantechlabs.com`.

## Production Checks

```bash
pnpm typecheck
pnpm build
```

## Release Notes

- No API keys live in the repo or the server — AI keys are supplied per-user in the browser.
- Session persistence is Cloudflare KV; the `file` driver is local-dev only.

## Author

Built by [Sudarshan Chaudhari](https://github.com/SUDARSHANCHAUDHARI) for **SudarshanTechLabs**.

## License

MIT
