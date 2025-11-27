import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

const initGemini = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found for Gemini. AI features will be disabled or mocked.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const GeminiService = {
  async analyzeBusiness(products: Product[]): Promise<string> {
    const ai = initGemini();
    if (!ai) return "Gemini API Key is missing. Please check your environment configuration.";

    const productSummary = products.map(p => ({
      title: p.title,
      cost: p.costPrice,
      sell: p.sellPrice,
      stock: p.stock,
      profitPerUnit: p.sellPrice - p.costPrice,
      margin: ((p.sellPrice - p.costPrice) / p.sellPrice * 100).toFixed(1) + '%'
    }));

    const prompt = `
      You are an expert E-commerce Business Analyst for a Daraz Store.
      Here is the current inventory data in JSON format:
      ${JSON.stringify(productSummary)}

      Please provide a concise but high-value analysis in Markdown format:
      1. Identify the top 3 most profitable items (high margin).
      2. Identify items with low margins that might be risky.
      3. Calculate the total potential profit if all current stock is sold.
      4. Give 1 strategic recommendation to improve the store's profitability.
      
      Keep the tone professional and encouraging.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text || "No analysis could be generated.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Failed to generate AI analysis. Please try again later.";
    }
  }
};