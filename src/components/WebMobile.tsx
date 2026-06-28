import { webMobile } from "../data/content";
import { Icon } from "./ui/Icon";
import { Reveal } from "./ui/Reveal";

function DeviceMock() {
  return (
    <div className="relative">
      {/* browser window */}
      <div className="surface-card ring-glow overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="size-2.5 rounded-full bg-surface-3" />
          <span className="size-2.5 rounded-full bg-surface-3" />
          <span className="size-2.5 rounded-full bg-surface-3" />
          <span className="ms-3 h-5 flex-1 rounded-md bg-bg/60" />
        </div>
        <div className="space-y-4 p-5">
          <div className="h-28 rounded-xl bg-gradient-to-br from-brand/30 via-surface-2 to-cyan/20" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-16 rounded-lg bg-surface-2" />
            <div className="h-16 rounded-lg bg-surface-2" />
            <div className="h-16 rounded-lg bg-surface-2" />
          </div>
          <div className="h-3 w-2/3 rounded-full bg-surface-3" />
          <div className="h-3 w-1/2 rounded-full bg-surface-3" />
        </div>
      </div>

      {/* phone overlap */}
      <div className="absolute -bottom-8 start-[-12px] hidden w-28 rounded-[1.6rem] border border-border-strong bg-bg p-1.5 shadow-2xl sm:block">
        <div className="overflow-hidden rounded-[1.2rem] bg-surface">
          <div className="h-16 bg-gradient-to-br from-cyan/30 to-brand/30" />
          <div className="space-y-2 p-3">
            <div className="h-2.5 w-full rounded-full bg-surface-3" />
            <div className="h-2.5 w-2/3 rounded-full bg-surface-3" />
            <div className="mt-3 h-7 rounded-lg bg-gradient-to-l from-brand to-brand-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function WebMobile() {
  return (
    <section className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        {/* visual first (sits on the right in RTL) */}
        <Reveal className="order-last lg:order-first" delay={0.1}>
          <DeviceMock />
        </Reveal>

        {/* text */}
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3.5 py-1.5 text-xs font-medium text-cyan-300">
            <Icon name="code" size={14} />
            {webMobile.eyebrow}
          </span>
          <h2 className="mt-5 text-balance text-h2 font-bold text-fg">{webMobile.title}</h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">{webMobile.body}</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {webMobile.points.map((p) => (
              <div key={p.title} className="rounded-xl border border-border bg-surface/40 p-4">
                <div className="font-semibold text-fg">{p.title}</div>
                <div className="mt-1 text-sm text-muted">{p.desc}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
