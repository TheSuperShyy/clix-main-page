import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { stack } from "../data/content";

/** Corner arrow (down-toward-start / left in RTL) — the "↳" from the reference. */
function TurnArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="M15 4v7a3 3 0 0 1-3 3H5m0 0 4-4m-4 4 4 4" />
    </svg>
  );
}

/**
 * Integrations — the tools Clix connects, presented in the ZettaJoule
 * "Modernizing Proven Technology" editorial layout: a light large split
 * headline on one side (RTL start / right) + a supporting paragraph and an
 * arrow-box → pill CTA on the other (RTL end / left), then a full-width visual
 * below (the frosted-glass workflow-montage). White card on the ink gutter.
 */
export function Integrations() {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reliable muted autoplay. React doesn't set the muted *property* and browsers
  // often defer/block a play() fired before the element is on-screen — so we set
  // muted imperatively, call play() when the video scrolls INTO view (Intersection
  // Observer), and also retry on canplay + first user interaction.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    let started = false;
    const events = ["pointerdown", "keydown", "touchstart", "wheel", "scroll"] as const;

    const tryPlay = () => {
      if (started) return;
      v.muted = true;
      const p = v.play();
      if (p) p.then(() => { started = true; cleanup(); }, () => {});
    };

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && tryPlay()),
      { threshold: 0.1 }
    );
    io.observe(v);

    const cleanup = () => {
      io.disconnect();
      v.removeEventListener("canplay", tryPlay);
      v.removeEventListener("loadeddata", tryPlay);
      events.forEach((e) => window.removeEventListener(e, tryPlay));
    };

    tryPlay();
    v.addEventListener("canplay", tryPlay);
    v.addEventListener("loadeddata", tryPlay);
    events.forEach((e) => window.addEventListener(e, tryPlay, { passive: true }));
    return cleanup;
  }, []);

  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-12%" },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay },
  });

  const explore = stack.ctas[1] ?? stack.ctas[0];

  return (
    <section id="integrations" className="relative z-10 bg-ink">
      <div className="relative overflow-hidden bg-bg text-fg">
        <div className="container-x py-20 sm:py-28 lg:py-32">
          {/* Top row — heading (start / right) · paragraph + CTA (end / left) */}
          <div className="grid gap-x-12 gap-y-8 lg:grid-cols-2 lg:items-start">
            <motion.h2 {...rise(0)} className="text-balance text-statement text-fg">
              {stack.title}{" "}
              <span className="text-brand">{stack.titleAccent}</span>
            </motion.h2>

            <div className="lg:pt-1">
              <motion.p {...rise(0.06)} className="max-w-xl text-lead text-muted">
                {stack.subtitle}
              </motion.p>

              {/* arrow box + pill CTA (like "↳ Explore Our Technology") */}
              <motion.div {...rise(0.12)} className="mt-8 flex items-center gap-2.5">
                <span className="grid size-11 place-items-center rounded-xl border border-border bg-brand/[0.06] text-brand">
                  <TurnArrow className="size-5" />
                </span>
                <a
                  href={explore.href}
                  className="inline-flex items-center rounded-xl border border-border bg-surface-2 px-5 py-3 text-[15px] font-semibold text-fg shadow-[0_1px_2px_rgba(11,14,20,0.04)] transition-colors hover:border-border-strong"
                >
                  {explore.label}
                </a>
              </motion.div>
            </div>
          </div>

          {/* Visual below (frosted-glass workflow-montage) — constrained, centered
             so it reads as a contained figure rather than a full-bleed banner. */}
          <motion.div
            {...rise(0.1)}
            className="mx-auto mt-14 max-w-4xl overflow-hidden border border-border sm:mt-16"
          >
            <video
              ref={videoRef}
              className="aspect-[16/9] w-full object-cover"
              src="/workflow-montage.mp4"
              poster="/workflow-poster.jpg"
              aria-label="מפת זרימת עבודה תלת-ממדית של האינטגרציות של Clix"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
