
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { NEXUS_SYSTEM_INSTRUCTION } from "./constants";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const sendMessageToNexus = async (
  message: string, 
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<GenerateContentResponse> => {
  const ai = getAIClient();
  
  return await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      ...history,
      { role: 'user', parts: [{ text: message }] }
    ],
    config: {
      systemInstruction: NEXUS_SYSTEM_INSTRUCTION,
      thinkingConfig: { thinkingBudget: 32768 },
      temperature: 0.8,
      topP: 0.95,
    },
  });
};

export const generateNexusVisual = async (prompt: string): Promise<string | null> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A futuristic, high-tech holographic representation of: ${prompt}. Cyberpunk aesthetic, deep blues and cyans, intricate neural networks.` }]
      },
      config: {
        imageConfig: { aspectRatio: "16:9" }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
};

export const analyzeNexusEvolution = async (logs: string): Promise<string> => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the following interaction and determine the intelligence growth vector. Provide a short, technical summary of the 'Assimilation Status': ${logs}`,
    });
    return response.text || "Neural integrity at 100%. Ready for further ingestion.";
};
