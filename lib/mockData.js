export const INITIAL_EVENTS = [
  {
    id: "ev_001",
    title: "China increases gold reserves for 18th consecutive month",
    timestamp: "2 min ago",
    publishedAt: "2026-04-25T12:28:00.000Z",
    source: "REUTERS",
    tags: ["Gold", "China", "Macro"],
    sentiment: "bullish",
    impactScore: 78,
    region: "Asia",
    coordinates: [35.8617, 104.1954],
    description: "The People's Bank of China reported a significant increase in gold holdings, continuing a long-term diversification strategy away from USD-denominated assets.",
    impacts: [
      { asset: "Gold", bullish: 82, bearish: 10, neutral: 8, reasoning: ["Increased sovereign demand", "USD diversification signal", "Safe haven momentum"] },
      { asset: "USD", bullish: 25, bearish: 65, neutral: 10, reasoning: ["Reduced central bank reliance", "Currency competition"] },
      { asset: "S&P 500", bullish: 45, bearish: 40, neutral: 15, reasoning: ["Neutral macro impact", "Inflation hedge sentiment"] }
    ],
    historicalCorrelations: {
      pastEvent: "China Gold Reserve Peak (Nov 2021)",
      similarity: 92,
      impacts: [
        { symbol: "GLD", name: "SPDR Gold Shares", change: "+14.2%", period: "90 Days Post" },
        { symbol: "GDX", name: "VanEck Gold Miners ETF", change: "+21.5%", period: "90 Days Post" },
        { symbol: "UUP", name: "Invesco DB US Dollar Index", change: "-4.8%", period: "90 Days Post" }
      ]
    }
  },
  {
    id: "ev_002",
    title: "US Federal Reserve signals 'Higher for Longer' interest rate policy",
    timestamp: "15 min ago",
    publishedAt: "2026-04-25T12:15:00.000Z",
    source: "BLOOMBERG",
    tags: ["USD", "Rates", "US"],
    sentiment: "bearish",
    impactScore: 92,
    region: "North America",
    coordinates: [38.9072, -77.0369],
    description: "Recent FOMC minutes indicate a consensus on maintaining restrictive policy levels to combat persistent service-sector inflation.",
    impacts: [
      { asset: "USD", bullish: 75, bearish: 15, neutral: 10, reasoning: ["Yield advantage", "Inflow attraction"] },
      { asset: "S&P 500", bullish: 20, bearish: 70, neutral: 10, reasoning: ["Valuation pressure", "Borrowing costs"] },
      { asset: "Bitcoin", bullish: 15, bearish: 65, neutral: 20, reasoning: ["Risk-off sentiment", "Liquidity tightening"] }
    ],
    historicalCorrelations: {
      pastEvent: "FOMC 'Powell Pivot' (Jan 2019)",
      similarity: 88,
      impacts: [
        { symbol: "SPY", name: "S&P 500 ETF", change: "-12.4%", period: "30 Days Post" },
        { symbol: "TLT", name: "iShares 20+ Year Treasury Bond", change: "-6.2%", period: "30 Days Post" },
        { symbol: "QQQ", name: "Invesco QQQ Trust", change: "-15.1%", period: "30 Days Post" }
      ]
    }
  },
  {
    id: "ev_003",
    title: "EU green energy transition fast-tracked amid energy security concerns",
    timestamp: "42 min ago",
    publishedAt: "2026-04-25T11:48:00.000Z",
    source: "BBC NEWS",
    tags: ["Energy", "ESG", "EU"],
    sentiment: "neutral",
    impactScore: 65,
    region: "Europe",
    coordinates: [50.8503, 4.3517],
    description: "European Commission announces new subsidies for hydrogen infrastructure and solar manufacturing to reduce fossil fuel dependency.",
    impacts: [
      { asset: "Crude Oil", bullish: 30, bearish: 55, neutral: 15, reasoning: ["Long-term demand reduction", "Policy shift"] },
      { asset: "Renewables ETF", bullish: 85, bearish: 5, neutral: 10, reasoning: ["Major subsidy tailwinds", "Strategic priority"] }
    ],
    historicalCorrelations: {
      pastEvent: "Global Energy Crisis (2021-2022)",
      similarity: 75,
      impacts: [
        { symbol: "ICLN", name: "iShares Global Clean Energy", change: "+28.4%", period: "180 Days Post" },
        { symbol: "VWDRY", name: "Vestas Wind Systems", change: "+32.1%", period: "180 Days Post" },
        { symbol: "XLE", name: "Energy Select Sector SPDR", change: "-18.5%", period: "180 Days Post" }
      ]
    }
  }
];

export const MARKET_TICKERS = [
  { symbol: "GOLD", price: "2,384.50", change: "+0.82%", trend: "up" },
  { symbol: "S&P 500", price: "5,248.10", change: "-0.45%", trend: "down" },
  { symbol: "BTC", price: "64,210", change: "+1.15%", trend: "up" },
  { symbol: "DXY", price: "105.20", change: "+0.32%", trend: "up" },
  { symbol: "BRENT", price: "82.45", change: "-1.20%", trend: "down" }
];
