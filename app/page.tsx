import Link from "next/link";

const METRICS = [
  { n: "4.7M", label: "insults absorbed" },
  { n: "94.3%", label: "users report nothing" },
  { n: "0", label: "real skills acquired" },
];

const FAQ = [
  {
    q: "Is this therapy?",
    a: "No.",
  },
  {
    q: "What do I get?",
    a: "A Certificate of Unbotherability. It has no legal, professional, or emotional value.",
  },
  {
    q: "Is my data safe?",
    a: "We do not store your shame. Tears are processed in-memory.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <nav className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
        <span className="font-bold tracking-tight">ToxiGym</span>
        <div className="flex items-center gap-6 text-sm text-zinc-400">
          <a href="#pricing" className="hover:text-zinc-100 transition">
            Pricing
          </a>
          <a href="#faq" className="hover:text-zinc-100 transition">
            FAQ
          </a>
        </div>
      </nav>

      <header className="max-w-3xl mx-auto px-6 pt-24 pb-24 text-center">
        <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight">
          Get insulted
          <br />
          <span className="text-violet-400">professionally.</span>
        </h1>
        <p className="mt-6 text-zinc-400 max-w-md mx-auto">
          An AI that breaks you down, and one that teaches you to break back.
          Certification included.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/train/endure"
            className="bg-violet-600 hover:bg-violet-500 font-semibold px-8 py-3 rounded-lg transition"
          >
            Endure
          </Link>
          <Link
            href="/train/attack"
            className="border border-zinc-700 hover:border-zinc-500 font-semibold px-8 py-3 rounded-lg transition text-zinc-300"
          >
            Attack
          </Link>
        </div>
      </header>

      <section className="border-y border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 py-10 grid grid-cols-3 gap-6 text-center">
          {METRICS.map((m) => (
            <div key={m.label}>
              <div className="text-2xl font-black">{m.n}</div>
              <div className="text-xs text-zinc-500 mt-1">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="max-w-3xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              name: "Free",
              price: "$0",
              items: ["3 humiliations per day"],
            },
            {
              name: "Pro",
              price: "$19/mo",
              hot: true,
              items: ["Unlimited abuse", "BARON remembers you"],
            },
            {
              name: "Enterprise",
              price: "Contact us",
              items: ["Pre-toxify new hires", "30% of your HR budget"],
            },
          ].map((p) => (
            <div
              key={p.name}
              className={`rounded-xl p-6 border ${
                p.hot
                  ? "border-violet-500"
                  : "border-zinc-800"
              }`}
            >
              <h3 className="text-sm text-zinc-400">{p.name}</h3>
              <div className="text-2xl font-black my-2">{p.price}</div>
              <ul className="space-y-1 text-sm text-zinc-400">
                {p.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="max-w-xl mx-auto px-6 pb-24">
        <div className="space-y-3">
          {FAQ.map((f) => (
            <details
              key={f.q}
              className="border border-zinc-800 rounded-xl px-5 py-3"
            >
              <summary className="text-sm font-medium cursor-pointer">
                {f.q}
              </summary>
              <p className="mt-2 text-sm text-zinc-400">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="border-t border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 py-6 text-xs text-zinc-600 flex justify-between">
          <span>© 2026 ToxiGym</span>
          <span className="flex gap-4">
            <Link href="/status" className="hover:text-zinc-400">
              Status
            </Link>
            <Link href="/careers" className="hover:text-zinc-400">
              Careers
            </Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
