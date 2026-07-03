export const metadata = { title: "Careers · ToxiGym" };

const ROLES = [
  {
    title: "Senior Hostility Engineer",
    loc: "Remote · Full-time",
    desc: "Own BARON's insult pipeline end to end. You will A/B test condescension. 5+ years of disappointing your parents preferred.",
  },
  {
    title: "Head of Emotional Damage (VP)",
    loc: "Almaty · Hybrid",
    desc: "Define our damage roadmap. Must be comfortable being the reason someone logs off.",
  },
  {
    title: "Composure QA Intern (unpaid, obviously)",
    loc: "On-site · The chamber",
    desc: "Sit in front of BARON for 6 hours a day. We measure you. That's the job. That's the whole job.",
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-16">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black">Careers at ToxiGym</h1>
          <p className="text-zinc-400 text-sm">
            We are a fully toxic-first company. Benefits include equity
            (decorative) and unlimited PTO (Permission To Obey).
          </p>
        </div>
        <div className="space-y-4">
          {ROLES.map((r) => (
            <div
              key={r.title}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-bold">{r.title}</h2>
                <span className="text-[11px] text-zinc-500 whitespace-nowrap">
                  {r.loc}
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-400">{r.desc}</p>
              <button className="mt-4 text-sm font-semibold text-violet-400">
                Apply → (button intentionally does nothing)
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
