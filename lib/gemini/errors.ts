import { NextResponse } from "next/server";
import { GeminiConfigError } from "./client";
import { GeminiResponseError } from "./core";

/**
 * Maps any thrown error to a safe JSON response. User-actionable errors
 * (missing key, unparseable/empty AI response) get specific messages; anything
 * else is reported generically without leaking internals.
 *
 * Before mapping, the FULL original error (including the upstream Google API
 * status and message) is logged to the server terminal, so a generic 500 in
 * the browser is never the only signal — the exact upstream cause (404 / 429 /
 * 503, quota text, etc.) is always visible in `npm run dev` output.
 *
 * `context` labels which agent/route failed (e.g. "generate").
 */
export function toErrorResponse(error: unknown, context?: string): NextResponse {
  logUpstreamError(error, context);

  if (error instanceof GeminiConfigError) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (error instanceof GeminiResponseError) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }

  const message = error instanceof Error ? error.message : "Unexpected error.";
  // Surface common upstream auth/quota problems in a readable way.
  if (/api key|permission|unauthenticated|invalid/i.test(message)) {
    return NextResponse.json(
      { error: "The Gemini API rejected the request. Check that GEMINI_API_KEY is valid." },
      { status: 502 }
    );
  }
  if (/quota|rate|resource exhausted|429/i.test(message)) {
    return NextResponse.json(
      { error: "The Gemini API rate limit or quota was reached. Please wait and try again." },
      { status: 429 }
    );
  }

  return NextResponse.json(
    { error: "The AI request failed. Please try again in a moment." },
    { status: 500 }
  );
}

/** Pulls the upstream HTTP status code out of a @google/genai ApiError, whether
 *  it's exposed as a numeric `.status` or embedded in the JSON message. */
function extractUpstream(error: unknown): { httpStatus?: number; status?: string } {
  const result: { httpStatus?: number; status?: string } = {};
  if (!error || typeof error !== "object") return result;

  const withStatus = error as { status?: unknown; message?: unknown };
  if (typeof withStatus.status === "number") {
    result.httpStatus = withStatus.status;
  }

  const message = typeof withStatus.message === "string" ? withStatus.message : "";
  if (result.httpStatus === undefined) {
    const codeMatch = message.match(/"code"\s*:\s*(\d{3})/);
    if (codeMatch) result.httpStatus = Number(codeMatch[1]);
  }
  const statusMatch = message.match(/"status"\s*:\s*"([A-Z_]+)"/);
  if (statusMatch) result.status = statusMatch[1];

  return result;
}

/** Logs the complete original error to the terminal, with a one-line summary
 *  highlighting the upstream HTTP status followed by the full error. */
function logUpstreamError(error: unknown, context?: string): void {
  const label = context ? `[DesignMate:${context}]` : "[DesignMate]";
  const { httpStatus, status } = extractUpstream(error);

  const name = error instanceof Error ? error.name : typeof error;
  const summaryParts = [`${label} AI request failed`];
  if (httpStatus !== undefined) summaryParts.push(`— upstream HTTP ${httpStatus}`);
  if (status) summaryParts.push(`(${status})`);
  summaryParts.push(`[${name}]`);
  console.error(summaryParts.join(" "));

  // The full original error, including the complete Google API JSON message
  // and stack trace, so nothing is hidden behind the generic response above.
  console.error(error);
}
