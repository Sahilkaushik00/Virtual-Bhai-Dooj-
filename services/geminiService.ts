
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this environment, we assume the key is present.
  console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export async function generateBhaiDoojWish(): Promise<string> {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Generate a short, heartwarming, and festive Bhai Dooj wish for a sibling, suitable for a virtual celebration. Keep it under 25 words.",
        config: {
            temperature: 0.8,
            topP: 0.95,
        }
    });

    const text = response.text.trim();
    // Basic cleanup in case the model adds quotes
    return text.replace(/^"|"$/g, '');

  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to generate wish from Gemini API.");
  }
}
