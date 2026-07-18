import "server-only";
import { GeneratedDesign } from "../types";
import { GENERATOR_SYSTEM_PROMPT, buildGeneratorUserPrompt } from "../prompts/generator";
import { runStructuredPrompt, textPart } from "./core";
import { coerceDesign } from "./coerce";

/** Design Generator agent: brief -> structured UI proposal. */
export async function generateDesignWithGemini(brief: string): Promise<GeneratedDesign> {
  const raw = await runStructuredPrompt({
    systemInstruction: GENERATOR_SYSTEM_PROMPT,
    parts: [textPart(buildGeneratorUserPrompt(brief))],
    temperature: 0.8,
  });
  return coerceDesign(raw);
}
