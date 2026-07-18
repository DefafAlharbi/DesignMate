import "server-only";
import { ReviewResult } from "../types";
import { REVIEWER_SYSTEM_PROMPT, REVIEWER_USER_PROMPT } from "../prompts/reviewer";
import { runStructuredPrompt, imagePart, textPart } from "./core";
import { coerceReview } from "./coerce";

/**
 * Design Reviewer agent: screenshot -> 9-category evaluation.
 * `imageUrl` is a client-side object URL passed straight through onto the
 * result so the UI can show the same thumbnail; the actual pixels are sent to
 * Gemini as inline base64.
 */
export async function reviewDesignWithGemini(
  base64: string,
  mimeType: string,
  imageUrl: string
): Promise<ReviewResult> {
  const raw = await runStructuredPrompt({
    systemInstruction: REVIEWER_SYSTEM_PROMPT,
    parts: [textPart(REVIEWER_USER_PROMPT), imagePart(base64, mimeType)],
    temperature: 0.3,
  });
  return coerceReview(raw, imageUrl);
}
