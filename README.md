# 🌐 THE MONITOR

### *Cinematic Intelligence. Real-Time OSINT. Market Command.*

**The Monitor** is a high-density financial and geopolitical intelligence surface. It transforms fragmented news, macro signals, and live market data into a cohesive, interactive command-center experience. Built for those who need to see the world’s moving parts in one frame.

![The Monitor Dashboard Interface](./public/screenshots/dashboard.png)

---

## 🚀 The Vision

Most financial dashboards are spreadsheets in disguise. **The Monitor** is different. It treats market-moving events as spatial and visual stories. It combines live global news aggregation with 3D geographic mapping and AI-driven impact analysis to provide a "God-view" of the global landscape.

## ✨ Core Experience

### 📍 Global Intelligence Matrix
An immersive **3D Globe** that maps real-time news events geographically. Instantly see where the world is "heating up" with color-coded sentiment markers.

### 🤖 AI Intelligence Analysis
Powered by **Google Gemini**, the system automatically synthesizes complex headlines into structured intelligence reports, providing historical parallels, market projections, and confidence scores.

![AI Analysis Panel](./public/screenshots/analysis.png)

### 📊 Live Market Context
A dedicated **Market Layer** tracking Global and Indian equities, indices, and assets. Includes asset impact scoring and sentiment tagging to help you understand the *why* behind the price action.

### 📡 Real-Time OSINT Feed
Aggregated streams from **GNews** and **Finnhub**, refined and classified into structured event cards with derived impact metrics.

---

## 🛠️ Technical Stack

- **Framework:** Next.js (App Router)
- **UI Architecture:** React + Tailwind CSS
- **Visualization:** Three.js / React Three Fiber / Drei
- **Artificial Intelligence:** Google Generative AI (Gemini Pro)
- **Data Orchestration:** Custom API routes with multi-source aggregation (GNews, Finnhub, Yahoo Finance)

---

## ⚙️ Quick Start

### 1. Prerequisites
Ensure you have Node.js installed.

### 2. Environment Setup
Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_google_gemini_key
GNEWS_API_KEY=your_gnews_key
FINNHUB_API_KEY=your_finnhub_key
```

### 3. Installation & Launch
```bash
npm install
npm run dev
```
Navigate to `http://localhost:3000` to enter the command center.

---

## 🏗️ Project Architecture

```text
app/
  api/
    analyze/         # AI analysis engine
    news/            # Multi-source news aggregator
    stocks/          # Global market data
    indian-stocks/   # NSE/BSE specific tracking
components/          # 3D Globe, Intel Panels, Notification Feed
hooks/               # Real-time data orchestration logic
lib/                 # Intelligence seed & mock data
```

---

## 🛡️ License
Built for educational and research purposes. All market data is subject to API terms of service.
