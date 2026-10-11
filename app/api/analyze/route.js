import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * AI ANALYZE API (Dynamic Gemini Version)
 * Uses Google Gemini 1.5 Flash to perform deep intelligence scans.
 * Falls back gracefully to simulation if the API key is missing or invalid.
 */
export async function POST(request) {
  let eventData = { title: "", tags: [], sentiment: "neutral" };
  
  try {
    const body = await request.json();
    eventData = body;
    const { title, description, tags, sentiment } = body;

    // Fallback immediately if GEMINI_API_KEY is not configured
    if (!apiKey || apiKey === "your_google_gemini_key") {
      return NextResponse.json(generateSimulatedAnalysis(title, tags, sentiment));
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Analyze the following news event for a professional financial intelligence dashboard.
      Your goal is to provide deep macro-economic context and find specialized historical events NOT typically listed in general news.

      EVENT TITLE: ${title}
      EVENT DESCRIPTION: ${description}
      TAGS: ${tags?.join(', ') || 'Global'}
      INITIAL SENTIMENT: ${sentiment}

      Return a JSON object with exactly this structure:
      {
        "historical_parallels": [
          { 
            "year": "YYYY", 
            "event": "Short Name of Event", 
            "outcome": "How it affected markets", 
            "market_trend": "+X% Asset Name", 
            "relevance": "High/Macro" 
          }
        ],
        "deep_historical_match": {
          "event_name": "Unique Historical Event Name",
          "year": "YYYY",
          "context": "A detailed 1-2 sentence explanation of why this is a deep historical match for the current news.",
          "then_vs_now": {
            "then_metric": "e.g. 12% Crude Price",
            "now_metric": "e.g. 5.1% Brent Crude",
            "label": "e.g. Commodity Valuation",
            "narrative": "A quick takeaway on the structural similarity."
          }
        },
        "ai_reasoning": "A concise professional analysis of the market trajectory.",
        "market_projection": "Actionable outcome (e.g., 'Risk-Off', 'Bullish tech')",
        "confidence": 85
      }

      Requirements:
      - Provide exactly 2 items in historical_parallels.
      - Select a truly unique and significant event for 'deep_historical_match'.
      - Ensure 'then_vs_now' metrics are relevant to the specific topic.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let jsonText = response.text()?.trim() || "";

    // Strip markdown code fences if returned by the model
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    }
    
    const analysis = JSON.parse(jsonText);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Gemini Analysis Error:", error?.message || error);
    return NextResponse.json(generateSimulatedAnalysis(
      eventData.title || "", 
      eventData.tags || [], 
      eventData.sentiment || "neutral"
    ));
  }
}

/**
 * FALLBACK SIMULATION LOGIC
 * Provides contextually relevant insights when the AI API is unavailable.
 */
