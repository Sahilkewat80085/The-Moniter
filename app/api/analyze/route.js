import { NextResponse } from 'next/server';

/**
 * AI ANALYZE API
 * Simulates a deep intelligence scan to find historical parallels.
 * In a production app, this would call an LLM (OpenAI/Gemini) with a search tool.
 */
export async function POST(request) {
  try {
    const { title, description, tags, sentiment } = await request.json();

    // In a real scenario, we'd use the news title to search a historical database.
    // For this demo, we'll generate high-fidelity parallels based on keywords.
    
    // Simulate a short processing delay for "Deep Reasoning"
    await new Promise(resolve => setTimeout(resolve, 1800));

    const analysis = generateSimulatedAnalysis(title, tags, sentiment);

    return NextResponse.json(analysis);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to analyze intel' }, { status: 500 });
  }
}

function generateSimulatedAnalysis(title, tags, sentiment) {
  const isGold = tags.some(t => t.toLowerCase().includes('gold'));
  const isRates = tags.some(t => t.toLowerCase().includes('rates') || t.toLowerCase().includes('fed'));
  const isEnergy = tags.some(t => t.toLowerCase().includes('energy') || t.toLowerCase().includes('oil'));

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

  // Default analysis for other events
  return {
    historical_parallels: [
      {
        year: "Various",
        event: "Similar Geopolitical Shift",
        outcome: "Increased volatility in regional indices followed by a flight to quality assets.",
        market_trend: "VIX +15% Avg",
        relevance: "Medium"
      }
    ],
    ai_reasoning: "This event introduces 'Known Unknowns' into the macro model. Historical volatility spikes correlate with this level of impact score, particularly in emerging markets.",
    market_projection: "Neutral-Bearish; Short-term volatility spike expected",
    confidence: 72
  };
}
