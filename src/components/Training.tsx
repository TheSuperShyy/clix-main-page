import { training } from "../data/content";
import { Button } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { Reveal } from "./ui/Reveal";

export function Training() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-x">
        <Reveal>
          <div className="surface-card ring-glow relative overflow-hidden p-8 sm:p-12">
            {/* ambient accent */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full opacity-20 blur-[100px]"
              style={{ background: "radial-gradient(circle, var(--color-cyan), transparent 70%)" }}
            />

            <div className="relative grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg/50 px-3.5 py-1.5 text-xs font-medium text-brand-300">
                  <Icon name="spark" size={14} />
                  {training.eyebrow}
                </span>
                <h2 className="mt-5 text-balance text-h2 font-bold text-fg">{training.title}</h2>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">{training.body}</p>
                <div className="mt-8">
                  <Button href="#contact" withArrow>
                    דברו איתנו על הדרכה
                  </Button>
                </div>
              </div>

              <ul className="flex flex-col gap-3">
                {training.points.map((p, i) => (
                  <li
                    key={p}
                    className="flex items-center gap-4 rounded-xl border border-border bg-bg/40 p-4"
                  >
                    <span className="nums grid size-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand to-cyan text-sm font-bold text-bg">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-medium text-fg/90">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
