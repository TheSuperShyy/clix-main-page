import { cta } from "../data/content";
import { Reveal } from "./ui/Reveal";

export function CTA() {
  return (
    <section className="relative overflow-hidden rounded-t-[2.5rem] bg-ink py-28 text-on-ink sm:py-40">
      {/* soft brand glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 size-[80vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[120px]"
          style={{ background: "radial-gradient(circle, var(--color-brand), transparent 65%)" }}
        />
      </div>

      <div className="container-x relative text-center">
        <Reveal>
          <h2 className="mx-auto max-w-4xl text-balance text-display font-black leading-[0.95] text-on-ink">
            {cta.title}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-on-ink/65 sm:text-xl">
            {cta.subtitle}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {cta.buttons.map((b) => (
              <a
                key={b.label}
                href={b.href}
                className={`inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-semibold transition-all duration-300 ${
                  b.primary
                    ? "bg-on-ink text-ink hover:-translate-y-0.5 hover:bg-white"
                    : "border border-on-ink/25 text-on-ink hover:border-on-ink/60 hover:bg-on-ink/5"
                }`}
              >
                {b.label}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
