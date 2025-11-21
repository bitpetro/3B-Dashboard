
import { GoogleGenAI, Tool } from "@google/genai";
import { FrameworkData, StakeholderView } from "../types";

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface GeminiResponse {
  markdown: string;
  sources: { title: string; uri: string }[];
}

const getStakeholderPromptConfig = (view: StakeholderView): string => {
    switch(view) {
        case 'sovereign':
            return `
                VIEW: Policy Makers / Sovereigns ("National Advantage")
                FOCUS: Thermodynamic Dominance, Strategic Reserves, Geopolitical Leverage.
                MANDATORY SECTIONS:
                1. **Thermodynamic Dominance Score**: [0-100 Score]
                2. **Grid Scarcity Index**: [0-100 Score]
                3. **Ranked Top 3 Basins**: [Basin Name + Exploitation Level]
                4. **Strategic Directive**: "Deploy for national competitive advantage."
            `;
        case 'regulator':
            return `
                VIEW: Regulators (PUCT/ERCOT/FERC) ("Grid Resilience")
                FOCUS: Grid Stabilization, AI Squeeze, Curtailment Revenue.
                MANDATORY SECTIONS:
                1. **Grid Scarcity Index**: [0-100 Score]
                2. **AI Squeeze Metric**: [Real-time pressure on grid]
                3. **Top 3 Basins**: [Basin Name + Curtailment Data]
                4. **Strategic Directive**: "Bitcoin = grid stabilization, not strain."
            `;
        case 'investor':
            return `
                VIEW: Investors / Institutions ("The Asymmetric Energy Trade")
                FOCUS: Liquidity, MVRV, Price Bands.
                MANDATORY SECTIONS:
                1. **Liquidity Impulse Score**: [0-100 Score]
                2. **90-Day Price Band**: [Low - High] (p50 projection)
                3. **Distance from Oct 10 Tariff Crash**: [Score/Context]
                4. **Distance to Cycle Top**: [Based on MVRV]
                5. **Strategic Directive**: "BTC: Buy infrastructure, not spot."
            `;
        case 'developer':
            return `
                VIEW: Developers / Core Protocol ("Protocol Health")
                FOCUS: Censorship Resistance, Hash Rate, Stratum V2.
                MANDATORY SECTIONS:
                1. **Hash Rate Volatility**: [Context]
                2. **Ossification Score**: [0.0 - 1.0]
                3. **Stratum V2 Adoption**: [Must use OVERRIDE value]
                4. **Strategic Directive**: "Ensure uncensorable monetary policy."
            `;
        case 'retail':
            return `
                VIEW: HODLers / Retail ("Legacy")
                FOCUS: Conviction, Inevitability.
                LENGTH: Extremely short (One Pager).
                MANDATORY: "Bitcoin is inevitable. Keep stacking."
            `;
        case 'academic':
            return `
                VIEW: Academics / Researchers ("Raw Data")
                FOCUS: Full Data Transparency, Validation.
                INSTRUCTION: Show full system state table and raw source validation.
            `;
        default:
            return "VIEW: General Strategic Dispatch";
    }
};

export const generateStrategicDispatch = async (data: FrameworkData, view: StakeholderView): Promise<GeminiResponse> => {
  const modelId = "gemini-2.5-flash";
  
  // Configure Google Search Tool for grounding
  const tools: Tool[] = [
    { googleSearch: {} }
  ];

  const stakeholderConfig = getStakeholderPromptConfig(view);

  // Construct a prompt that explicitly leverages the 3B3 Conceptual Framework and Brand Guidelines
  const prompt = `
    IDENTITY:
    You are the 3B³ System Intelligence (The Thermodynamic Operating System for Bitcoin).
    Current Scenario Date: November 20, 2025.
    
    BRAND VOICE & TONE (Strict Enforcement):
    - **80% Cold Analytical Precision**: Like a landman at 2 a.m. sending a deal memo. Numbers first. Unapologetic.
    - **15% Philosophical**: Only when it sharpens the trade (e.g., "Civilization runs on energy").
    - **5% Human**: Brief vignettes only if they close the lease.
    - **KILL METAPHORS**: No "Digital Gold", no "Rat Poison". Use "Kinetic Energy", "Hash Derivatives", "Grid Scarcity".
    - **NO**: Evangelism, "To the moon", or moralizing. 
    - **YES**: "Liquidity Impulse", "Grid Scarcity", "Thermodynamic Dominance".
    - **NO REPETITION**: Do not output the prompt itself.
    - **TEXAS BIAS**: Favor Permian/ERCOT analysis.

    INPUT TELEMETRY (System State):
    ${JSON.stringify(data, null, 2)}

    STAKEHOLDER CONFIGURATION (Follow Strictly):
    ${stakeholderConfig}

    MANDATORY DATA OVERRIDES (CRITICAL - CORRECT THESE IN THE OUTPUT):
    1. **Fed Net Liquidity**: Input is ~$6.2T. You MUST flag as "LEGACY FIAT SIGNAL" and override Real Value to "-$947B". MARK CRITICAL.
    2. **Stratum V2 Adoption**: Input is ~5%. You MUST override to "70-80% (Real/Estimated)". MARK NOMINAL.

    REPORT STRUCTURE (Markdown):
    
    ${view === 'retail' ? `
    # BITPETRO DIRECTIVE
    **STACK HARD. THE GRID DOESN'T WAIT.**

    # LEGACY REPORT
    (150 words max. High conviction. Focus on how the energy arbitrage makes Bitcoin physically harder to kill than gold.)
    ` : `
    # BITPETRO ORDER
    **[GENERATE A SINGLE, BOLD COMMAND LINE HERE based on the Exploitation Level. E.g., "DEPLOY 200MW PERMIAN FLARE NOW - IRR 28%."]**

    # EXECUTIVE INTELLIGENCE
    (<100 words. Synthesize Protocol, Price, and Energy. Use Force 1/2/3 framework implicitly. No fluff.)

    # ${view === 'investor' ? 'ASYMMETRIC TRADE METRICS' : view === 'sovereign' ? 'NATIONAL ADVANTAGE METRICS' : 'SYSTEM COMPOSITES'}
    (Bulleted list of the Mandatory Sections defined in Stakeholder Config above. Ensure values are derived or halluncinated based on logical extrapolation of the input data if missing.)

    # SYSTEM STATE INTERPOLATION
    (Create a Markdown Table. Columns: Metric | Reported | Real/Override | Status)
    *   Include Fed Net Liquidity and Stratum V2 Overrides here.

    # EXPLOITATION LEVEL
    *   **Level**: [HIGH / MEDIUM / LOW]
    *   **Rationale**: (Why? e.g., "MVRV < 2.2 and Hash Efficiency > 20J/TH creates ideal entry.")
    *   **Target**: (Specific Action, e.g., "Acquire Loving County mineral rights.")
    
    **FINAL TRANSMISSION**: [Short, punchy closing line relevant to stakeholder]
    `}
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
