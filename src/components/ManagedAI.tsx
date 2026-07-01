import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { managedAI } from "../data/content";

/** Corner arrow (down-toward-start / left in RTL) — echoes the "↳" in the reference. */
function TurnArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="M15 4v7a3 3 0 0 1-3 3H5m0 0 4-4m-4 4 4 4" />
    </svg>
  );
}

/**
 * ManagedAI — "AI as a Service" editorial band modeled on the ZettaJoule /
 * on.energy "24/7 Clean Energy as a Service" section: a light large statement
 * heading + two supporting paragraphs + an arrow-box → pill CTA on the text
 * side, and a big 3D isometric visual on the other side. Two-column grid; grid
 * flows RTL, so DOM item 1 (text) lands on the RIGHT / start and item 2 (the
 * 3D render) lands on the LEFT / end — mirroring the LTR reference.
 */
export function ManagedAI() {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reliable muted autoplay: React doesn't reliably set the muted *property*
  // (which autoplay needs), and browsers may defer autoplay until the media is
  // ready or the user interacts. Set muted imperatively, then retry on `canplay`
  // and on the first interaction (listeners self-remove once it plays).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;

    let started = false;
    const events = ["pointerdown", "keydown", "touchstart", "wheel", "scroll"] as const;
    const cleanup = () => {
      v.removeEventListener("canplay", tryPlay);
      events.forEach((e) => window.removeEventListener(e, tryPlay));
    };
    const tryPlay = () => {
      if (started) return;
      v.play().then(
        () => {
          started = true;
          cleanup();
        },
        () => {},
      );
    };

    tryPlay();
    v.addEventListener("canplay", tryPlay);
    events.forEach((e) => window.addEventListener(e, tryPlay, { passive: true }));
    return cleanup;
  }, []);

  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-12%" },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay },
  });

  return (
    <section id="managed" className="relative z-10 bg-ink p-2 sm:p-2.5">
      <div className="pastel-wash relative overflow-hidden rounded-[1.5rem] text-fg">
        <div className="container-x relative py-20 sm:py-28 lg:py-32">
          <div className="grid items-center gap-x-10 gap-y-14 lg:grid-cols-2 lg:gap-x-20">
            {/* 1 — text column (RTL start / right) */}
            <div className="max-w-xl">
              <motion.span {...rise(0)} className="eyebrow flex items-center gap-2 text-brand">
                <span className="size-1.5 rounded-full bg-brand" />
                {managedAI.eyebrow}
              </motion.span>

              <motion.h2
                {...rise(0.06)}
                className="mt-5 text-balance text-statement text-fg"
              >
                {managedAI.title}
              </motion.h2>

              <motion.p {...rise(0.12)} className="mt-8 text-lead text-muted">
                {managedAI.body1}
              </motion.p>
              <motion.p {...rise(0.18)} className="mt-5 text-lead text-muted">
                {managedAI.body2}
              </motion.p>

              {/* arrow box + pill CTA (like "↳ Contact Our Team") */}
              <motion.div {...rise(0.24)} className="mt-10 flex items-center gap-2.5">
                <span className="grid size-11 place-items-center rounded-xl border border-border bg-brand/[0.06] text-brand">
                  <TurnArrow className="size-5" />
                </span>
                <a
                  href={managedAI.cta.href}
                  className="inline-flex items-center rounded-xl border border-border bg-surface-2 px-5 py-3 text-[15px] font-semibold text-fg shadow-[0_1px_2px_rgba(11,14,20,0.04)] transition-colors hover:border-border-strong"
                >
                  {managedAI.cta.label}
                </a>
              </motion.div>
            </div>

            {/* 2 — 3D workflow-montage visual (RTL end / left). The render has a
                white background, so it floats frameless and blends into the white
                card — like the isometric illustration in the reference. */}
            <motion.div {...rise(0.14)} className="relative">
              <video
                ref={videoRef}
                className="mx-auto aspect-[16/9] w-full max-w-2xl object-cover"
                src={managedAI.video.src}
                poster="/workflow-poster.jpg"
                aria-label={managedAI.video.alt}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
