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
- Anthropic SDK and OpenAI SDK
- File-backed JSON storage through a repository interface

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`.

## Environment Variables

```env
AI_PROVIDER=claude
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
SIGNAGE_DATA_DIR=.signage-data
SIGNAGE_STORAGE_DRIVER=file
```

AI answers require either `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`. The built-in knowledge base remains available without ingestion.

## Production Storage

Production uses file-backed JSON under `SIGNAGE_DATA_DIR`.

- Mount `SIGNAGE_DATA_DIR` as persistent writable storage.
- Keep `SIGNAGE_STORAGE_DRIVER=file` in production.
- Use `SIGNAGE_STORAGE_DRIVER=memory` only for disposable demos.

### Hosting Notes

File-backed storage is suitable for a VPS, Docker host, or platform with a persistent disk. For example:

```env
SIGNAGE_STORAGE_DRIVER=file
SIGNAGE_DATA_DIR=/data/signage-mind-ai
```

If you deploy on Vercel or another serverless host, do not rely on local file writes for saved chat sessions. Serverless filesystems can reset between deployments or function instances. For that setup, use this release as the public app/code release and add a managed database adapter before depending on saved chat history in production.

## Production Checks

```bash
pnpm typecheck
pnpm build
```

## Release Notes

- Do not commit `.env`, `.env.local`, or generated `.signage-data` files.
- Keep AI provider keys in the deployment environment.
- Verify the persistent storage volume before public release.

## Author

Built by [Sudarshan Chaudhari](https://github.com/SUDARSHANCHAUDHARI) for **SudarshanTechLabs**.

## License

MIT
