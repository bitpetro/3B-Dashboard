import { GoogleGenAI } from "@google/genai";
import { FrameworkData } from "../types";

// Initialize the Gemini API client
// Using process.env.API_KEY as per instructions. 
// WARNING: Ensure this environment variable is set in the build/runtime environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStrategicDispatch = async (data: FrameworkData): Promise<string> => {
  const modelId = "gemini-2.5-flash";
  
  const prompt = `
    You are Jonathan Kohn, author of "The Rebellion's Ledger". 
    You are writing a strategic dispatch based on the current 3B³ Dashboard data.
    
    Context: It is November 2025. The "Great Tariff Crash" recently occurred.
    
    Current Dashboard State:
    ${JSON.stringify(data, null, 2)}
    
    Task:
    Analyze the interplay between the Protocol, Price, and Environment bodies. 
    Identify the "Ghost in the Machine" (Derivatives/Macro interaction).
    Comment on the "Uneasy Truce" in the Regulatory environment.
    
    Tone: Analytical, strategic, slightly dramatic, cyber-noir. 
    Format: A short executive summary followed by 3 bullet points of actionable intelligence. 
    Keep it under 200 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || "System offline. Unable to retrieve strategic dispatch.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Encrypted transmission failed. Check neural link (API Key).";
  }
};
