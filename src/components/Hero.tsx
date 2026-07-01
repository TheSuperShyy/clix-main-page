import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { hero } from "../data/content";

/**
 * Hero — on.energy-style full-bleed dark hero.
 *  • Looping muted background video (clix-ads.mp4) covers the whole band.
 *  • Same element set as the on.energy reference, RTL-mirrored:
 *      large light headline (inline-start), supporting paragraph at the
 *      bottom-start corner, a "discover" glass card at the bottom-end corner.
 *  • Top + bottom scrims keep the navbar and copy legible over the footage.
 *  • framer-motion mount stagger; honours prefers-reduced-motion.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reliable muted-autoplay. The ambient background loop is silent and always
  // plays — even under reduced-motion (only the UI motion below honours it).
  // React doesn't always set the `muted` DOM *property* from the attribute, so
  // set it imperatively, then play. We retry on `canplay` and — if the browser
  // still refuses autoplay — on the first user interaction (pointer / key /
  // scroll / touch), after which the listeners self-remove.
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
        () => {}, // autoplay refused — wait for the next trigger
      );
    };

    tryPlay();
    v.addEventListener("canplay", tryPlay);
    events.forEach((e) => window.addEventListener(e, tryPlay, { passive: true }));
    return cleanup;
  }, []);

  // Shared mount transition — entrance from below, expo-out.
  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const, delay },
  });

  return (
    <section id="top" className="bg-ink p-2 sm:p-2.5">
      {/* Floating card — full-bleed video clipped to the rounded card. */}
      <div className="relative flex min-h-[calc(100svh-1.5rem)] flex-col overflow-hidden rounded-[1.5rem] bg-ink text-on-ink">
      {/* Full-bleed looping video — stitched montage (macrostar → macroarrow → lowhero → lockup).
          poster = a bright opening frame so the hero never paints black before/without playback
          (autoplay can be deferred or blocked); videoRef + onCanPlay nudge play() to be safe. */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/hero-montage.mp4"
        poster="/hero-poster.jpg"
        autoPlay
        loop
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
      {/* Always-on bottom edge scrim — fades the video's hard bottom edge into
          solid black so the cutoff is never visible and it blends seamlessly into
          the black backdrop of the value-prop band below. Sits below the content
          layer (z-10) so the discover card + copy stay crisp. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ink via-ink/70 to-transparent"
      />
      {/* Content layer */}
      <div className="container-x relative z-10 flex flex-1 flex-col pb-5 pt-32 sm:pb-6">
        <motion.h1
          {...rise(0.15)}
          className="mt-[18vh] max-w-3xl text-balance text-h1 text-white sm:mt-[22vh]"
        >
          {hero.headline}
        </motion.h1>

        {/* Bottom row: supporting paragraph (start) + discover card (end). */}
        <div className="mt-auto flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <motion.p
            {...rise(0.3)}
            className="max-w-md text-lead text-on-ink/85"
          >
            {hero.subcopy}
          </motion.p>

          <motion.a
            {...rise(0.42)}
            href={hero.discover.href}
            className="group flex items-center gap-4 rounded-[14px] border border-on-ink/15 bg-ink/40 p-3.5 backdrop-blur-md transition-colors hover:bg-ink/55 sm:max-w-[306px]"
          >
            <div className="min-w-0">
              <span className="eyebrow flex items-center gap-2 text-on-ink/70">
                <span className="size-1.5 rounded-full bg-cyan" />
                {hero.discover.eyebrow}
              </span>
              <p className="mt-2 text-[15px] leading-snug text-on-ink sm:text-base">
                {hero.discover.title}
              </p>
            </div>
            <span className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-[10px] bg-ink-2 ring-1 ring-on-ink/10">
              <img
                src="/clix-logo-3d.webp"
                alt=""
                className="h-full w-full object-contain p-1.5"
              />
            </span>
          </motion.a>
        </div>
      </div>
      </div>
    </section>
  );
}
