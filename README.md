# Agent Nova

<p align="center">
  <img src="/logo.png" alt="Agent Nova" width="220" />
</p>

<p align="center">
  AI-powered crypto intelligence — real-time token analysis using Birdeye Data and OpenRouter LLM.
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs" />
  <img alt="React" src="https://img.shields.io/badge/React-18-149ECA?logo=react&logoColor=white" />
  <img alt="TanStack Query" src="https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white" />
  <img alt="Framer Motion" src="https://img.shields.io/badge/Framer_Motion-11-0055FF?logo=framer&logoColor=white" />
  <img alt="OpenRouter" src="https://img.shields.io/badge/OpenRouter-API-412991" />
  <img alt="Birdeye" src="https://img.shields.io/badge/Birdeye-Data-FF6B35" />
</p>

## Overview

Agent Nova turns raw blockchain data into actionable investment decisions. It pulls live token data from [Birdeye](https://bds.birdeye.so) and produces structured AI analysis via [OpenRouter](https://openrouter.ai), helping users evaluate tokens at a glance.

The app combines:

- Real-time token dashboards with 15s auto-refresh
- AI-powered risk, opportunity, and verdict scoring
- Search-by-address or symbol for instant token analysis
- A polished, mobile-friendly UI with animated transitions

## Birdeye Data Integration

Built on Birdeye's free-tier API for the [Birdeye API Sprint](https://earn.superteam.fun/api/sprints/birdeye/).

**Endpoints used:**

| Endpoint | Purpose |
|----------|---------|
| `GET /defi/token_trending` | Fetches top trending tokens with price, volume, liquidity, and market cap data |
| `GET /defi/v2/tokens/new_listing` | Fetches newly listed tokens with metadata and liquidity |

Data is polled every 15 seconds (trending) and 30 seconds (new listings) via TanStack Query to maintain a live view.

## Features

### Top Opportunities

Curated view of trending tokens ranked by market activity. Displays price, 24h change, volume, liquidity, and market cap in a card layout with skeleton loading states.

### New Listings

Table of the latest token launches on Solana. Shows available metadata with graceful fallbacks for missing price/volume data (renders `—` instead of zeros).

### Trending Analysis

Deep-dive cards for the top 3 trending tokens with contextual insight blurbs generated from live metrics — momentum assessment, volume analysis, and volatility notes.

### Ask AI

Search any token by address or symbol. Sends real-time market data to OpenRouter (GPT-4o-mini) and returns a structured analysis:

- **Risk** — Low / Medium / High
- **Opportunity** — Low / Medium / High
- **Insight** — 1-2 sentence narrative
- **Verdict** — Watch / Avoid / Potential Entry
- **Score** — 0-100 numerical rating

Results scroll into view with a smooth animation.

## Tech Stack

- **Next.js 14** (App Router) — framework
- **React 18** — UI library
- **TypeScript** — type safety
- **Tailwind CSS 3** — styling
- **Framer Motion 11** — animations
- **TanStack Query 5** — data fetching and polling
- **OpenRouter** — LLM inference (GPT-4o-mini)
- **Birdeye** — onchain token data
- **OpenAI SDK** — structured JSON completion

## Project Structure

```text
app/
├── api/
│   ├── analyze/route.ts    — POST: accepts token data, returns AI analysis
│   └── tokens/route.ts     — GET: proxies Birdeye trending and new listings
├── globals.css             — body grid, glass, gradient-text utilities
├── layout.tsx              — Sora font, QueryProvider wrapper
└── page.tsx                — main page with all 4 sections
components/
├── AIInsight.tsx           — full AI analysis display panel
├── QueryProvider.tsx        — TanStack Query client provider
├── TokenCard.tsx            — trending token card with hover effects
├── TokenSearch.tsx          — address/symbol input with suggestions
├── TokenTable.tsx           — new listings table with null-safe formatting
└── TypeWriter.tsx           — letter-by-letter text animation
lib/
├── ai.ts                   — OpenRouter client + prompt template
└── birdeye.ts              — Birdeye API client + TokenData interface
```

## Environment

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `BIRDEYE_API_KEY` | Yes | API key from [bds.birdeye.so](https://bds.birdeye.so) |
| `OPENROUTER_API_KEY` | Yes | API key from [openrouter.ai](https://openrouter.ai) |

## Quick Start

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your API keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API

### GET /api/tokens?type=trending

Returns the top 20 trending tokens from Birdeye.

### GET /api/tokens?type=new

Returns the latest 20 token listings from Birdeye.

### POST /api/analyze

Sends token data to OpenRouter for AI analysis.

```json
{
  "name": "GIGACHAD",
  "symbol": "GIGA",
  "price": 0.00249,
  "priceChange24h": 15.4,
  "volume24h": 2755428,
  "liquidity": 1865580,
  "marketCap": 23915886
}
```

Response:

```json
{
  "token": { "...": "..." },
  "analysis": {
    "risk": "Medium",
    "opportunity": "High",
    "insight": "...",
    "verdict": "Potential Entry",
    "score": 75
  }
}
```

## Demo

Try searching by symbol or address in the "Ask AI" section:

| Symbol | Address |
|--------|---------|
| `GIGA` | `63LfDmNb3MQ8mw9MtZ2To9bEA2M71kZUUGq5tiJxcqj9` |
| `ADA` | `skDGuSDyKYGbYTWnMCNcPeDd4vHUxAsMNVVxxUfpump` |
| `PENGUIN` | `8Jx8AAHj86wbQgUTjGuj6GTTL5Ps3cqxKRTvpaJApump` |

## License

MIT
