
import { GoogleGenAI } from "@google/genai";

export async function getAiMarketAssistance(query: string, products: any[], language: string = 'en') {
  try {
    // Fix: Always initialize GoogleGenAI inside the function to ensure the most current API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const isMr = language === 'mr';
    const langInstructions = isMr 
      ? "Please respond ONLY in Marathi (मराठी). Use simple, friendly language suitable for a farmer from Maharashtra."
      : "Please respond in English. Keep it simple and helpful for a farmer.";

    // Using ai.models.generateContent directly with model name as per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User query: "${query}". 
      Available products: ${JSON.stringify(products)}. 
      Context: You are "Kisan Sahayak", an expert agricultural advisor. 
      Task: Recommend products or provide advice based on the products listed.
      Rules: ${langInstructions} Keep it very concise (max 2 sentences). Avoid technical jargon.`,
      config: {
        temperature: 0.8,
        topP: 0.9,
        topK: 40,
      },
    });

    // Extracting text using the .text property (not a method)
    return response.text || (isMr ? "क्षमस्व, मी आता प्रतिसाद देऊ शकत नाही." : "I'm sorry, I can't respond right now.");
  } catch (error) {
    console.error("Gemini Assistant Error:", error);
    return language === 'mr' 
      ? "नेटवर्क समस्या. कृपया पुन्हा प्रयत्न करा."
      : "Connection issue. Please try again.";
  }
}
