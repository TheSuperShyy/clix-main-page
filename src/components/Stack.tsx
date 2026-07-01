import { motion, useReducedMotion } from "motion/react";
import { stack } from "../data/content";

/** Pastel card color per tool (static classes so Tailwind emits them). */
const TINT: Record<string, string> = {
  mint: "bg-tint-mint",
  sky: "bg-tint-sky",
  blush: "bg-tint-blush",
  lavender: "bg-tint-lavender",
};

type Tool = (typeof stack.tools)[number];

/** A single integration card: tinted top with the (placeholder) logo tile, a
    white footer with the "TOOL · NN" label + name — mirrors the reference. */
function ToolCard({ tool, n }: { tool: Tool; n: number }) {
  return (
    <figure className="w-40 overflow-hidden rounded-2xl border border-white/70 bg-white shadow-[0_24px_50px_-30px_rgba(11,14,20,0.45)] sm:w-44">
      <div className={`grid h-24 place-items-center ${TINT[tool.tint]}`}>
        <span className="grid size-12 place-items-center rounded-xl bg-white/85 text-lg font-extrabold text-fg shadow-[0_2px_8px_rgba(11,14,20,0.12)]">
          {tool.mono}
        </span>
      </div>
      <figcaption className="px-4 py-3.5">
        <div className="eyebrow text-faint">{`TOOL · ${String(n).padStart(2, "0")}`}</div>
        <div className="mt-1 font-semibold text-fg">{tool.name}</div>
      </figcaption>
    </figure>
  );
}

/** Card wrapper: framer fades it in (opacity only, so it doesn't fight the CSS
    transforms), an inner layer gently floats, the innermost holds the rotation
    + horizontal nudge that gives the scattered look. Reduced-motion safe. */
function FloatingCard({
  tool,
  n,
  reduced,
  rotate,
  nudge,
  delay,
}: {
  tool: Tool;
  n: number;
  reduced: boolean | null;
  rotate: number;
  nudge: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
    >
      <div className="animate-float" style={{ animationDelay: `${delay}s` }}>
        <div style={{ transform: `translateX(${nudge}) rotate(${rotate}deg)` }}>
          <ToolCard tool={tool} n={n} />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Stack — "the tools Clix connects into one brain". Centered eyebrow + split
 * headline (base near-black + blue accent) + two CTAs, flanked by two columns
 * of scattered, gently-floating tool cards (desktop). On mobile the cards drop
 * into a tidy grid below. Floating card on the ink gutter with the pastel wash.
 */
export function Stack() {
  const reduced = useReducedMotion();

  // Split the 10 tools into two flanking columns; the rest render on mobile.
  const half = Math.ceil(stack.tools.length / 2);
  const startCol = stack.tools.slice(0, half); // right in RTL
  const endCol = stack.tools.slice(half); // left in RTL

  // Per-slot rotation + horizontal nudge for the organic scatter.
  const rots = [-6, 5, -4, 6, -3];
  const nudges = ["-0.75rem", "1.25rem", "-0.25rem", "1.5rem", "0.5rem"];

  return (
    <section id="stack" className="relative z-10 bg-ink p-2 sm:p-2.5">
      <div className="pastel-wash relative overflow-hidden rounded-[1.5rem] text-fg">
        <div className="container-x relative py-24 sm:py-28 lg:py-32">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(auto,34rem)_1fr] lg:gap-6">
            {/* Start-side column (right in RTL) — desktop only */}
            <div className="hidden flex-col items-center gap-7 lg:flex">
              {startCol.map((tool, i) => (
                <FloatingCard
                  key={tool.name}
                  tool={tool}
                  n={i + 1}
                  reduced={reduced}
                  rotate={rots[i % rots.length]}
                  nudge={nudges[i % nudges.length]}
                  delay={0.05 * i}
                />
              ))}
            </div>

            {/* Center — eyebrow, split headline, CTAs */}
            <div className="text-center">
              <motion.span
                initial={reduced ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="eyebrow inline-flex items-center gap-2 text-faint"
              >
                <span className="nums">{stack.index}</span>
                <span className="size-1 rounded-full bg-faint/60" />
                {stack.eyebrow}
              </motion.span>

              <motion.h2
                initial={reduced ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.05 }}
                className="mt-6 text-balance text-h2"
              >
                {stack.title}{" "}
                <span className="text-brand">{stack.titleAccent}</span>
              </motion.h2>

              <motion.div
                initial={reduced ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="mt-9 flex flex-wrap items-center justify-center gap-3"
              >
                {stack.ctas.map((c) =>
                  c.primary ? (
                    <a
                      key={c.href}
                      href={c.href}
                      className="inline-flex h-11 items-center rounded-full bg-brand px-6 text-[15px] font-bold text-white shadow-[0_10px_24px_-10px_rgba(46,91,255,0.6)] transition-colors hover:bg-brand-600"
                    >
                      {c.label}
                    </a>
                  ) : (
                    <a
                      key={c.href}
                      href={c.href}
                      className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-white/70 px-6 text-[15px] font-semibold text-fg backdrop-blur-sm transition-colors hover:border-border-strong"
                    >
                      {c.label}
                      <span aria-hidden>←</span>
                    </a>
                  ),
                )}
              </motion.div>
            </div>

            {/* End-side column (left in RTL) — desktop only */}
            <div className="hidden flex-col items-center gap-7 lg:flex">
              {endCol.map((tool, i) => (
                <FloatingCard
                  key={tool.name}
                  tool={tool}
                  n={half + i + 1}
                  reduced={reduced}
                  rotate={rots[(i + 2) % rots.length]}
                  nudge={nudges[(i + 1) % nudges.length]}
                  delay={0.05 * i}
                />
              ))}
            </div>
          </div>

          {/* Mobile / tablet — all tools in a tidy grid below the headline. */}
          <div className="mt-14 grid grid-cols-2 justify-items-center gap-4 sm:grid-cols-3 lg:hidden">
            {stack.tools.map((tool, i) => (
              <ToolCard key={tool.name} tool={tool} n={i + 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
