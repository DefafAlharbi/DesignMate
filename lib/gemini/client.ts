import "server-only";
import { GoogleGenAI } from "@google/genai";

/** Thrown when the API key is missing so routes can return a clear 500. */
export class GeminiConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeminiConfigError";
  }
}

/** Default model used by all three agents; override with GEMINI_MODEL. */
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

let cached: GoogleGenAI | null = null;

/**
 * Returns a singleton Gemini client. The API key is read from the environment
 * only — it is never hardcoded and never sent to the browser (this module is
 * server-only).
 */
export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    throw new GeminiConfigError(
      "GEMINI_API_KEY is not configured. Add a valid key to .env.local and restart the dev server."
    );
  }
  if (!cached) {
    cached = new GoogleGenAI({ apiKey });
  }
  return cached;
}
