import Link from "next/link";

// Placeholder: Attack Mode (MOBB, the bully coach) is being built by the
// second teammate on his OpenAI key. Route exists so the landing CTA works.
export default function AttackPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
      <div className="text-center max-w-md space-y-5">
        <div className="text-6xl">🗡️</div>
        <h1 className="text-3xl font-black">Attack Mode</h1>
        <p className="text-zinc-400">
          MOBB (Mentor Of Bad Behavior) is completing his own certification.
          Sparring opens shortly.
        </p>
        <Link
          href="/train/endure"
          className="inline-block bg-violet-600 hover:bg-violet-500 font-bold px-6 py-3 rounded-lg transition"
        >
          Meanwhile: get bullied by BARON
        </Link>
      </div>
    </div>
  );
}
