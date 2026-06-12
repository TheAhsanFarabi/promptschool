import { NextRequest, NextResponse } from "next/server";
import {
  evaluateSystemPrompt,
  evaluateUserPrompt,
  SOCRATIC_ASK_SYSTEM,
  SOCRATIC_SYNTH_SYSTEM,
  socraticContext,
} from "@/lib/prompts";

export const runtime = "nodejs";

// --- tiny in-memory rate limit (per server instance) ---
// Note: In serverless environments (Vercel), each invocation starts fresh.
// For production, use a persistent store (Redis, database) for proper rate limiting.
const HITS = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = HITS.get(ip);
  if (!rec || now - rec.ts > WINDOW_MS) {
    HITS.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_PER_WINDOW;
}

async function callGemini(
  system: string,
  user: string,
  userApiKey?: string
): Promise<any> {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  if (!apiKey) {
    throw new Error("missing_key");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json",
        },
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`gemini_${res.status}:${detail.slice(0, 300)}`);
  }

  const data = await res.json();
  const text: string =
    data?.candidates?.[0]?.content?.parts
      ?.map((p: any) => p.text || "")
      .join("") ?? "";

  // Be defensive: strip stray fences if the model adds them.
  const clean = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(clean);
  } catch {
    throw new Error("parse_error:" + clean.slice(0, 300));
  }
}

export async function POST(req: NextRequest) {
  const userApiKey = req.headers.get("x-user-api-key") || undefined;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

  // Skip shared rate limit when the user supplies their own key.
  if (!userApiKey && rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Wait a moment and try again." },
      { status: 429 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const action = body?.action as string;

  try {
    if (action === "evaluate") {
      const { technique, weakPrompt, attempt } = body;
      if (!attempt || !technique) {
        return NextResponse.json({ error: "Missing fields." }, { status: 400 });
      }
      const result = await callGemini(
        evaluateSystemPrompt(technique),
        evaluateUserPrompt({ technique, weakPrompt, attempt }),
        userApiKey
      );
      return NextResponse.json(result);
    }

    if (action === "ask") {
      const { draft, qa } = body;
      if (!draft) {
        return NextResponse.json({ error: "Missing prompt." }, { status: 400 });
      }
      const result = await callGemini(
        SOCRATIC_ASK_SYSTEM,
        socraticContext(draft, qa || []),
        userApiKey
      );
      return NextResponse.json(result);
    }

    if (action === "synthesize") {
      const { draft, qa } = body;
      if (!draft) {
        return NextResponse.json({ error: "Missing prompt." }, { status: 400 });
      }
      const result = await callGemini(
        SOCRATIC_SYNTH_SYSTEM,
        socraticContext(draft, qa || []),
        userApiKey
      );
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (err: any) {
    const msg = String(err?.message || err);
    if (msg === "missing_key") {
      return NextResponse.json(
        { error: "Server is missing GEMINI_API_KEY. Add it to .env.local." },
        { status: 500 }
      );
    }
    if (msg.startsWith("parse_error")) {
      return NextResponse.json(
        { error: "The AI returned something unexpected. Try again." },
        { status: 502 }
      );
    }
    if (err.name === "AbortError") {
      return NextResponse.json(
        { error: "AI request timed out. Try again." },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: "AI request failed. Check your key, model name, and quota." },
      { status: 502 }
    );
  }
}
