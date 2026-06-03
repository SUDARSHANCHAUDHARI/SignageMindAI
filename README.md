# SignageMind AI

AI-powered knowledge base for digital signage support.

## Features

- Internal documentation upload and ingestion
- Question answering with sourced responses
- Troubleshooting step generation
- Search and RAG capabilities
- Support team assistance

## Tech Stack

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Vector database
- Search engine
- AI API integration

## Getting Started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open http://localhost:3000.

## Environment Variables

```env
AI_PROVIDER=claude
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
SIGNAGE_DATA_DIR=.signage-data
SIGNAGE_STORAGE_DRIVER=file
```

The built-in knowledge base works without ingestion. AI answers require either `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`.

Chat sessions are stored in file-backed JSON under `SIGNAGE_DATA_DIR`. Use a persistent mounted volume in production. Set `SIGNAGE_STORAGE_DRIVER=memory` only when you want disposable demo data.

## Production Checks

```bash
pnpm typecheck
pnpm build
```

## License

MIT
