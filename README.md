# The Monitor

**The Monitor** is a cinematic financial intelligence dashboard built with Next.js, Tailwind, and Three.js. It turns live macro news, geopolitical headlines, and market signals into an interactive command-center experience with globe-based event mapping, AI-generated analysis, and fast-moving ticker infrastructure.

## Why It Exists

Most dashboards feel like spreadsheets in disguise. The Monitor aims for something sharper: a live intelligence surface where market-moving events are spatial, visual, and immediately actionable.

It blends:

- real-time financial and geopolitical news
- global and Indian market ticker data
- AI-assisted event analysis
- timeline playback for unfolding events
- an immersive globe interface for event discovery

## Core Experience

- **Live intelligence feed** with event cards derived from current news articles
- **Interactive 3D globe** that places events geographically and lets users drill into impact
- **AI analysis panel** powered by Gemini with automatic fallback simulation when no key is configured
- **Market context layer** with asset impact scoring, sentiment tagging, and historical correlation blocks
- **Global + Indian stock tracking** using Yahoo Finance-backed server routes
- **Filtering controls** for search, region, sentiment, and impact threshold
- **Timeline playback** to replay how the current intelligence picture builds over time

## Stack

- **Framework:** Next.js App Router
- **UI:** React
- **Styling:** Tailwind CSS
- **3D / Visualization:** `three`, `@react-three/fiber`, `@react-three/drei`
- **AI:** Google Gemini via `@google/generative-ai`
- **Data sources:** GNews, Finnhub, Yahoo Finance

## Project Structure

```text
app/
  api/
    analyze/         AI event analysis endpoint
    indian-stocks/   Indian market ticker endpoint
    news/            News aggregation endpoint
    stocks/          Global market ticker endpoint
  globals.css
  layout.js
  loading.js
  page.js

components/          Dashboard UI, globe, panels, controls, feeds
hooks/               Client data orchestration
lib/                 Mock seed data
src_old/             Legacy snapshot / older implementation
```

## How It Works

### 1. News ingestion

The client fetches `/api/news`, which aggregates articles from:

- **GNews** for macro and geopolitical coverage
- **Finnhub** for broad market and general news flow

If live news is unavailable, the UI still has seeded mock intelligence from [`lib/mockData.js`](C:/Users/kkewa/Downloads/The-Moniter/lib/mockData.js).

### 2. Event generation

Inside [`hooks/useIntelligenceFeed.js`](C:/Users/kkewa/Downloads/The-Moniter/hooks/useIntelligenceFeed.js), incoming articles are transformed into structured events with:

- derived region and coordinates
- sentiment classification
- impact score
- market asset mapping
- timestamp formatting for UI playback

### 3. Visual intelligence layer

The main dashboard in [`app/page.js`](C:/Users/kkewa/Downloads/The-Moniter/app/page.js) combines:

- left rail notification feed
- center-stage globe visualization
- bottom event deep-dive drawer
- right rail source intelligence and financial news

### 4. AI analysis

[`app/api/analyze/route.js`](C:/Users/kkewa/Downloads/The-Moniter/app/api/analyze/route.js) sends selected event data to Gemini and expects structured JSON with:

- historical parallels
- deep historical match
- AI reasoning
- market projection
- confidence score

If `GEMINI_API_KEY` is missing or invalid, the route falls back to deterministic simulated analysis so the app remains usable during local development.

## Environment Variables

Create a local `.env.local` with the following values:

```env
GEMINI_API_KEY=your_google_gemini_key
GNEWS_API_KEY=your_gnews_key
FINNHUB_API_KEY=your_finnhub_key
```

Notes:

- `GEMINI_API_KEY` enables live AI analysis.
- `GNEWS_API_KEY` and `FINNHUB_API_KEY` improve the news feed.
- The app degrades gracefully when keys are missing, but live intelligence quality will be reduced.

## Local Development

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## API Endpoints

### `GET /api/news`

Aggregates macro, geopolitical, and finance news with short-term in-memory caching.

### `GET /api/stocks`

Returns global tickers and major assets using Yahoo Finance chart data.

### `GET /api/indian-stocks`

Returns Indian equities and index data for the India-focused market strip.

### `POST /api/analyze`

Accepts an event payload and returns structured AI analysis for dashboard rendering.

## What Makes It Cool

This project is not trying to be a plain admin panel. It is built more like a market-ops interface:

- bold, high-density information design
- visual storytelling through the globe and timeline
- intelligence-style labeling, sentiment, and briefing surfaces
- a hybrid of live data, editorial framing, and model-generated context

## Current Characteristics

- Uses in-memory route caching for fast repeated requests
- Uses heuristic event classification for region, sentiment, and asset impact
- Supports live mode and fallback mode
- Includes a legacy `src_old/` directory that likely documents the app's earlier direction

## Good Next Steps

- persist cached data or event history beyond runtime memory
- add source deduplication and stronger article ranking
- replace heuristic sentiment with model-assisted classification
- introduce authentication and saved watchlists
- add tests around API routes and feed transformation logic

## Build Notes

- The globe is dynamically imported client-side to avoid SSR issues with 3D rendering.
- The dashboard is optimized for a dramatic, full-screen layout rather than a generic card grid.
- Market and news freshness depend on third-party API availability and quotas.
