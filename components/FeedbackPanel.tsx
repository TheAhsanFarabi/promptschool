"use client";

export type EvalResult = {
  score: number;
  passed: boolean;
  headline: string;
  strengths: string[];
  improvements: string[];
  improvedPrompt: string;
  tip: string;
};

function Ring({ score }: { score: number }) {
  const color =
    score >= 80 ? "text-green" : score >= 60 ? "text-violet" : "text-gold";
  return (
    <div className="relative grid h-20 w-20 place-items-center">
      <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-line"
        />
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * 97.4} 97.4`}
          className={color}
        />
      </svg>
      <span className={`absolute font-display text-xl font-bold ${color}`}>
        {score}
      </span>
    </div>
  );
}

export default function FeedbackPanel({
  result,
  xpGained,
  onCopyImproved,
}: {
  result: EvalResult;
  xpGained: number;
  onCopyImproved: () => void;
}) {
  return (
    <div className="card animate-fade-up flex flex-col gap-5 p-6">
      <div className="flex items-center gap-4">
        <Ring score={result.score} />
        <div>
          <div
            className={`font-display text-lg font-bold ${
              result.passed ? "text-green" : "text-gold"
            }`}
          >
            {result.passed ? "Passed" : "Not quite yet"}
          </div>
          <p className="text-sm text-muted">{result.headline}</p>
          {xpGained > 0 && (
            <p className="mt-1 font-display text-sm font-semibold text-gold animate-pop">
              +{xpGained} XP
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="eyebrow mb-1.5 text-green">What worked</div>
          <ul className="space-y-1.5 text-sm">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-green">+</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="eyebrow mb-1.5 text-gold">Make it stronger</div>
          <ul className="space-y-1.5 text-sm">
            {result.improvements.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-gold">→</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <div className="eyebrow">A model-quality version</div>
          <button onClick={onCopyImproved} className="btn-quiet text-xs">
            Copy
          </button>
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-ink/[0.03] p-4 font-mono text-sm">
          {result.improvedPrompt}
        </pre>
      </div>

      <div className="rounded-xl bg-violet-soft p-4">
        <span className="eyebrow">Remember this</span>
        <p className="mt-1 text-sm text-ink">{result.tip}</p>
      </div>
    </div>
  );
}