function generateSimulatedAnalysis(title, tags, sentiment) {
  const getReasoning = (title, sentiment) => {
    const bullishThemes = [
      `The development in "${title}" suggests a structural tailwind for risk-on assets. Neural scanning indicates institutional accumulation phase.`,
      `Geopolitical alignment and the trend in "${title}" point towards a breakout. Historical parallels suggest high-probability momentum.`,
      `Market absorption of "${title}" news reflects underlying strength. Projection models favor cyclical outperformance.`
    ];
    const bearishThemes = [
      `The implications of "${title}" introduce systemic risk premium. Proprietary models indicate a shift towards defensive positioning.`,
      `Correlations with "${title}" suggest a breakdown of support levels. AI scan identifies capital flight from high-beta sectors.`,
      `Neural analysis of "${title}" highlights a potential liquidity trap. Structural imbalances are likely to accelerate a downside move.`
    ];
    const neutralThemes = [
      `The event "${title}" is currently being priced in as macro noise rather than a trend shifter. Neural sentiment is stabilizing.`,
      `Intelligence scan shows mixed institutional signals following "${title}". Consolidation within current ranges is the highest probability.`,
      `Cross-current analysis of "${title}" indicates that secondary impacts are offsetting immediate price action.`
    ];

    const themes = sentiment === "bullish" ? bullishThemes : sentiment === "bearish" ? bearishThemes : neutralThemes;
    return themes[Math.abs(hashString(title || "")) % themes.length];
  };

  const generateDynamicMatch = (title, tags) => {
    const combined = ((title || "") + " " + (tags?.join(" ") || "")).toLowerCase();
    
    if (combined.includes("nvidia") || combined.includes("ai") || combined.includes("gpu") || combined.includes("tech")) {
      return {
        event_name: "The 2000 GPU Paradigm Shift",
        year: "2000",
        context: "NVIDIA's invention of the GPU transitioned computing into high-density parallel matrix operations, mirroring modern AI infrastructure expansions.",
        then_vs_now: { then_metric: "1.5M Transistors", now_metric: "80B+ Transistors", label: "Compute Density", narrative: "Scale has multiplied exponentially while hardware concentration remains localized." }
      };
    }
    
    if (combined.includes("bank") || combined.includes("financial") || combined.includes("crisis") || combined.includes("fed") || combined.includes("rates")) {
      return {
        event_name: "The 1907 Liquidity Intervention",
        year: "1907",
        context: "A systemic contraction of liquidity across money centers that accelerated the formation of centralized monetary stabilization frameworks.",
        then_vs_now: { then_metric: "Private Consortiums", now_metric: "Sovereign Balance Sheets", label: "Liquidity Backstop", narrative: "Systemic risk absorption has shifted from private capital syndicates to central banks." }
      };
    }

    if (combined.includes("oil") || combined.includes("energy") || combined.includes("opec") || combined.includes("crude")) {
      return {
        event_name: "The 1973 Energy Embargo Realignment",
        year: "1973",
        context: "Geopolitical friction restricted hydrocarbon supplies, sparking rapid inflation and structural shifts toward alternative energy and strategic reserves.",
        then_vs_now: { then_metric: "+300% Oil Shock", now_metric: "Flexible Supply Reserves", label: "Supply Elasticity", narrative: "Global energy infrastructure is more diversified, but supply chain bottlenecks retain outsized price volatility." }
      };
    }

    if (combined.includes("gold") || combined.includes("reserve") || combined.includes("dollar") || combined.includes("currency")) {
      return {
        event_name: "The 1971 Bretton Woods De-pegging",
        year: "1971",
        context: "The suspension of USD gold convertibility created modern fiat floating exchange rates and amplified sovereign reserve diversification cycles.",
        then_vs_now: { then_metric: "$35/oz Fixed Standard", now_metric: "De-Dollarization Diversification", label: "Monetary Architecture", narrative: "Central banks are accelerating hard asset reserves as sovereign hedge." }
      };
    }

    const currentYear = new Date().getFullYear();
    return {
      event_name: `Macro Cycle Alignment (${currentYear - 15})`,
      year: (currentYear - 15).toString(),
      context: `Historical analysis reveals high structural correlation between ${tags?.[0] || 'current macro signals'} and mid-cycle liquidity reallocations.`,
      then_vs_now: { then_metric: "Manual Pit Execution", now_metric: "Sub-millisecond Algorithms", label: "Market Structure", narrative: "Algorithmic momentum compresses the timeframe between news dissemination and price discovery." }
    };
  };

  const dynamicMatch = generateDynamicMatch(title, tags);
  
  return {
    historical_parallels: [
      { year: "2008", event: "Global Reset", outcome: "Systemic volatility spike followed by massive liquidity injection.", market_trend: "-38% S&P 500", relevance: "Macro" },
      { year: "2020", event: "Pandemic Stimulus", outcome: "Modern monetary policy deployment with unprecedented sovereign balance sheet expansion.", market_trend: "+110% NASDAQ", relevance: "Structural" }
    ],
    deep_historical_match: dynamicMatch,
    ai_reasoning: getReasoning(title, sentiment),
    market_projection: sentiment === "bullish" ? "Momentum Continuation" : sentiment === "bearish" ? "Risk-Off Defensive Rotation" : "Range-Bound Consolidation",
    confidence: 82
  };
}
