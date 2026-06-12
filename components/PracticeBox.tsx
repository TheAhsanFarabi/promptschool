"use client";

export default function PracticeBox({
  value,
  onChange,
  onSubmit,
  loading,
  error,
  weakPrompt,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
  weakPrompt: string;
}) {
  return (
    <div className="card flex flex-col gap-4 p-6">
      <div>
        <div className="eyebrow mb-1.5">The weak prompt</div>
        <pre className="whitespace-pre-wrap rounded-xl bg-ink/[0.03] p-4 font-mono text-sm text-muted">
          {weakPrompt}
        </pre>
      </div>

      <div>
        <label htmlFor="attempt" className="eyebrow mb-1.5 block">
          Your rewrite
        </label>
        <textarea
          id="attempt"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          placeholder="Rewrite the prompt here..."
          className="w-full resize-y rounded-xl border border-line bg-white p-4 text-sm leading-relaxed outline-none transition-colors focus:border-violet focus:ring-2 focus:ring-violet/20"
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") onSubmit();
          }}
        />
        <p className="mt-1.5 text-xs text-muted">
          Tip: press Cmd/Ctrl + Enter to submit.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-gold/10 px-4 py-3 text-sm text-ink">
          {error}
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={loading || value.trim().length < 4}
        className="btn-primary self-start"
      >
        {loading ? "Grading..." : "Submit for feedback"}
      </button>
    </div>
  );
}
