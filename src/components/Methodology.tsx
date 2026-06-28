import { useRef, useState } from "react";
import { methodology } from "../data/content";
import { gsap, useGSAP } from "../lib/gsap";
import { SectionHeading } from "./ui/SectionHeading";

export function Methodology() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const steps = methodology.steps;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Pinned, scrubbed crossfade — only when motion is allowed.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray<HTMLElement>(".method-step");
        const pin = root.current!.querySelector<HTMLElement>(".method-pin");
        if (!pin || panels.length === 0) return;

        gsap.set(panels, { position: "absolute", inset: 0 });
        gsap.set(panels.slice(1), { autoAlpha: 0, yPercent: 10 });
        gsap.set(panels[0], { autoAlpha: 1, yPercent: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: `+=${panels.length * 100}%`,
            scrub: true,
            pin,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(
                panels.length - 1,
                Math.floor(self.progress * panels.length),
              );
              setActive(idx);
            },
          },
        });

        for (let i = 1; i < panels.length; i++) {
          tl.to(panels[i - 1], { autoAlpha: 0, yPercent: -10, duration: 0.5 }).fromTo(
            panels[i],
            { autoAlpha: 0, yPercent: 10 },
            { autoAlpha: 1, yPercent: 0, duration: 0.5 },
            "<",
          );
        }
      });
    },
    { scope: root },
  );

  return (
    <section id="method" ref={root} className="relative scroll-mt-24">
      <div className="method-pin flex min-h-screen flex-col justify-center py-24">
        <div className="container-x">
          <SectionHeading eyebrow={methodology.eyebrow} title={methodology.title} />

          <div className="mt-14 grid gap-10 lg:grid-cols-[220px_1fr]">
            {/* progress rail */}
            <ol className="flex gap-4 lg:flex-col">
              {steps.map((s, i) => (
                <li key={s.num} className="flex items-center gap-3">
                  <span
                    className={`nums grid size-9 shrink-0 place-items-center rounded-full border text-sm font-bold transition-all duration-300 ${
                      i === active
                        ? "border-brand bg-brand/15 text-brand-300 shadow-[0_0_16px_-2px_var(--color-brand)]"
                        : "border-border text-faint"
                    }`}
                  >
                    {s.num}
                  </span>
                  <span
                    className={`hidden text-sm transition-colors duration-300 lg:block ${
                      i === active ? "text-fg" : "text-faint"
                    }`}
                  >
                    {s.title}
                  </span>
                </li>
              ))}
            </ol>

            {/* step panels */}
            <div className="relative min-h-[260px]">
              {steps.map((s) => (
                <div key={s.num} className="method-step">
                  <span className="nums text-7xl font-extrabold text-gradient sm:text-8xl">
                    {s.num}
                  </span>
                  <h3 className="mt-4 text-3xl font-bold text-fg sm:text-4xl">{s.title}</h3>
                  <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
