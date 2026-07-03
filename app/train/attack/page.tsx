"use client";

import { useState } from "react";
import Link from "next/link";

type Report = {
  score: number;
  verdict: string;
  feedback: string;
  upgraded: string;
};

export default function AttackPage() {
  const [text, setText] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [best, setBest] = useState(0);

  async function grade() {
    const draft = text.trim();
    if (!draft || loading) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: draft }),
      });
      if (!res.ok) throw new Error();
      const r: Report = await res.json();
      setReport(r);
      setBest((b) => Math.max(b, r.score));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const grade10 = report ? Math.round(report.score / 10) : 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-black tracking-tight text-violet-400">
            ToxiGym™
          </Link>
          <div className="text-[11px] uppercase tracking-widest text-zinc-400">
            Personal best: <span className="text-amber-400 font-bold">{best}/100</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        <div className="text-center space-y-3">
          <div className="text-5xl">🗡️</div>
          <h1 className="text-3xl font-black">Attack Mode</h1>
          <p className="text-zinc-400 text-sm max-w-md mx-auto">
            Submit your insult draft. MOBB (Mentor Of Bad Behavior) will grade
            it, tell you why it&rsquo;s weak, and show you how it&rsquo;s done.
          </p>
        </div>

        <div className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Your best shot. MOBB has heard worse. From toddlers."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-violet-500 resize-none"
          />
          <button
            onClick={grade}
            disabled={loading || !text.trim()}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 font-bold py-3 rounded-xl transition"
          >
            {loading ? "MOBB is wincing…" : "Submit for judgment"}
          </button>
          {error && (
            <p className="text-center text-sm text-red-400">
              MOBB refused to read it. Try again.
            </p>
          )}
        </div>

        {report && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-500">
                  Cut rating
                </div>
                <div className="text-4xl font-black text-amber-400">
                  {report.score}
                  <span className="text-lg text-zinc-500">/100</span>
                </div>
              </div>
              <div className="text-right text-sm italic text-zinc-300 max-w-[55%]">
                &ldquo;{report.verdict}&rdquo;
              </div>
            </div>

            <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-600 to-amber-400 transition-all duration-700"
                style={{ width: `${report.score}%` }}
              />
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
                MOBB&rsquo;s notes ({grade10}/10 craftsmanship)
              </div>
              <p className="text-sm text-zinc-300">{report.feedback}</p>
            </div>

            <div className="border-l-2 border-violet-500 pl-4">
              <div className="text-[10px] uppercase tracking-widest text-violet-400 mb-1">
                How it&rsquo;s actually done
              </div>
              <p className="text-sm text-zinc-100 font-medium">
                {report.upgraded}
              </p>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-zinc-600">
          Ready to take a punch instead?{" "}
          <Link href="/train/endure" className="text-violet-400 underline">
            Face BARON
          </Link>
        </p>
      </main>
    </div>
  );
}
