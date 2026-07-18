import { NextResponse } from "next/server";
import { reviewDesignWithGemini } from "@/lib/gemini/review";
import { toErrorResponse } from "@/lib/gemini/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const base64 = typeof body.imageBase64 === "string" ? body.imageBase64 : "";
    const mimeType = typeof body.mimeType === "string" ? body.mimeType : "image/png";
    const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl : "";

    if (!base64) {
      return NextResponse.json({ error: "An image is required to review." }, { status: 400 });
    }

    const review = await reviewDesignWithGemini(base64, mimeType, imageUrl);
    return NextResponse.json({ review });
  } catch (error) {
    return toErrorResponse(error, "review");
  }
}
