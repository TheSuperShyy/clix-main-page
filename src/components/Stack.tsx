import { stack } from "../data/content";
import { Icon } from "./ui/Icon";
import { Marquee } from "./ui/Marquee";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface/70 px-5 py-2.5 text-sm font-medium text-fg/90 backdrop-blur-sm">
      <span className="size-2 rounded-full bg-gradient-to-br from-brand to-cyan" />
      {label}
    </span>
  );
}

export function Stack() {
  const mid = Math.ceil(stack.integrations.length / 2);
  const rowA = stack.integrations.slice(0, mid);
  const rowB = stack.integrations.slice(mid);

  return (
    <section id="stack" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          align="center"
          eyebrow={stack.eyebrow}
          title={stack.title}
          subtitle={stack.subtitle}
          className="mx-auto"
        />

        {/* Core node */}
        <Reveal className="relative mx-auto mt-16 flex flex-col items-center" delay={0.05}>
          <div className="relative grid place-items-center">
            <span className="absolute size-44 animate-[pulse-glow_3s_ease-in-out_infinite] rounded-full bg-brand/20 blur-2xl" />
            <span className="absolute size-40 rounded-full border border-border" />
            <span className="absolute size-28 rounded-full border border-border-strong" />
            <div className="surface-card ring-glow relative z-10 grid size-24 place-items-center rounded-full">
              <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand to-cyan text-bg">
                <Icon name="spark" size={26} />
              </span>
            </div>
          </div>
          <div className="mt-5 text-center">
            <div className="text-lg font-bold text-fg">{stack.coreLabel}</div>
            <div className="text-sm text-muted">{stack.coreSub}</div>
          </div>
        </Reveal>

        {/* Tool rows */}
        <Reveal className="mt-14 flex flex-col gap-4" delay={0.1}>
          <Marquee>
            {rowA.map((name) => (
              <Chip key={name} label={name} />
            ))}
          </Marquee>
          <Marquee reverse>
            {rowB.map((name) => (
              <Chip key={name} label={name} />
            ))}
          </Marquee>
        </Reveal>
      </div>
    </section>
  );
}
