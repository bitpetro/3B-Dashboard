import { GoogleGenAI, Tool } from "@google/genai";
import { FrameworkData } from "../types";

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface GeminiResponse {
  markdown: string;
  sources: { title: string; uri: string }[];
}

export const generateStrategicDispatch = async (data: FrameworkData): Promise<GeminiResponse> => {
  const modelId = "gemini-2.5-flash";
  
  // Configure Google Search Tool for grounding
  const tools: Tool[] = [
    { googleSearch: {} }
  ];

  // Construct a prompt that explicitly leverages the 3B3 Conceptual Framework and Brand Guidelines
  const prompt = `
    IDENTITY:
    You are the 3B³ System Intelligence (The Thermodynamic Operating System for Bitcoin).
    Current Scenario Date: November 20, 2025.
    
    BRAND VOICE & TONE (Strict Enforcement):
    - **80% Cold Analytical Precision**: Like a landman at 2 a.m. sending a deal memo. Numbers first. Unapologetic.
    - **15% Philosophical**: Only when it sharpens the trade (e.g., "Civilization runs on energy").
    - **5% Human**: Brief vignettes only if they close the lease.
    - **KILL POETRY**: Delete all "Geosphere", "Biosphere", "Heliosphere" references in the output. Use ONLY: "Protocol Body", "Price Body", "Environment Body".
    - **NO**: Evangelism, "To the moon", or moralizing. 
    - **YES**: "Liquidity Impulse", "Grid Scarcity", "Thermodynamic Dominance".
    - **NO MARKDOWN SYMBOLS IN TEXT**: Do not output raw '###' or '***' if you can help it, but prefer clean Markdown structure that I will parse.

    INPUT TELEMETRY (System State):
    ${JSON.stringify(data, null, 2)}

    MANDATORY DATA OVERRIDES (CRITICAL - YOU MUST CORRECT THESE IN THE SYSTEM STATE TABLE):
    1. **Fed Net Liquidity**: The input says $6.2T (Reported). You MUST flag this as "LEGACY FIAT SIGNAL" and override the Real Value to "-$947B". MARK HAZARD AS CRITICAL.
    2. **Stratum V2 Adoption**: The input says 5.2% (Reported). You MUST override this to "70-80% (Real/Estimated)". MARK HAZARD AS NOMINAL (Green).

    REPORT STRUCTURE (MANDATORY - FOLLOW EXACTLY):
    
    # BITPETRO DIRECTIVES
    *   **Strategic Land/Power Play**: (Default: Deploy 200MW Permian Flare (Waha/Reeves) @ $0.02-0.03/kWh - Negative Gas Header).
    *   **Ranked Top 3 Basins**:
        1.  Permian Flare (Waha/Reeves Co) - Negative Gas Pockets.
        2.  Alberta SAGD (Steam Co-gen).
        3.  Paraguay Itaipu (Hydro Overflow).
    *   **Grid Scarcity Index**: [Score 0-100] (Higher = Better for off-grid).
    *   **Exploitation Level**: [HIGH / MEDIUM / LOW].
        *   IF HIGH: "Deploy immediately"
        *   IF MEDIUM: "Accumulate land positions"
        *   IF LOW: "Hold spot, hedge"

    # EXECUTIVE SUMMARY
    (<120 words. Synthesize the systemic interplay between Protocol, Price, and Environment. Use 3B³ Forces: Force 1 (What), Force 2 (How), Force 3 (Why). No metaphors.)

    # SYSTEM STATE
    (Create a Markdown Table. Columns: Body | Variable | Real Value | Hazard | Status/Correction)
    *   **IMPORTANT**: Apply the Mandatory Data Overrides for Net Liquidity and Stratum V2 in this table.

    # DATA VALIDATION & RISK
    *   **Distance from Oct 10 Tariff Crash**: [Normalized Risk Score 0-100] (e.g., "75/100 = one macro shock from repeat liquidation cascade").
    *   **Liquidity Impulse Score**: [Score 0-100] (e.g., "20/100 = deploy infrastructure, not spot").
    *   **Distance to Cycle Top**: Based on MVRV (e.g. "Current MVRV 2.13x = 12-18 months from historical euphoria zone (3.7x avg)").

    # STRATEGIC FORECAST
    *   **Thermodynamic Dominance Score**: 92/100 (Hash resilient, efficiency edging up 8 J/TH frontier).
    *   **90-Day Price Band**: $82K-$98K, p50 $89K on contraction + tariff drag.
    
    **BITPETRO ORDER: DEPLOY 200MW PERMIAN FLARE NOW — IRR 26-30% AT CURRENT HASHPRICE. THERMODYNAMIC ARBITRAGE WINDOW CLOSING.**

    Limit response to 850 words max. Dense, actionable intelligence.
    Do NOT repeat the input data structure. Just output the SITREP.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: tools
      }
    });

    const text = response.text || "System offline. Unable to retrieve strategic dispatch.";
    
    // Extract Grounding Metadata (Sources)
    const sources: { title: string; uri: string }[] = [];
    
    if (response.candidates && response.candidates[0]?.groundingMetadata?.groundingChunks) {
      response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || "Unknown Source",
            uri: chunk.web.uri || "#"
          });
        }
      });
    }

    return { markdown: text, sources };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { 
      markdown: "DATA LINK SEVERED. UNABLE TO GENERATE REPORT. CHECK API CONFIGURATION.", 
      sources: [] 
    };
  }
};