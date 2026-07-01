import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { voiceAI } from "../data/content";

/* — inline icons — */
function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}
/** Corner arrow (down-toward-start / left in RTL) — echoes the "↳" in the reference. */
function TurnArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="M15 4v7a3 3 0 0 1-3 3H5m0 0 4-4m-4 4 4 4" />
    </svg>
  );
}

/**
 * VoiceAI — editorial "story" band modeled on the ZettaJoule reference: a 2×2
 * grid — small mission label (top, RTL start / right) · large statement + pill
 * CTA (top, RTL end / left) · supporting paragraph + points (bottom, start) ·
 * big landscape media panel (bottom, end). White "Cloud" card floating on the
 * ink gutter with a soft mint→blue wash. Grid flows RTL, so DOM item 1 lands
 * top-right, item 2 top-left, etc.
 */
export function VoiceAI() {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  // React doesn't reliably set the muted *property*, which autoplay needs.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-12%" },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay },
  });

  return (
    <section id="voice" className="bg-ink p-2 sm:p-2.5">
      <div className="relative overflow-hidden rounded-[1.5rem] bg-bg-2 text-fg">
        {/* soft mint→blue wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 18% 0%, rgba(23,195,206,0.10), transparent 55%), radial-gradient(90% 90% at 100% 100%, rgba(46,91,255,0.08), transparent 55%)",
          }}
        />

        <div className="container-x relative py-20 sm:py-28 lg:py-32 lg:ps-8">
          <div className="grid items-start gap-x-10 gap-y-12 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-24">
            {/* 1 — mission label (top · RTL start / right) */}
            <motion.p {...rise(0)} className="text-sm font-semibold text-fg sm:text-[15px]">
              {voiceAI.kicker}
            </motion.p>

            {/* 2 — statement + CTA (top · RTL end / left) */}
            <div>
              <motion.p
                {...rise(0.06)}
                className="max-w-xl text-balance text-statement text-fg/90"
              >
                {voiceAI.title}
              </motion.p>

              {/* arrow box + pill CTA (like "↳ Discover Our Story") */}
              <motion.div {...rise(0.14)} className="mt-9 flex items-center gap-2.5">
                <span className="grid size-11 place-items-center rounded-xl border border-border bg-brand/[0.06] text-brand">
                  <TurnArrow className="size-5" />
                </span>
                <a
                  href={voiceAI.cta.href}
                  className="inline-flex items-center rounded-xl border border-border bg-surface-2 px-5 py-3 text-[15px] font-semibold text-fg shadow-[0_1px_2px_rgba(11,14,20,0.04)] transition-colors hover:border-border-strong"
                >
                  {voiceAI.cta.label}
                </a>
              </motion.div>
            </div>

            {/* 3 — supporting paragraph + points (bottom · RTL start / right) */}
            <div>
              <motion.p {...rise(0.08)} className="max-w-md text-lead text-muted">
                {voiceAI.body}
              </motion.p>

              <motion.ul {...rise(0.16)} className="mt-7 flex flex-col gap-3">
                {voiceAI.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-base text-fg/85">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand/12 text-brand">
                      <CheckIcon className="size-3.5" />
                    </span>
                    {p}
                  </li>
                ))}
              </motion.ul>
            </div>

            {/* 4 — media panel (bottom · RTL end / left) */}
            <motion.div {...rise(0.12)}>
              <div className="relative overflow-hidden rounded-2xl border border-border bg-ink shadow-[0_40px_90px_-45px_rgba(11,14,20,0.55)]">
                <video
                  ref={videoRef}
                  className="aspect-[16/9] size-full object-cover"
                  src="/clix-ads.mp4"
                  poster="/hero-poster.jpg"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
                <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
