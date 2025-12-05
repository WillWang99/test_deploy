import { GoogleGenAI } from "@google/genai";

// Helper to convert file to base64
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeImageForReport = async (file: File, reportType: 'finding' | 'looting'): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const imagePart = await fileToGenerativePart(file);

    let prompt = "";
    if (reportType === 'finding') {
      prompt = "You are an assistant for a villager in Cambodia reporting an archaeological finding. Analyze this image. Describe what the object or structure looks like simply and clearly. Mention if it looks like pottery, stone carving, or a structure. Keep it under 50 words.";
    } else {
      prompt = "You are an assistant for a villager in Cambodia reporting archaeological looting. Analyze this image. Describe signs of digging, holes, broken artifacts, or damage to heritage sites. Keep it under 50 words and factual.";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [imagePart, { text: prompt }]
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    return "Could not analyze image automatically. Please describe what you see.";
  }
};