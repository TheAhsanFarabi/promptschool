"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import PracticeBox from "@/components/PracticeBox";
import FeedbackPanel, { EvalResult } from "@/components/FeedbackPanel";
import { getLesson, type Example, type TemplateExample } from "@/lib/lessons";
import { Progress, loadProgress, recordResult } from "@/lib/progress";
import { saveEntry } from "@/lib/history";
import { getUserApiKey } from "@/lib/apiKey";

function ExampleBlock({
  step,
  label,
  sublabel,
  example,
  formula,
}: {
  step: string;
  label: string;
  sublabel: string;
  example: Example;
  formula?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-violet text-white font-display text-xs font-bold shrink-0">
          {step}
        </span>
        <div>
          <span className="font-display text-sm font-bold">{label}</span>
          <span className="ml-2 text-xs text-muted">{sublabel}</span>
        </div>
      </div>

      {formula && (
        <div className="rounded-xl border border-violet/25 bg-violet/[0.05] px-4 py-3">
          <p className="eyebrow mb-1">Formula</p>
          <p className="font-mono text-sm text-violet-dark leading-relaxed">
            {formula}
          </p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-line p-4">
          <div className="eyebrow text-gold">Weak</div>
          <p className="mt-1.5 font-mono text-sm text-muted whitespace-pre-wrap">
            {example.before}
          </p>
        </div>
        <div className="rounded-xl border border-green/30 bg-green/[0.04] p-4">
          <div className="eyebrow text-green">Strong</div>
          <p className="mt-1.5 font-mono text-sm whitespace-pre-wrap">
            {example.after}
          </p>
        </div>
      </div>
      <p className="text-sm text-muted">
        <span className="font-semibold text-ink">Why: </span>
        {example.why}
      </p>
    </div>
  );
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);
  const lesson = getLesson(id);

  const [progress, setProgress] = useState<Progress | null>(null);
  const [selectedTopic, setSelectedTopic] = useState(0);
  const [attempt, setAttempt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EvalResult | null>(null);
  const [xpGained, setXpGained] = useState(0);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (!lesson) {
    return (
      <main className="min-h-screen">
        <Header progress={progress} />
        <div className="mx-auto max-w-3xl px-5 py-20">
          <p className="text-muted">That lesson does not exist.</p>
          <Link href="/" className="btn-ghost mt-4">
            Back to the tree
          </Link>
        </div>
      </main>
    );
  }

  const topic = lesson.practice.topics[selectedTopic];

  function handleTopicChange(idx: number) {
    setSelectedTopic(idx);
    setAttempt("");
    setResult(null);
    setError(null);
    setXpGained(0);
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const userKey = getUserApiKey();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (userKey) headers["x-user-api-key"] = userKey;

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers,
        body: JSON.stringify({
          action: "evaluate",
          technique: lesson!.technique,
          weakPrompt: topic.weakPrompt,
          attempt,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Try again.");
        return;
      }
      const evalResult = data as EvalResult;
      setResult(evalResult);

      const { progress: updated, xpGained: gained } = recordResult(
        lesson!.id,
        evalResult.score,
        evalResult.passed
      );
      setProgress(updated);
      setXpGained(gained);

      saveEntry({
        type: "lesson",
        title: `${lesson!.title} — ${topic.label}`,
        attempt,
        score: evalResult.score,
        passed: evalResult.passed,
      });
    } catch {
      setError("Network error. Is the dev server running?");
    } finally {
      setLoading(false);
    }
  }

  function copyImproved() {
    if (result) navigator.clipboard.writeText(result.improvedPrompt);
  }

  return (
    <main className="min-h-screen">
      <Header progress={progress} />

      <div className="mx-auto max-w-3xl px-5 py-10">
        <Link href="/" className="text-sm text-muted hover:text-ink">
          ← All techniques
        </Link>

        <div className="mt-4 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-violet-soft text-2xl">
            {lesson.icon}
          </span>
          <div>
            <span className="eyebrow">Tier {lesson.tier}</span>
            <h1 className="font-display text-2xl font-extrabold leading-none">
              {lesson.title}
            </h1>
          </div>
        </div>

        {/* Learn */}
        <section className="card mt-8 p-6">
          <span className="eyebrow">Learn</span>
          <p className="mt-2 leading-relaxed">{lesson.explanation}</p>

          <div className="mt-6 flex flex-col gap-7 divide-y divide-line">
            <ExampleBlock
              step="1"
              label="Simple"
              sublabel="The technique at its most basic"
              example={lesson.examples.simple}
            />
            <div className="pt-7">
              <ExampleBlock
                step="2"
                label="Template"
                sublabel="The reusable pattern behind it"
                example={lesson.examples.template}
                formula={lesson.examples.template.formula}
              />
            </div>
            <div className="pt-7">
              <ExampleBlock
                step="3"
                label="Impact"
                sublabel="What changes when you apply it to something real"
                example={lesson.examples.impact}
              />
            </div>
          </div>
        </section>

        {/* Practice */}
        <section className="mt-6">
          <div className="mb-4">
            <h2 className="font-display text-xl font-bold">Your turn</h2>
            <p className="mt-1 text-sm text-muted">
              Choose a topic, then rewrite the weak prompt using what you just
              learned.
            </p>
          </div>

          {/* Topic chips */}
          <div className="mb-4 flex flex-wrap gap-2">
            {lesson.practice.topics.map((t, i) => (
              <button
                key={t.label}
                onClick={() => handleTopicChange(i)}
                className={[
                  "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all",
                  i === selectedTopic
                    ? "bg-violet text-white shadow-sm"
                    : "bg-violet-soft text-violet-dark hover:bg-violet/20",
                ].join(" ")}
              >
                {t.label}
              </button>
            ))}
          </div>

          <PracticeBox
            value={attempt}
            onChange={setAttempt}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            weakPrompt={topic.weakPrompt}
          />
          <p className="mt-2 text-sm text-muted">
            <span className="font-semibold text-ink">Hint: </span>
            {topic.hint}
          </p>
        </section>

        {/* Feedback */}
        {result && (
          <section className="mt-6">
            <FeedbackPanel
              result={result}
              xpGained={xpGained}
              onCopyImproved={copyImproved}
            />
            <div className="mt-5 flex flex-wrap gap-3">
              {result.passed ? (
                <button
                  onClick={() => router.push("/")}
                  className="btn-primary"
                >
                  Back to the tree →
                </button>
              ) : (
                <button
                  onClick={() => {
                    setResult(null);
                    setXpGained(0);
                  }}
                  className="btn-primary"
                >
                  Try again
                </button>
              )}
              <button
                onClick={() => {
                  setResult(null);
                  setAttempt("");
                  setXpGained(0);
                }}
                className="btn-quiet"
              >
                Clear and rewrite
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
