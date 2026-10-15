// Helper to create relative ISO timestamps so baseline data always looks live
function minutesAgoISO(minutes) {
  return new Date(Date.now() - minutes * 60000).toISOString();
}

export const INITIAL_EVENTS = [
  {
    id: "ev_001",
    title: "China increases sovereign gold reserves for 18th consecutive month",
    timestamp: "4 min ago",
    publishedAt: minutesAgoISO(4),
    source: "REUTERS",
    url: "https://www.reuters.com",
    tags: ["Gold", "China", "Macro", "Asia"],
    sentiment: "bullish",
    impactScore: 84,
    region: "Asia",
    coordinates: [35.8617, 104.1954],
    description: "The People's Bank of China reported a significant increase in gold holdings, continuing a multi-year diversification strategy away from USD-denominated sovereign assets.",
    impacts: [
      { asset: "Gold", bullish: 82, bearish: 10, neutral: 8, reasoning: ["Increased sovereign reserve allocation", "De-dollarization hedge momentum", "Central bank net accumulation"] },
      { asset: "USD", bullish: 25, bearish: 65, neutral: 10, reasoning: ["Diminished marginal demand in foreign reserves", "Bilateral currency swaps expansion"] },
      { asset: "S&P 500", bullish: 45, bearish: 40, neutral: 15, reasoning: ["Inflation-hedge rotation", "Neutral baseline correlation"] }
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
    title: "US Federal Reserve signals 'Higher for Longer' policy posture",
    timestamp: "18 min ago",
    publishedAt: minutesAgoISO(18),
    source: "BLOOMBERG",
    url: "https://www.bloomberg.com",
    tags: ["USD", "Rates", "US", "North America"],
    sentiment: "bearish",
    impactScore: 92,
    region: "North America",
    coordinates: [38.9072, -77.0369],
    description: "Recent FOMC minutes indicate a broad consensus on maintaining restrictive policy levels to combat persistent service-sector wage pressures and housing costs.",
    impacts: [
      { asset: "USD", bullish: 75, bearish: 15, neutral: 10, reasoning: ["Sovereign yield curve differential advantage", "Safe-haven capital inflows"] },
      { asset: "S&P 500", bullish: 20, bearish: 70, neutral: 10, reasoning: ["Discount rate headwinds on equity valuations", "Higher commercial debt servicing costs"] },
      { asset: "Bitcoin", bullish: 25, bearish: 60, neutral: 15, reasoning: ["High-beta risk-asset liquidity compression", "Real yields competition"] }
    ],
    historicalCorrelations: {
      pastEvent: "FOMC Policy Shift (Jan 2019)",
      similarity: 88,
      impacts: [
        { symbol: "SPY", name: "S&P 500 ETF Trust", change: "-12.4%", period: "30 Days Post" },
        { symbol: "TLT", name: "iShares 20+ Year Treasury Bond", change: "-6.2%", period: "30 Days Post" },
        { symbol: "QQQ", name: "Invesco QQQ Trust", change: "-15.1%", period: "30 Days Post" }
      ]
    }
  },
  {
    id: "ev_003",
    title: "EU accelerates clean energy capital expenditures amid regional security review",
    timestamp: "45 min ago",
    publishedAt: minutesAgoISO(45),
    source: "FINANCIAL TIMES",
    url: "https://www.ft.com",
    tags: ["Energy", "Europe", "Infrastructure"],
    sentiment: "neutral",
    impactScore: 68,
    region: "Europe",
    coordinates: [50.8503, 4.3517],
    description: "European Commission announces finalized subsidies for green hydrogen networks and grid resilience to decouple industrial base from hydrocarbon volatility.",
    impacts: [
      { asset: "Crude Oil", bullish: 30, bearish: 55, neutral: 15, reasoning: ["Structural long-term demand contraction", "Regulatory efficiency mandates"] },
      { asset: "Renewables ETF", bullish: 85, bearish: 5, neutral: 10, reasoning: ["Direct sovereign capex matching", "Accelerated grid permitting"] }
    ],
    historicalCorrelations: {
      pastEvent: "European Energy Security Repositioning (2022)",
      similarity: 78,
      impacts: [
        { symbol: "ICLN", name: "iShares Global Clean Energy", change: "+28.4%", period: "180 Days Post" },
        { symbol: "XLE", name: "Energy Select Sector SPDR", change: "-14.2%", period: "180 Days Post" },
        { symbol: "EWG", name: "iShares MSCI Germany ETF", change: "+8.9%", period: "90 Days Post" }
      ]
    }
  },
  {
    id: "ev_004",
    title: "India inaugurates major semiconductor fabrication corridor in Gujarat",
    timestamp: "1 hr ago",
    publishedAt: minutesAgoISO(65),
    source: "ECONOMIC TIMES",
    url: "https://economictimes.indiatimes.com",
    tags: ["India", "Tech", "Semiconductors", "Asia"],
    sentiment: "bullish",
    impactScore: 81,
    region: "Asia",
    coordinates: [23.0225, 72.5714],
    description: "A consortium of global chipmakers breaks ground on advanced packaging and 28nm wafer fabrication facilities with government PLI capital incentives.",
    impacts: [
      { asset: "NIFTY 50", bullish: 80, bearish: 10, neutral: 10, reasoning: ["High value-add industrial expansion", "Foreign institutional capital inflows"] },
      { asset: "Tech Hardware", bullish: 75, bearish: 15, neutral: 10, reasoning: ["Supply chain de-risking from East Asia", "Electronics export boost"] }
    ],
    historicalCorrelations: {
      pastEvent: "Taiwan Semiconductor Expansion Initiative",
      similarity: 82,
      impacts: [
        { symbol: "INDA", name: "iShares MSCI India ETF", change: "+16.8%", period: "120 Days Post" },
        { symbol: "SMH", name: "VanEck Semiconductor ETF", change: "+14.1%", period: "90 Days Post" },
        { symbol: "TCS.NS", name: "Tata Consultancy Services", change: "+9.4%", period: "60 Days Post" }
      ]
    }
  },
  {
    id: "ev_005",
    title: "Gulf petrochemical hub expands maritime export logistics network",
    timestamp: "2 hr ago",
    publishedAt: minutesAgoISO(120),
    source: "AL JAZEERA",
    url: "https://www.aljazeera.com",
    tags: ["Middle East", "Oil", "Trade"],
    sentiment: "neutral",
    impactScore: 74,
    region: "Middle East",
    coordinates: [25.2048, 55.2708],
    description: "Major Gulf energy producers unveil integrated container routing terminals to optimize crude distillation and chemical derivatives shipping into Asian trade corridors.",
    impacts: [
      { asset: "Crude Oil", bullish: 45, bearish: 35, neutral: 20, reasoning: ["Improved export efficiency offset by quota caps", "Stable tanker freight availability"] },
      { asset: "Global Logistics", bullish: 65, bearish: 15, neutral: 20, reasoning: ["Lower supply-chain friction", "Increased inter-regional transit capacity"] }
    ],
    historicalCorrelations: {
      pastEvent: "Strait of Hormuz Logistics Upgrades (2018)",
      similarity: 79,
      impacts: [
        { symbol: "USO", name: "United States Oil Fund", change: "+11.2%", period: "60 Days Post" },
        { symbol: "BNO", name: "United States Brent Oil Fund", change: "+12.8%", period: "60 Days Post" },
        { symbol: "SMR", name: "Global Shipping Index", change: "+7.5%", period: "90 Days Post" }
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
