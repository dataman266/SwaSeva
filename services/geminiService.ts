
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getAiMarketAssistance(query: string, products: any[], language: string = 'en') {
  try {
    const isMr = language === 'mr';
    const langInstructions = isMr 
      ? "Please respond only in Marathi (मराठी). Use simple, friendly language suitable for a farmer from Maharashtra."
      : "Please respond in English. Keep it simple and helpful for a farmer.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User asks: "${query}". Here are the available products in the market: ${JSON.stringify(products)}. 
      Act as a helpful agricultural advisor for a farmer. Recommend the best products or answer their query.
      ${langInstructions}
      Keep it very concise. Maximum 2 sentences.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return language === 'mr' 
      ? "क्षमस्व, मला सध्या जोडण्यात समस्या येत आहे. कृपया पुन्हा प्रयत्न करा."
      : "I'm sorry, I'm having trouble connecting right now. Please try again.";
  }
}
