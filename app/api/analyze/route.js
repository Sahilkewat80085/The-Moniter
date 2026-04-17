import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI ANALYZE API (Dynamic Gemini Version)
 * Uses Google Gemini 1.5 Flash to perform deep intelligence scans.
 */
export async function POST(request) {
  try {
    const { title, description, tags, sentiment } = await request.json();

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is missing. Falling back to simulation.");
      return NextResponse.json(generateSimulatedAnalysis(title, tags, sentiment));
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Analyze the following news event for a professional financial intelligence dashboard.
      Your goal is to provide deep macro-economic context and historical parallels.

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
            "outcome": "Briefly what happened to markets", 
            "market_trend": "e.g. +15% S&P 500", 
            "relevance": "High/Direct/Macro" 
          }
        ],
        "ai_reasoning": "A 2-3 sentence professional analysis of why this specific event matters to global markets.",
        "market_projection": "A short, actionable prediction (e.g., 'Risk-Off', 'Bullish for Tech', 'Yield Curve Pressure').",
        "confidence": 85
      }

      Requirements:
      - Provide exactly 2 high-fidelity historical parallels.
      - Ensure parallels are real historical events.
      - Keep the reasoning sophisticated but concise.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text();
    
    // Parse the AI response
    const analysis = JSON.parse(jsonText);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Silent fallback to simulation in case of API failure / Rate limits
    return NextResponse.json(generateSimulatedAnalysis(title || "", tags || [], sentiment || "neutral"));
  }
}

/**
 * FALLBACK SIMULATION LOGIC
 * Used if API Key is missing or if the API call fails.
 */
function generateSimulatedAnalysis(title, tags, sentiment) {
  const isGold = tags.some(t => t.toLowerCase().includes('gold'));
  const isRates = tags.some(t => t.toLowerCase().includes('rates') || t.toLowerCase().includes('fed'));

  if (isGold) {
    return {
      historical_parallels: [
        {
          year: "2009-2011",
          event: "Post-GFC Sovereign Diversification",
          outcome: "Gold price surged from $800 to $1,900 as central banks shifted away from USD-denominated debt.",
          market_trend: "+138% Gain in Bullion",
          relevance: "High"
        },
        {
          year: "2018",
          event: "PBOC Reserve Expansion Phase",
          outcome: "China added 100+ tons; Gold outperformed S&P 500 by 12% during US-China trade tensions.",
          market_trend: "Safe Haven Inflow",
          relevance: "Direct"
        }
      ],
      ai_reasoning: "The current signal matches 'Institutional Accumulation' patterns. Pro-cyclical shifts in China's reserves historically precede multi-quarter rallies in precious metals while exerting downward pressure on the DXY (Dollar Index).",
      market_projection: "Strong Bullish Bias for Commodities; Bearish for USD Liquidity",
      confidence: 94
    };
  }

  if (isRates) {
    return {
      historical_parallels: [
        {
          year: "1994",
          event: "The Great Bond Massacre",
          outcome: "Fed abruptly raised rates multiple times; S&P 500 stagnated for 12 months as yields spiked.",
          market_trend: "-18% Bond Price Action",
          relevance: "Critical"
        },
        {
          year: "2022",
          event: "Post-Pandemic Inflation Pivot",
          outcome: "Aggressive tightening led to the worst year for 60/40 portfolios in decades.",
          market_trend: "-24% Tech Sector Drawdown",
          relevance: "High"
        }
      ],
      ai_reasoning: "Current Fed rhetoric mirrors the 'Restrictive Plateau' of 1994. History suggests that during this phase, equity valuations are compressed by terminal rate uncertainty, favoring high-cash-flow sectors over growth.",
      market_projection: "Defensive Posture Recommended; Yield Curves likely to remain Inverted",
      confidence: 89
    };
  }

  return {
    historical_parallels: [
      {
        year: "Various",
        event: "Recent Geopolitical Shift",
        outcome: "Increased volatility in regional indices followed by a flight to quality assets.",
        market_trend: "VIX +15% Avg",
        relevance: "Medium"
      }
    ],
    ai_reasoning: "This event adds 'Gamma' to the current macro cycle. Historical volatility spikes correlate with this level of impact score, particularly when occurring in contested global corridors.",
    market_projection: "Heightened Volatility; Neutral-Bearish Bias",
    confidence: 72
  };
}
