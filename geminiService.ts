
import { GoogleGenAI } from "@google/genai";

interface DraftResult {
  title: string;
  body: string;
}

interface DraftError {
  error: string;
}

const getGeminiApiKey = () => {
  // Prefer the standard Vite client-side env variable. Fall back to other options for
  // compatibility with existing configs without crashing when `process` is undefined.
  const viteKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
  const nodeKey = typeof process !== 'undefined' ? (process.env?.GEMINI_API_KEY || process.env?.API_KEY) : '';
  return viteKey || nodeKey || '';
};

export const generateAnnouncementContent = async (
  topic: string,
  audience: string
): Promise<DraftResult | DraftError> => {
  try {
    const apiKey = getGeminiApiKey();

    if (!apiKey) {
      const missingKeyMessage =
        'Gemini API key missing. Please set VITE_GEMINI_API_KEY in your environment.';
      console.error("Gemini Error:", missingKeyMessage);
      return { error: missingKeyMessage };
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Draft a short, professional, and friendly announcement for a squash academy in Kenya.
      Topic: ${topic}
      Audience: ${audience}
      Keep it concise (max 2 sentences). Start with a catchy title line followed by the body.`,
    });

    // `text()` is a method on the response; fall back to property if available for robustness
    const rawText = typeof response.text === 'function' ? response.text() : response.text || '';
    const [title, ...bodyParts] = rawText.split('\n');

    return {
      title: title.replace(/^#\s*|^\*\s*/, '').trim(),
      body: bodyParts.join('\n').trim()
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { error: "Failed to generate AI draft. Please try again." };
  }
};
