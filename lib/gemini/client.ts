import "server-only";

/** Thrown when the API key is missing so routes can return a clear 500. */
export class GeminiConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeminiConfigError";
  }
}

/** OpenRouter's OpenAI-compatible chat completions endpoint. */
export const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Default model used by all agents, served through OpenRouter. This is the same
 * Gemini model as before, just routed via OpenRouter. Override with
 * OPENROUTER_MODEL (must be a valid OpenRouter model slug).
 */
export const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";

/**
 * Reads the OpenRouter credentials from the environment. The key is read from
 * the environment only — it is never hardcoded and never sent to the browser
 * (this module is server-only).
 */
export function getOpenRouterConfig(): { apiKey: string; model: string } {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    throw new GeminiConfigError(
      "OPENROUTER_API_KEY is not configured. Add a valid key to .env.local and restart the dev server."
    );
  }
  return { apiKey, model: OPENROUTER_MODEL };
}
