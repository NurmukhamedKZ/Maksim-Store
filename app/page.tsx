import Link from "next/link";

const METRICS = [
  { n: "12,847", label: "residents expelled" },
  { n: "3", label: "deemed worthy" },
  { n: "0", label: "appeals won" },
];

const FAQ = [
  {
    q: "What is this?",
    a: "BARON, the gatekeeper AI, decides whether you deserve your seat at nFactorial. Pitch. Defend. Survive.",
  },
  {
    q: "What if I fail?",
    a: "You will.",
  },
  {
    q: "Is my data safe?",
    a: "We do not store your shame. Tears are processed in-memory.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <nav className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
        <span className="font-bold tracking-tight">ToxiGym</span>
        <div className="flex items-center gap-6 text-sm text-zinc-600">
          <a href="#pricing" className="hover:text-zinc-900 transition">
            Pricing
          </a>
          <a href="#faq" className="hover:text-zinc-900 transition">
            FAQ
          </a>
        </div>
      </nav>

      <header className="max-w-3xl mx-auto px-6 pt-24 pb-24 text-center">
        <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight">
          Prove you
          <br />
          <span className="text-red-600">belong here.</span>
        </h1>
        <p className="mt-6 text-zinc-600 max-w-md mx-auto">
          BARON guards the incubator. Pitch your product, survive his
          judgment, keep your badge. Almost nobody does.
        </p>
        <div className="mt-10 flex justify-center">
          <Link
            href="/train/endure"
            className="bg-red-600 text-white hover:bg-red-500 font-semibold px-10 py-3 rounded-lg transition"
          >
            Enter the Tribunal
          </Link>
        </div>
      </header>

      <section className="border-y border-zinc-200">
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
              items: ["3 hearings per day"],
            },
            {
              name: "Pro",
              price: "$19/mo",
              hot: true,
              items: ["Unlimited hearings", "BARON remembers your failures"],
            },
            {
              name: "Enterprise",
              price: "Contact us",
              items: ["Screen entire cohorts", "30% of your HR budget"],
            },
          ].map((p) => (
            <div
              key={p.name}
              className={`rounded-xl p-6 border ${
                p.hot ? "border-red-500" : "border-zinc-200"
              }`}
            >
              <h3 className="text-sm text-zinc-600">{p.name}</h3>
              <div className="text-2xl font-black my-2">{p.price}</div>
              <ul className="space-y-1 text-sm text-zinc-600">
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
              className="border border-zinc-200 rounded-xl px-5 py-3"
            >
              <summary className="text-sm font-medium cursor-pointer">
                {f.q}
              </summary>
              <p className="mt-2 text-sm text-zinc-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="border-t border-zinc-200">
        <div className="max-w-3xl mx-auto px-6 py-6 text-xs text-zinc-500 flex justify-between">
          <span>© 2026 ToxiGym</span>
          <span className="flex gap-4">
            <Link href="/status" className="hover:text-zinc-600">
              Status
            </Link>
            <Link href="/careers" className="hover:text-zinc-600">
              Careers
            </Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
