"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { Progress, loadProgress } from "@/lib/progress";
import { saveEntry } from "@/lib/history";
import { getUserApiKey } from "@/lib/apiKey";

type QA = { q: string; a: string };
type Change = { technique: string; explanation: string };
type Stage = "draft" | "asking" | "synth" | "done";

export default function RefinePage() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [stage, setStage] = useState<Stage>("draft");
  const [draft, setDraft] = useState("");
  const [qa, setQa] = useState<QA[]>([]);
  const [currentQ, setCurrentQ] = useState("");
  const [currentTech, setCurrentTech] = useState("");
  const [answer, setAnswer] = useState("");
  const [refined, setRefined] = useState("");
  const [changes, setChanges] = useState<Change[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  async function api(action: string, payload: object) {
    const userKey = getUserApiKey();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (userKey) headers["x-user-api-key"] = userKey;

    const res = await fetch("/api/gemini", {
      method: "POST",
      headers,
      body: JSON.stringify({ action, ...payload }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed.");
    return data;
  }

  async function start() {
    setLoading(true);
    setError(null);
    try {
      const data = await api("ask", { draft, qa: [] });
      if (data.done) {
        await synthesize([]);
      } else {
        setCurrentQ(data.question);
        setCurrentTech(data.technique || "");
        setStage("asking");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitAnswer() {
    const nextQa = [...qa, { q: currentQ, a: answer }];
    setQa(nextQa);
    setAnswer("");
    setLoading(true);
    setError(null);
    try {
      // Stop after 4 questions to keep it tight.
      if (nextQa.length >= 4) {
        await synthesize(nextQa);
        return;
      }
      const data = await api("ask", { draft, qa: nextQa });
      if (data.done) {
        await synthesize(nextQa);
      } else {
        setCurrentQ(data.question);
        setCurrentTech(data.technique || "");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function synthesize(finalQa: QA[]) {
    setStage("synth");
    setLoading(true);
    try {
      const data = await api("synthesize", { draft, qa: finalQa });
      setRefined(data.refinedPrompt);
      setChanges(data.changes || []);
      setStage("done");

      saveEntry({
        type: "refine",
        title: "Free Refine",
        attempt: draft,
      });
    } catch (e: any) {
      setError(e.message);
      setStage("asking");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStage("draft");
    setDraft("");
    setQa([]);
    setCurrentQ("");
    setAnswer("");
    setRefined("");
    setChanges([]);
    setError(null);
  }

  return (
    <main className="min-h-screen">
      <Header progress={progress} />

      <div className="mx-auto max-w-3xl px-5 py-10">
        <Link href="/" className="text-sm text-muted hover:text-ink">
          ← Back to the tree
        </Link>

        <p className="eyebrow mt-4">Free Refine</p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">
          Bring your own prompt
        </h1>
        <p className="mt-2 max-w-xl text-muted">
          Paste a rough prompt. The coach asks a few questions, then writes a
          sharpened version and shows which technique powered each change.
        </p>

        {error && (
          <div className="mt-6 rounded-xl bg-gold/10 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Draft */}
        {stage === "draft" && (
          <div className="card mt-6 flex flex-col gap-4 p-6">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={4}
              placeholder="e.g. write a post about my product launch"
              className="w-full resize-y rounded-xl border border-line bg-white p-4 text-sm outline-none focus:border-violet focus:ring-2 focus:ring-violet/20"
            />
            <button
              onClick={start}
              disabled={loading || draft.trim().length < 4}
              className="btn-primary self-start"
            >
              {loading ? "Thinking..." : "Start refining"}
            </button>
          </div>
        )}

        {/* Asking */}
        {stage === "asking" && (
          <div className="mt-6 flex flex-col gap-4">
            {qa.map((t, i) => (
              <div key={i} className="card p-4 opacity-70">
                <p className="text-sm font-semibold">{t.q}</p>
                <p className="mt-1 text-sm text-muted">{t.a}</p>
              </div>
            ))}
            <div className="card animate-fade-up p-6">
              {currentTech && (
                <span className="mb-2 inline-block rounded-full bg-violet-soft px-2.5 py-1 text-xs font-semibold text-violet-dark">
                  {currentTech}
                </span>
              )}
              <p className="font-display text-lg font-semibold">{currentQ}</p>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={3}
                placeholder="Your answer..."
                className="mt-3 w-full resize-y rounded-xl border border-line bg-white p-3 text-sm outline-none focus:border-violet focus:ring-2 focus:ring-violet/20"
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter")
                    submitAnswer();
                }}
              />
              <div className="mt-3 flex gap-3">
                <button
                  onClick={submitAnswer}
                  disabled={loading || answer.trim().length < 1}
                  className="btn-primary"
                >
                  {loading ? "..." : "Answer"}
                </button>
                <button
                  onClick={() => synthesize(qa)}
                  disabled={loading}
                  className="btn-quiet"
                >
                  Skip, build it now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Synthesizing */}
        {stage === "synth" && (
          <div className="card mt-6 p-10 text-center text-muted">
            Writing your refined prompt…
          </div>
        )}

        {/* Done */}
        {stage === "done" && (
          <div className="mt-6 flex flex-col gap-5">
            <div className="card animate-fade-up p-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="eyebrow">Your refined prompt</span>
                <button
                  onClick={() => navigator.clipboard.writeText(refined)}
                  className="btn-quiet text-xs"
                >
                  Copy
                </button>
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-ink/[0.03] p-4 font-mono text-sm">
                {refined}
              </pre>
            </div>

            <div className="card p-6">
              <span className="eyebrow">What changed and why</span>
              <ul className="mt-3 space-y-3">
                {changes.map((c, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-0.5 shrink-0 rounded-full bg-violet-soft px-2.5 py-1 text-xs font-semibold text-violet-dark">
                      {c.technique}
                    </span>
                    <span className="text-sm text-muted">{c.explanation}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button onClick={reset} className="btn-primary self-start">
              Refine another
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
