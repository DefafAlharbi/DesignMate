import { NextResponse } from "next/server";
import { generateDesignWithGemini } from "@/lib/gemini/generate";
import { toErrorResponse } from "@/lib/gemini/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const brief = typeof body.brief === "string" ? body.brief.trim() : "";
    if (!brief) {
      return NextResponse.json({ error: "A design brief is required." }, { status: 400 });
    }

    const design = await generateDesignWithGemini(brief);
    return NextResponse.json({ design });
  } catch (error) {
    return toErrorResponse(error, "generate");
  }
}
