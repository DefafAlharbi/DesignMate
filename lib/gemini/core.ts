import "server-only";
import { OPENROUTER_URL, getOpenRouterConfig } from "./client";

export class GeminiResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeminiResponseError";
  }
}

/** A single prompt part. Mirrors the shape the agents already build. */
export type Part = { text: string } | { inlineData: { data: string; mimeType: string } };

interface StructuredCallOptions {
  systemInstruction: string;
  parts: Part[];
  temperature?: number;
}

/**
 * Runs one request configured for JSON output and returns the parsed,
 * still-untyped object. Callers coerce/validate the shape afterwards. Any
 * empty or unparseable response is surfaced as a GeminiResponseError so the
 * route can respond gracefully rather than crash.
 *
 * The model is served through OpenRouter's OpenAI-compatible API.
 */
export async function runStructuredPrompt({
  systemInstruction,
  parts,
  temperature = 0.6,
}: StructuredCallOptions): Promise<unknown> {
  const { apiKey, model } = getOpenRouterConfig();

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: parts.map(toMessageContent) },
      ],
      response_format: { type: "json_object" },
      temperature,
    }),
  });

  if (!response.ok) {
    throw await upstreamError(response);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
    error?: { message?: string };
  };

  // OpenRouter can return a 200 with an error payload instead of choices.
  if (data.error?.message) {
    throw new GeminiResponseError(data.error.message);
  }

  const text = data.choices?.[0]?.message?.content;
  if (!text || !text.trim()) {
    throw new GeminiResponseError("The AI returned an empty response. Please try again.");
  }

  return parseJson(text);
}

/** Builds an inline image part from base64 data for multimodal prompts. */
export function imagePart(base64: string, mimeType: string): Part {
  return { inlineData: { data: base64, mimeType } };
}

export function textPart(text: string): Part {
  return { text };
}

/** Converts our parts into OpenAI-style message content blocks. */
function toMessageContent(part: Part) {
  if ("text" in part) {
    return { type: "text", text: part.text };
  }
  return {
    type: "image_url",
    image_url: { url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` },
  };
}

/**
 * Builds an error carrying the upstream HTTP status and body, so
 * lib/gemini/errors.ts can log and map it exactly as before.
 */
async function upstreamError(response: Response): Promise<Error> {
  const body = await response.text().catch(() => "");
  const error = new Error(body || response.statusText || `HTTP ${response.status}`);
  error.name = "ApiError";
  (error as Error & { status?: number }).status = response.status;
  return error;
}

/**
 * Parses JSON from a model response, tolerating stray markdown code fences or
 * leading/trailing prose in case the model doesn't perfectly honor JSON mode.
 */
function parseJson(raw: string): unknown {
  const cleaned = stripFences(raw).trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
      } catch {
        // fall through
      }
    }
    throw new GeminiResponseError("The AI response could not be parsed as JSON. Please try again.");
  }
}

function stripFences(raw: string): string {
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return fenceMatch ? fenceMatch[1] : raw;
}
