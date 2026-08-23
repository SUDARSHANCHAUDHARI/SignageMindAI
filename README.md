# SignageMind AI

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-blue)

Knowledge assistant for digital signage support. Ask platform and troubleshooting questions, get sourced answers, and keep chat sessions across restarts.

## Table of Contents

- [What It Does](#what-it-does)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Production Checks](#production-checks)
- [Release Notes](#release-notes)
- [License](#license)
- [About](#about)

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

## License

MIT

---

## About

I'm Sudarshan Chaudhari, a Senior Quality Engineer, Test Automation specialist, and AI systems builder based in Bangkok, Thailand.

I have 13+ years of experience in software quality engineering, working across SaaS, fintech, gaming, web, mobile, cloud, and digital signage platforms. My background combines hands-on test automation with QA leadership, test strategy, CI/CD, release quality, production investigation, and cross-platform validation.

Alongside my professional QA career, I run [SudarshanTechLabs](https://sudarshantechlabs.com/), my independent engineering and product lab where I design, build, test, and ship software across Android, web, AI, cybersecurity, developer tooling, and cross-platform applications.

### What I work on

- ⚙️ **Quality Engineering & Test Automation** — Playwright, Selenium, Cypress, Appium, API testing, automation frameworks, end-to-end testing, CI/CD, release gates, GitHub Actions, risk-based testing, and production validation
- 🤖 **AI Systems & Automation** — AI agents, multi-agent orchestration, MCP servers, AI-assisted QA, prompt tooling, developer workflows, automation systems, and Claude Code plugins
- 📱 **Mobile & Cross-Platform Applications** — Android applications built with Kotlin and Jetpack Compose, Google Play releases, automated build and publishing pipelines, and cross-platform development spanning iOS, web, Windows, and macOS
- 🌐 **Web Applications & Platforms** — Full-stack applications using Next.js, TypeScript, Firebase, Cloudflare, REST APIs, and modern web infrastructure
- 🛠️ **Developer Tooling & CLI Engineering** — Rust, Python, TypeScript, CLI utilities, multi-repository tooling, build automation, release tooling, and engineering productivity systems
- 🛡️ **Cybersecurity & Observability** — Threat detection, log analysis, security auditing, vulnerability assessment, monitoring, and security-focused developer tools
- 📺 **Digital Signage & Device Platforms** — Content validation, playback testing, device compatibility, production investigation, monitoring, and QA across diverse hardware and operating-system environments

My work sits at the intersection of quality engineering, automation, AI, and software development. I approach products with a QA mindset from the beginning: understanding failure modes, designing for testability, automating repetitive work, and building release confidence into the engineering process.

Through SudarshanTechLabs, I also build products and tools from idea to production, covering architecture, development, testing, CI/CD, release automation, monitoring, and ongoing maintenance.

🌐 [sudarshantechlabs.com](https://sudarshantechlabs.com/) · 💼 [LinkedIn](https://linkedin.com/in/sudarshan-chaudhari) · 🐙 [GitHub](https://github.com/SUDARSHANCHAUDHARI) · ✉️ [sunny.sudarshan@gmail.com](mailto:sunny.sudarshan@gmail.com)
