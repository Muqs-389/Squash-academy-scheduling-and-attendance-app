
import { GoogleGenAI } from "@google/genai";

export const generateAnnouncementContent = async (topic: string, audience: string) => {
  try {
    // Correct initialization using process.env.API_KEY directly
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Draft a short, professional, and friendly announcement for a squash academy in Kenya. 
      Topic: ${topic}
      Audience: ${audience}
      Keep it concise (max 2 sentences). Start with a catchy title line followed by the body.`,
    });
    
    // Accessing response.text as a property, not a method
    const text = response.text || "";
    const [title, ...bodyParts] = text.split('\n');
    return {
      title: title.replace(/^#\s*|^\*\s*/, '').trim(),
      body: bodyParts.join('\n').trim()
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
