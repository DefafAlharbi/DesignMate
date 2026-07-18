import { GeneratedDesign, ReviewResult } from "./types";
import { validateDesignProposal, validateReview } from "./validate";

/** Client-side helpers for calling the server AI routes and validating the
 *  responses before they reach the UI. */

async function postJson<T>(url: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Couldn't reach the server. Check that the app is running and try again.");
  }

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // leave data null
  }

  if (!res.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? String((data as { error: unknown }).error)
        : "The AI request failed. Please try again.";
    throw new Error(message);
  }
  return data as T;
}

/** Reads a File into raw base64 (without the data: URL prefix). */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(new Error("Couldn't read the image file."));
    reader.readAsDataURL(file);
  });
}

export async function requestGenerate(brief: string): Promise<GeneratedDesign> {
  const { design } = await postJson<{ design: GeneratedDesign }>("/api/generate", { brief });
  return validateDesignProposal(design);
}

export async function requestReview(
  base64: string,
  mimeType: string,
  imageUrl: string
): Promise<ReviewResult> {
  const { review } = await postJson<{ review: ReviewResult }>("/api/review", {
    imageBase64: base64,
    mimeType,
    imageUrl,
  });
  return validateReview({ ...review, imageUrl });
}

