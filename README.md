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
```

The built-in knowledge base works without ingestion. AI answers require either `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`.

## Production Checks

```bash
pnpm typecheck
pnpm build
```

## License

MIT
