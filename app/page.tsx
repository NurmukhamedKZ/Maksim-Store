import Link from "next/link";

const METRICS = [
  { n: "4.7M", label: "insults absorbed" },
  { n: "94.3%", label: "of users now unbothered (self-reported)" },
  { n: "11×", label: "avg. daily 'per my last email' resistance" },
  { n: "0", label: "real skills acquired" },
];

const TESTIMONIALS = [
  {
    q: "BARON told me my startup's TAM was 'a rounding error with a pitch deck'. I didn't cry until I got home. 5 stars.",
    a: "Aidar, cohort 7",
  },
  {
    q: "I survived the Family Group Chat difficulty. My actual family group chat is nothing to me now.",
    a: "Dana, certified unbotherable",
  },
  {
    q: "We pre-toxified our entire intern class before onboarding. Attrition is up 40% but the survivors are magnificent.",
    a: "Head of HR, undisclosed unicorn",
  },
];

const FAQ = [
  {
    q: "Is this therapy?",
    a: "Legally, no. Spiritually, also no. It is exposure. To BARON.",
  },
  {
    q: "What if I get expelled from the incubator for real?",
    a: "BARON's expulsion threats are decorative. Probably. We have not verified his API access.",
  },
  {
    q: "What do I actually get?",
    a: "A Certificate of Unbotherability™ (PDF-adjacent). It has no legal, professional, or emotional value, and we are very proud of that.",
  },
  {
    q: "Is my data safe?",
    a: "We do not store your shame. Your tears are processed in-memory and never written to disk (GDPR-compliant crying).",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <span className="font-black text-xl tracking-tight text-violet-400">
          ToxiGym™
        </span>
        <div className="flex items-center gap-5 text-sm text-zinc-400">
          <a href="#pricing" className="hover:text-zinc-100 transition">
            Pricing
          </a>
          <a href="#faq" className="hover:text-zinc-100 transition">
            FAQ
          </a>
          <Link
            href="/train/endure"
            className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-4 py-2 rounded-lg transition"
          >
            Get Bullied
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-block text-[11px] uppercase tracking-[0.25em] text-violet-300 border border-violet-500/40 rounded-full px-4 py-1.5 mb-6">
          Backed by nobody · Trusted by the traumatized
        </div>
        <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight">
          The gym for your
          <br />
          <span className="text-violet-400">emotional damage.</span>
        </h1>
        <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
          Every day, 3.2 billion people enter a group chat unprepared. One
          &ldquo;per my last email&rdquo; and they&rsquo;re finished. ToxiGym
          digitizes emotional armor: get insulted by an AI until nothing can
          touch you, then get a certificate proving it.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/train/endure"
            className="bg-violet-600 hover:bg-violet-500 font-bold px-8 py-3.5 rounded-lg text-lg transition"
          >
            🥊 Endure Mode: face BARON
          </Link>
          <Link
            href="/train/attack"
            className="border border-zinc-700 hover:border-zinc-500 font-bold px-8 py-3.5 rounded-lg text-lg transition text-zinc-300"
          >
            🗡️ Attack Mode: train with MOBB
          </Link>
        </div>
        <p className="mt-4 text-xs text-zinc-600">
          Duolingo for workplace toxicity. Don&rsquo;t miss your abuse streak.
        </p>
      </header>

      {/* Metrics */}
      <section className="border-y border-zinc-800 bg-zinc-900/40">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {METRICS.map((m) => (
            <div key={m.label}>
              <div className="text-3xl font-black text-violet-400">{m.n}</div>
              <div className="text-xs text-zinc-500 mt-1">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
        {[
          {
            t: "1 · Enter the chamber",
            d: "BARON, our proprietary Hostility Unit, opens fire. His insults are peer-reviewed and take two full seconds to land.",
          },
          {
            t: "2 · Hold the line",
            d: "Our Composure Sensor scores every reply with live model inference. Snap once and it's a COMPOSURE BREACH on your permanent record.",
          },
          {
            t: "3 · Get certified",
            d: "Survive 10 rounds unbothered and receive the Certificate of Unbotherability™. It means nothing. Frame it anyway.",
          },
        ].map((s) => (
          <div
            key={s.t}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
          >
            <h3 className="font-bold text-violet-300 mb-2">{s.t}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{s.d}</p>
          </div>
        ))}
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-black text-center mb-8">
          Survivors speak
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.a}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
            >
              <blockquote className="text-sm text-zinc-300 leading-relaxed">
                &ldquo;{t.q}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-xs text-zinc-500">
                {t.a}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-zinc-800 bg-zinc-900/40">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-black text-center mb-8">Pricing</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Free",
                price: "$0",
                items: [
                  "3 humiliations per day",
                  "1 difficulty level",
                  "Composure Index™ (rounded down)",
                ],
              },
              {
                name: "Pro",
                price: "$19/mo",
                hot: true,
                items: [
                  "Unlimited abuse",
                  "Full insult history ('archive of regret')",
                  "Certificate of Unbotherability™",
                  "BARON remembers you",
                ],
              },
              {
                name: "Enterprise",
                price: "Let's talk",
                items: [
                  "Pre-toxify new hires before their first standup",
                  "Team composure dashboards",
                  "SLA: BARON never sleeps (99.99% uptime)",
                  "We take 30% of your HR budget",
                ],
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`rounded-xl p-6 border ${
                  p.hot
                    ? "border-violet-500 bg-violet-500/10"
                    : "border-zinc-800 bg-zinc-900"
                }`}
              >
                <h3 className="font-bold">{p.name}</h3>
                <div className="text-3xl font-black my-3">{p.price}</div>
                <ul className="space-y-2 text-sm text-zinc-400">
                  {p.items.map((i) => (
                    <li key={i}>· {i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-black text-center mb-8">FAQ</h2>
        <div className="space-y-4">
          {FAQ.map((f) => (
            <details
              key={f.q}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-4"
            >
              <summary className="font-semibold cursor-pointer">{f.q}</summary>
              <p className="mt-2 text-sm text-zinc-400">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-8 text-xs text-zinc-600 flex flex-col md:flex-row justify-between gap-3">
          <span>
            © 2026 ToxiGym Inc. · A Worst Startup Ever production · BARON
            uptime: 99.99%
          </span>
          <span>
            Privacy: we do not store your shame · Careers: Senior Hostility
            Engineer (remote)
          </span>
        </div>
      </footer>
    </div>
  );
}
