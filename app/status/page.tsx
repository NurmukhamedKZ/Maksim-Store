const SYSTEMS = [
  { name: "BARON · Hostility Unit", status: "Operational", note: "Insulting at 340ms p99" },
  { name: "Composure Sensor™", status: "Operational", note: "Judging silently" },
  { name: "Expulsion Threat Generator", status: "Operational", note: "Memos drafted: 12,847" },
  { name: "Empathy Module", status: "Decommissioned", note: "Removed in v0.2 (by design)" },
  { name: "Certificate Printer", status: "Operational", note: "Ink: tears (recycled)" },
];

export const metadata = { title: "Status · ToxiGym™" };

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-16">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black">System Status</h1>
          <div className="inline-flex items-center gap-2 text-emerald-400 text-sm font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            All hostility systems operational · uptime 99.99%
          </div>
          <p className="text-xs text-zinc-500">
            BARON has not slept since deployment. He never will.
          </p>
        </div>
        <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-xl overflow-hidden">
          {SYSTEMS.map((s) => (
            <div
              key={s.name}
              className="flex items-center justify-between px-5 py-4 bg-zinc-900"
            >
              <div>
                <div className="font-semibold text-sm">{s.name}</div>
                <div className="text-xs text-zinc-500">{s.note}</div>
              </div>
              <span
                className={`text-xs font-bold ${
                  s.status === "Operational"
                    ? "text-emerald-400"
                    : "text-zinc-500"
                }`}
              >
                {s.status}
              </span>
            </div>
          ))}
        </div>
        <p className="text-center text-[11px] text-zinc-600">
          Incidents this quarter: 0. Feelings hurt this quarter: 4,712,338.
        </p>
      </div>
    </div>
  );
}
