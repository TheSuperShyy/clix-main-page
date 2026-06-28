import { voiceAI } from "../data/content";
import { Counter } from "./ui/Counter";
import { Icon } from "./ui/Icon";
import { Reveal } from "./ui/Reveal";

type Metric = {
  value: number;
  display?: string;
  prefix?: string;
  suffix?: string;
  label: string;
};

const callRows = [
  { name: "שיחה #4192", status: "אומת ✓", tone: "text-emerald-400" },
  { name: "שיחה #4193", status: "פגישה נקבעה", tone: "text-brand-300" },
  { name: "שיחה #4194", status: "הועבר לנציג", tone: "text-cyan-300" },
];

function Dashboard() {
  const metrics = voiceAI.metrics as readonly Metric[];
  return (
    <div className="surface-card ring-glow relative overflow-hidden p-5">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="text-sm font-semibold text-fg">{voiceAI.panelTitle}</span>
        <span className="flex items-center gap-2 text-xs text-muted">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          מחובר
        </span>
      </div>

      {/* metrics */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {metrics.map((m) => {
          const decimals = Number.isInteger(m.value) ? 0 : 1;
          const isK = m.display?.includes("k");
          return (
            <div key={m.label} className="rounded-xl border border-border bg-bg/40 p-4">
              <div className="nums text-2xl font-extrabold text-fg sm:text-3xl">
                <Counter
                  to={m.value}
                  decimals={decimals}
                  prefix={m.prefix ?? ""}
                  suffix={isK ? "" : (m.suffix ?? "")}
                  format={isK ? (v) => `${(v / 1000).toFixed(1)}k` : undefined}
                />
              </div>
              <div className="mt-1 text-xs text-muted">{m.label}</div>
            </div>
          );
        })}
      </div>

      {/* live calls */}
      <div className="mt-3 rounded-xl border border-border bg-bg/40 p-4">
        <div className="mb-2 text-xs text-faint">שיחות חיות</div>
        <ul className="flex flex-col gap-2">
          {callRows.map((c) => (
            <li key={c.name} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-fg/80">
                <Icon name="voice" size={15} className="text-muted" />
                {c.name}
              </span>
              <span className={c.tone}>{c.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function VoiceAI() {
  return (
    <section className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        {/* text */}
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3.5 py-1.5 text-xs font-medium text-brand-300">
            <Icon name="voice" size={14} />
            {voiceAI.eyebrow}
          </span>
          <h2 className="mt-5 text-balance text-h2 font-bold text-fg">{voiceAI.title}</h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">{voiceAI.body}</p>
          <ul className="mt-7 flex flex-col gap-3">
            {voiceAI.points.map((p) => (
              <li key={p} className="flex items-center gap-3 text-fg/90">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand/15 text-brand-300">
                  <Icon name="check" size={14} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* dashboard */}
        <Reveal delay={0.1}>
          <Dashboard />
        </Reveal>
      </div>
    </section>
  );
}
