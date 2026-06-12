"use client";

import { useEffect, useRef, useState } from "react";
import { getUserApiKey, setUserApiKey, clearUserApiKey } from "@/lib/apiKey";

export default function ApiKeyModal({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const key = getUserApiKey();
    setHasKey(!!key);
    inputRef.current?.focus();
  }, []);

  function handleSave() {
    if (!input.trim()) return;
    setUserApiKey(input.trim());
    setHasKey(true);
    setSaved(true);
    setInput("");
    setTimeout(onClose, 900);
  }

  function handleClear() {
    clearUserApiKey();
    setHasKey(false);
    setSaved(false);
    setInput("");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="card animate-fade-up w-full max-w-md mx-4 p-6 flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Gemini API Key</p>
            <h2 className="font-display text-xl font-bold mt-0.5">Your own key</h2>
          </div>
          <button onClick={onClose} className="btn-quiet text-lg leading-none px-2 py-1">
            ✕
          </button>
        </div>

        <p className="text-sm text-muted leading-relaxed">
          By default, PromptSchool uses a shared key (rate-limited to 20
          requests/min). Paste your own{" "}
          <span className="font-semibold text-ink">Gemini API key</span> to get
          unlimited calls on your own quota. Your key is stored only in your
          browser — never sent anywhere except directly to Google.
        </p>

        {hasKey && !saved && (
          <div className="flex items-center gap-3 rounded-xl bg-green/10 px-4 py-3">
            <span className="h-2 w-2 rounded-full bg-green shrink-0" />
            <span className="text-sm font-semibold text-green">
              Custom key active — using your quota
            </span>
            <button
              onClick={handleClear}
              className="ml-auto text-xs text-muted hover:text-ink transition-colors"
            >
              Remove
            </button>
          </div>
        )}

        {saved && (
          <div className="flex items-center gap-3 rounded-xl bg-green/10 px-4 py-3">
            <span className="h-2 w-2 rounded-full bg-green shrink-0" />
            <span className="text-sm font-semibold text-green">Key saved!</span>
          </div>
        )}

        {!saved && (
          <div className="flex flex-col gap-2">
            <label htmlFor="api-key" className="eyebrow">
              {hasKey ? "Replace key" : "Paste key"}
            </label>
            <input
              ref={inputRef}
              id="api-key"
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="AIza..."
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-violet focus:ring-2 focus:ring-violet/20 font-mono"
            />
            <button
              onClick={handleSave}
              disabled={!input.trim()}
              className="btn-primary self-start mt-1"
            >
              Save key
            </button>
          </div>
        )}

        <p className="text-xs text-muted">
          Get a free key at{" "}
          <span className="font-mono text-ink">aistudio.google.com</span> →
          Get API key.
        </p>
      </div>
    </div>
  );
}
