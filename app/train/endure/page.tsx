"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Msg = { role: "user" | "assistant"; content: string };
type Level = { label: string; instruction: string };

const ROUNDS = 10;
const WORTHY_THRESHOLD = 80;

export default function TribunalPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [levels, setLevels] = useState<Level[]>([]);
  const [selected, setSelected] = useState(0);
  const [worthiness, setWorthiness] = useState(0);
  const [verdict, setVerdict] = useState("UNPROVEN");
  const [round, setRound] = useState(0);
  const [outcome, setOutcome] = useState<"worthy" | "expelled" | null>(null);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  useEffect(() => {
    fetch("/api/difficulties")
      .then((r) => r.json())
      .then(({ levels }) => setLevels(levels))
      .catch(() =>
        setLevels([
          { label: "Трибунал", instruction: "INTENSITY: standard tribunal." },
        ]),
      );
  }, []);

  async function streamBully(history: Msg[]) {
    setStreaming(true);
    setMessages([...history, { role: "assistant", content: "" }]);
    try {
      const res = await fetch("/api/bully", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          intensity: levels[selected]?.instruction,
        }),
      });
      if (!res.ok || !res.body) throw new Error(await res.text());
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const snapshot = acc;
        setMessages([...history, { role: "assistant", content: snapshot }]);
      }
    } catch {
      setMessages([
        ...history,
        {
          role: "assistant",
          content:
            "BARON is reviewing your file in silence. (API error: check DEEPSEEK_API_KEY.)",
        },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  function scoreWorthiness(
    userMessage: string,
    lastAttack: string,
  ): Promise<number> {
    return fetch("/api/worthiness", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userMessage, lastAttack }),
    })
      .then((r) => r.json())
      .then(({ score, verdict }) => {
        setVerdict(verdict);
        let next = 0;
        setWorthiness((w) => {
          next = Math.max(0, Math.min(100, Math.round(w * 0.7 + score * 0.3)));
          return next;
        });
        return next;
      })
      .catch(() => worthiness);
  }

  function begin() {
    setStarted(true);
    setWorthiness(0);
    setRound(0);
    setOutcome(null);
    setVerdict("UNPROVEN");
    streamBully([]);
  }

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    const lastAttack =
      [...messages].reverse().find((m) => m.role === "assistant")?.content ??
      "";
    const history: Msg[] = [...messages, { role: "user", content: text }];
    const nextRound = round + 1;
    setRound(nextRound);
    const scorePromise = scoreWorthiness(text, lastAttack);
    await streamBully(history);
    if (nextRound >= ROUNDS) {
      const finalWorthiness = await scorePromise;
      setOutcome(finalWorthiness >= WORTHY_THRESHOLD ? "worthy" : "expelled");
    }
  }

  const barColor =
    worthiness >= WORTHY_THRESHOLD
      ? "bg-emerald-400"
      : worthiness >= 40
        ? "bg-amber-400"
        : "bg-red-500";

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col">
      {/* HUD */}
      <header className="border-b border-zinc-200 bg-white/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="font-bold tracking-tight">
            ToxiGym
          </Link>
          <div className="flex-1">
            <div className="flex justify-between gap-2 text-[10px] uppercase tracking-widest text-zinc-600 mb-1">
              <span className="whitespace-nowrap">Worthiness</span>
              <span className="truncate text-right">
                {worthiness}/100 · {verdict}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-zinc-200 overflow-hidden">
              <div
                className={`h-full ${barColor} transition-all duration-700`}
                style={{ width: `${worthiness}%` }}
              />
            </div>
          </div>
          <div className="text-[11px] uppercase tracking-widest text-zinc-600 text-right">
            Round
            <div className="text-lg font-bold text-zinc-900 leading-none">
              {Math.min(round, ROUNDS)}/{ROUNDS}
            </div>
          </div>
        </div>
      </header>

      {/* Chat */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 flex flex-col gap-4">
        {!started ? (
          <div className="m-auto text-center max-w-md space-y-6">
            <h1 className="text-3xl font-black">The Tribunal</h1>
            <p className="text-zinc-600">
              BARON decides who keeps their seat at nFactorial. Pitch your
              product. Defend it for {ROUNDS} rounds. Reach Worthiness{" "}
              {WORTHY_THRESHOLD} or the intern gets your desk.
            </p>
            <p className="text-xs text-zinc-500">
              12,847 expelled. 3 deemed worthy. He regrets all three.
            </p>
            <div className="flex flex-col gap-2">
              {levels.length === 0 ? (
                <div className="text-sm text-zinc-500 py-4">
                  BARON придумывает, как тебя унизить сегодня…
                </div>
              ) : (
                levels.map((d, i) => (
                  <button
                    key={d.label}
                    onClick={() => setSelected(i)}
                    className={`px-4 py-2 rounded-lg border text-sm transition ${
                      selected === i
                        ? "border-red-500 bg-red-500/10 text-red-700"
                        : "border-zinc-300 text-zinc-600 hover:border-zinc-400"
                    }`}
                  >
                    {d.label}
                  </button>
                ))
              )}
            </div>
            <button
              onClick={begin}
              className="w-full bg-red-600 text-white hover:bg-red-500 font-bold py-3 rounded-lg transition"
            >
              Enter the Tribunal
            </button>
          </div>
        ) : (
          <>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap ${
                  m.role === "assistant"
                    ? "self-start bg-zinc-50 border border-zinc-200"
                    : "self-end bg-red-600 text-white"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="text-[10px] uppercase tracking-widest text-red-600 mb-1 font-bold">
                    BARON · Gatekeeper
                  </div>
                )}
                {m.content ||
                  (streaming && i === messages.length - 1 ? "…" : "")}
              </div>
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </main>

      {/* Composer */}
      {started && !outcome && (
        <footer className="border-t border-zinc-200 bg-white sticky bottom-0">
          <div className="max-w-3xl mx-auto px-4 py-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Defend your seat."
              className="flex-1 bg-zinc-50 border border-zinc-300 rounded-lg px-4 py-2.5 outline-none focus:border-red-500"
              disabled={streaming}
            />
            <button
              onClick={send}
              disabled={streaming || !input.trim()}
              className="bg-red-600 text-white hover:bg-red-500 disabled:opacity-40 font-bold px-5 rounded-lg transition"
            >
              Send
            </button>
          </div>
        </footer>
      )}

      {/* Outcome */}
      {outcome && (
        <div className="fixed inset-0 z-30 bg-black/85 flex items-center justify-center p-4">
          {outcome === "worthy" ? (
            <div className="bg-zinc-50 border border-emerald-500 rounded-xl max-w-md w-full p-8 text-center space-y-4">
              <div className="text-[11px] uppercase tracking-[0.3em] text-emerald-400">
                Tribunal ruling
              </div>
              <h2 className="text-3xl font-black">Deemed Worthy</h2>
              <p className="text-zinc-700 text-sm">
                Final Worthiness: {worthiness}/100. You are the 4th in history.
                BARON already regrets it.
              </p>
              <button
                onClick={() => setOutcome(null)}
                className="bg-emerald-400 text-zinc-950 font-bold px-6 py-2 rounded-lg"
              >
                Keep your badge
              </button>
            </div>
          ) : (
            <div className="bg-zinc-50 border border-red-600 rounded-xl max-w-md w-full p-8 text-center space-y-4">
              <div className="text-[11px] uppercase tracking-[0.3em] text-red-600">
                Notice of expulsion
              </div>
              <h2 className="text-3xl font-black">Expelled</h2>
              <p className="text-zinc-700 text-sm">
                Final Worthiness: {worthiness}/100 (required:{" "}
                {WORTHY_THRESHOLD}). Your badge has been deactivated. The
                intern says thanks for the desk.
              </p>
              <button
                onClick={begin}
                className="bg-red-600 text-white font-bold px-6 py-2 rounded-lg"
              >
                Appeal (start over)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
