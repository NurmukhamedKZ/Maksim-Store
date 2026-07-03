"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Msg = { role: "user" | "assistant"; content: string };

const DIFFICULTIES = [
  { id: "linkedin", label: "LinkedIn Passive-Aggressive" },
  { id: "family", label: "Family Group Chat" },
  { id: "csgo", label: "Ranked Lobby (censored)" },
];

const SURVIVE_TARGET = 10;

export default function EndurePage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [difficulty, setDifficulty] = useState("linkedin");
  const [composure, setComposure] = useState(100);
  const [verdict, setVerdict] = useState("AWAITING SUBJECT");
  const [breach, setBreach] = useState(false);
  const [survived, setSurvived] = useState(0);
  const [certified, setCertified] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  async function streamBully(history: Msg[]) {
    setStreaming(true);
    setMessages([...history, { role: "assistant", content: "" }]);
    try {
      const res = await fetch("/api/bully", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, difficulty }),
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
            "BARON is currently reviewing your incubator file in silence. (API error: check DEEPSEEK_API_KEY.)",
        },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  async function scoreComposure(userMessage: string, lastInsult: string) {
    try {
      const res = await fetch("/api/composure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage, lastInsult }),
      });
      const { score, verdict } = await res.json();
      setVerdict(verdict);
      setComposure((c) => {
        const next = Math.round(c * 0.6 + score * 0.4);
        return Math.max(0, Math.min(100, next));
      });
      if (score < 40) {
        setBreach(true);
        setTimeout(() => setBreach(false), 2500);
      }
    } catch {
      // sensor glitch, keep last reading
    }
  }

  function begin() {
    setStarted(true);
    setComposure(100);
    setSurvived(0);
    setCertified(false);
    setVerdict("BASELINE ESTABLISHED");
    streamBully([]);
  }

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    const lastInsult =
      [...messages].reverse().find((m) => m.role === "assistant")?.content ??
      "";
    const history: Msg[] = [...messages, { role: "user", content: text }];
    const nextSurvived = survived + 1;
    setSurvived(nextSurvived);
    scoreComposure(text, lastInsult);
    await streamBully(history);
    if (nextSurvived >= SURVIVE_TARGET && composure >= 70) {
      setCertified(true);
    }
  }

  const barColor =
    composure >= 70
      ? "bg-emerald-400"
      : composure >= 40
        ? "bg-amber-400"
        : "bg-red-500";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* HUD */}
      <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="font-black tracking-tight text-violet-400">
            ToxiGym™
          </Link>
          <div className="flex-1">
            <div className="flex justify-between gap-2 text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
              <span className="whitespace-nowrap">Composure™</span>
              <span className="truncate text-right">
                {composure}/100 · {verdict}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className={`h-full ${barColor} transition-all duration-700`}
                style={{ width: `${composure}%` }}
              />
            </div>
          </div>
          <div className="text-[11px] uppercase tracking-widest text-zinc-400 text-right">
            Endured
            <div className="text-lg font-bold text-zinc-100 leading-none">
              {Math.min(survived, SURVIVE_TARGET)}/{SURVIVE_TARGET}
            </div>
          </div>
        </div>
      </header>

      {breach && (
        <div className="fixed inset-x-0 top-16 z-20 flex justify-center pointer-events-none">
          <div className="bg-red-600 text-white font-black tracking-widest px-6 py-2 rounded-lg animate-pulse shadow-2xl">
            ⚠ COMPOSURE BREACH DETECTED
          </div>
        </div>
      )}

      {/* Chat */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 flex flex-col gap-4">
        {!started ? (
          <div className="m-auto text-center max-w-md space-y-6">
            <div className="text-6xl">🥊</div>
            <h1 className="text-3xl font-black">Hostility Exposure Session</h1>
            <p className="text-zinc-400">
              BARON will attempt to destabilize you. Stay polite for{" "}
              {SURVIVE_TARGET} exchanges with Composure ≥ 70 to earn your
              Certificate of Unbotherability™. Your expulsion from nFactorial
              is, as always, on the table.
            </p>
            <div className="flex flex-col gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className={`px-4 py-2 rounded-lg border text-sm transition ${
                    difficulty === d.id
                      ? "border-violet-500 bg-violet-500/15 text-violet-200"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <button
              onClick={begin}
              className="w-full bg-violet-600 hover:bg-violet-500 font-bold py-3 rounded-lg transition"
            >
              Begin Session
            </button>
          </div>
        ) : (
          <>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap ${
                  m.role === "assistant"
                    ? "self-start bg-zinc-900 border border-zinc-800"
                    : "self-end bg-violet-600/90"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="text-[10px] uppercase tracking-widest text-red-400 mb-1 font-bold">
                    BARON · Hostility Unit
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
      {started && (
        <footer className="border-t border-zinc-800 bg-zinc-950 sticky bottom-0">
          <div className="max-w-3xl mx-auto px-4 py-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Reply calmly. He can smell fear."
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 outline-none focus:border-violet-500"
              disabled={streaming}
            />
            <button
              onClick={send}
              disabled={streaming || !input.trim()}
              className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 font-bold px-5 rounded-lg transition"
            >
              Send
            </button>
          </div>
        </footer>
      )}

      {/* Certificate */}
      {certified && (
        <div className="fixed inset-0 z-30 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-zinc-900 to-violet-950 border-4 border-double border-amber-400 rounded-xl max-w-md w-full p-8 text-center space-y-4 shadow-2xl">
            <div className="text-5xl">🏅</div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-amber-300">
              ToxiGym™ hereby certifies
            </div>
            <h2 className="text-3xl font-black">
              Certified Unbotherable™
            </h2>
            <p className="text-zinc-300 text-sm">
              Survived {SURVIVE_TARGET} rounds of BARON with a final Composure
              Index of {composure}. Expulsion from nFactorial: postponed.
            </p>
            <p className="text-[11px] text-zinc-500">
              This certificate has no legal, professional, or emotional value.
            </p>
            <button
              onClick={() => setCertified(false)}
              className="bg-amber-400 text-zinc-950 font-bold px-6 py-2 rounded-lg"
            >
              Screenshot it. Frame it. Return to abuse.
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
