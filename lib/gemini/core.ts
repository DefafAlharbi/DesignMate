import "server-only";
import type { Part } from "@google/genai";
import { GEMINI_MODEL, getGeminiClient } from "./client";

export class GeminiResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeminiResponseError";
  }
}

interface StructuredCallOptions {
  systemInstruction: string;
  parts: Part[];
  temperature?: number;
}

/**
 * Runs one Gemini request configured for JSON output and returns the parsed,
 * still-untyped object. Callers coerce/validate the shape afterwards. Any
 * empty or unparseable response is surfaced as a GeminiResponseError so the
 * route can respond gracefully rather than crash.
 */
export async function runStructuredPrompt({
  systemInstruction,
  parts,
  temperature = 0.6,
}: StructuredCallOptions): Promise<unknown> {
  const ai = getGeminiClient();

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [{ role: "user", parts }],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      temperature,
    },
  });

  const text = response.text;
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
