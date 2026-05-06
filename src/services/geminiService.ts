import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * GEMINI API SERVICE
 * 
 * NOTE: If you are seeing "Rollup failed to resolve import" errors on Vercel,
 * ensure that @google/generative-ai is listed in your package.json dependencies
 * and you have run 'npm install' or 'yarn install' in your environment.
 */

const getApiKey = () => {
  // 1. Try manual override from localStorage (highest priority)
  try {
    const manualKey = localStorage.getItem('GEMINI_API_KEY_OVERRIDE');
    if (manualKey && manualKey.trim().length > 10) {
      return manualKey.trim();
    }
  } catch (e) {
    // Ignore localStorage errors
  }

  // 2. Try VITE environment variables (client-side priority)
  const viteKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (viteKey && viteKey.length > 10) {
    return viteKey;
  }

  // 3. Fallback to Vite define or import.meta.env
  // @ts-ignore
  const envKey = (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '') || (import.meta as any).env?.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || "";
  if (envKey && envKey.length > 5) {
    return envKey;
  }
  
  return "";
};

// Simple in-memory and localStorage cache
const translationCache: Record<string, string> = {};

// Load cache from localStorage on init
try {
  const savedCache = localStorage.getItem('translation_cache');
  if (savedCache) {
    Object.assign(translationCache, JSON.parse(savedCache));
  }
} catch (e) {
  console.warn("Failed to load translation cache", e);
}

const saveCache = () => {
  try {
    // Limit cache size to avoid localStorage limits (keep last 500 entries)
    const keys = Object.keys(translationCache);
    if (keys.length > 500) {
      const keysToDelete = keys.slice(0, keys.length - 500);
      keysToDelete.forEach(k => delete translationCache[k]);
    }
    localStorage.setItem('translation_cache', JSON.stringify(translationCache));
  } catch (e) {
    console.warn("Failed to save translation cache", e);
  }
};

export const translateContent = async (text: string, targetLang: 'tr' | 'ku') => {
  if (!text || text.trim() === "") return text;
  
  const apiKey = getApiKey();
  console.log(`[GeminiService] Translating to ${targetLang}. API Key length: ${apiKey?.length || 0}`);
  
  if (!apiKey || apiKey === "") {
    console.error("Gemini API Key is missing.");
    throw new Error("API_KEY_MISSING");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const cacheKey = `${targetLang}:${text.substring(0, 100)}:${text.length}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }
    
    console.log(`[GeminiService] Calling model gemini-1.5-flash...`);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are a professional translator. Translate the following text into ${targetLang === 'tr' ? 'Turkish' : 'Kurdish (Kurmanji dialect)'}. 
      - Maintain the original tone, style, and formatting.
      - If there are placeholders like [IMAGE:...] or [VIDEO:...] keep them exactly as they are.
      - Return ONLY the translated text. Do not include any explanations or intro/outro.
      
      Text to translate:
      ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text();

    if (!translatedText || translatedText.trim() === "") {
      console.warn("[GeminiService] Model returned empty response");
      throw new Error("EMPTY_RESPONSE");
    }
    
    console.log(`[GeminiService] Success! Length: ${translatedText.length}`);
    translationCache[cacheKey] = translatedText.trim();
    saveCache();
    return translatedText.trim();
  } catch (error: any) {
    console.error("Translation error details:", error);
    // Extract meaningful message from Gemini error
    if (error?.message) {
      if (error.message.includes('API_KEY_INVALID')) throw new Error('API_KEY_INVALID');
      if (error.message.includes('permission denied')) throw new Error('PERMISSION_DENIED');
      if (error.status === 403) throw new Error('API_KEY_RESTRICTED');
    }
    throw error;
  }
};
