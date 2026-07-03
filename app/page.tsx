import Link from "next/link";

const METRICS = [
  { n: "12,847", label: "residents expelled" },
  { n: "3", label: "deemed worthy" },
  { n: "0", label: "appeals won" },
];

const FAQ = [
  {
    q: "What is this?",
    a: "The HR department of nFactorial. BARON handles resident relations, complaints, and expulsions. Mostly expulsions.",
  },
  {
    q: "Can I just talk to him?",
    a: "Office hours are always open. He will make you regret coming.",
  },
  {
    q: "What if I fail the Tribunal?",
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

      <header className="max-w-3xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="text-[11px] uppercase tracking-[0.25em] text-zinc-500 mb-6">
          nFactorial · Department of Human Resources
        </div>
        <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight">
          Human resources.
          <br />
          <span className="text-red-600">Minus the human.</span>
        </h1>
        <p className="mt-6 text-zinc-600 max-w-md mx-auto">
          BARON runs resident relations at nFactorial. Come to office hours if
          you dare, or enter the Tribunal and pitch for your seat. Almost
          nobody keeps it.
        </p>
        <div className="mt-10 flex justify-center">
          <Link
            href="/train/endure"
            className="bg-red-600 text-white hover:bg-red-500 font-semibold px-10 py-3 rounded-lg transition"
          >
            Visit HR
          </Link>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 pb-20 grid md:grid-cols-2 gap-4">
        <div className="border border-zinc-200 rounded-xl p-6 text-left">
          <h3 className="font-bold">Office hours</h3>
          <p className="mt-2 text-sm text-zinc-600">
            An open door to HR. No agenda, no score. BARON listens to your
            concerns and mocks every one of them.
          </p>
        </div>
        <div className="border border-red-500 rounded-xl p-6 text-left">
          <h3 className="font-bold text-red-600">The Tribunal</h3>
          <p className="mt-2 text-sm text-zinc-600">
            The performance review. Pitch your product, defend it for 10
            rounds, reach Worthiness 80 or the intern gets your desk.
          </p>
        </div>
      </section>

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
