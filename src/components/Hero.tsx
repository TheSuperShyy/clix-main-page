import { motion, useReducedMotion } from "motion/react";
import { hero } from "../data/content";

/**
 * Hero — on.energy-style full-bleed dark hero.
 *  • Looping muted background video (clix-ads.mp4) covers the whole band.
 *  • Same element set as the on.energy reference, RTL-mirrored:
 *      large light headline (inline-start), supporting paragraph at the
 *      bottom-start corner, a "discover" glass card at the bottom-end corner.
 *  • Top + bottom scrims keep the navbar and copy legible over the footage.
 *  • framer-motion mount stagger; honours prefers-reduced-motion
 *    (the video does not autoplay/loop when reduced motion is requested).
 */
export function Hero() {
  const reduced = useReducedMotion();

  // Shared mount transition — entrance from below, expo-out.
  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const, delay },
  });

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink text-on-ink"
    >
      {/* Full-bleed looping video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/clix-ads.mp4"
        autoPlay={!reduced}
        loop={!reduced}
        muted
        playsInline
        preload="auto"
        tabIndex={-1}
        aria-hidden
      />

      {/* Legibility scrims — darken the top (nav) and the bottom (copy). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-ink/75 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink via-ink/40 to-transparent"
      />

      {/* Content layer */}
      <div className="container-x relative z-10 flex min-h-[100svh] flex-col pb-12 pt-32 sm:pb-16">
        <motion.h1
          {...rise(0.15)}
          className="mt-[18vh] max-w-4xl text-balance text-[clamp(2.5rem,7.5vw,6.5rem)] font-light leading-[0.98] tracking-tight text-white sm:mt-[22vh]"
        >
          {hero.headline}
        </motion.h1>

        {/* Bottom row: supporting paragraph (start) + discover card (end). */}
        <div className="mt-auto flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <motion.p
            {...rise(0.3)}
            className="max-w-md text-base leading-relaxed text-on-ink/85 sm:text-lg"
          >
            {hero.subcopy}
          </motion.p>

          <motion.a
            {...rise(0.42)}
            href={hero.discover.href}
            className="group flex items-center gap-4 rounded-2xl border border-on-ink/15 bg-ink/40 p-3 pe-5 backdrop-blur-md transition-colors hover:bg-ink/55 sm:max-w-sm"
          >
            <div className="min-w-0">
              <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-on-ink/70">
                <span className="size-1.5 rounded-full bg-cyan" />
                {hero.discover.eyebrow}
              </span>
              <p className="mt-1.5 text-sm leading-snug text-on-ink sm:text-[0.95rem]">
                {hero.discover.title}
              </p>
            </div>
            <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-ink-2 ring-1 ring-on-ink/10">
              <img
                src="/clix-logo-3d.webp"
                alt=""
                className="h-full w-full object-contain p-2"
              />
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
