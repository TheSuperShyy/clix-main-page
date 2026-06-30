import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { hero } from "../data/content";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";

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
  const fadeRef = useRef<HTMLDivElement>(null);
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

  // The bottom fade is hidden at the top of the hero and scrubs in as you
  // scroll down (scroll-driven → GSAP ScrollTrigger, synced to Lenis).
  useGSAP(() => {
    const el = fadeRef.current;
    if (!el) return;
    if (reduced) {
      gsap.set(el, { opacity: 0.85 }); // static fade when motion is reduced
      return;
    }
    gsap.set(el, { opacity: 0 });
    // Start the fade once you're ~25% into the hero and reach full black by the
    // time the hero bottom clears the top — so the scroll-OUT reads clearly.
    ScrollTrigger.create({
      trigger: "#top",
      start: "top top-=25%",
      end: "bottom top",
      scrub: true,
      animation: gsap.to(el, { opacity: 1, ease: "none" }),
    });
  }, [reduced]);

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
      {/* Bottom fade — sits ABOVE the content (z-20) so it fades the video AND
          the text into black toward the bottom, as one overlay over the page.
          pointer-events-none keeps the discover card / links clickable. */}
      <div
        ref={fadeRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[90%]"
        style={{
          opacity: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 24%, rgba(0,0,0,0.82) 48%, rgba(0,0,0,0.45) 74%, transparent 100%)",
        }}
      />

      {/* Content layer */}
      <div className="container-x relative z-10 flex min-h-[100svh] flex-col pb-12 pt-32 sm:pb-16 sm:ps-8 lg:ps-24">
        <motion.h1
          {...rise(0.15)}
          className="mt-[18vh] max-w-3xl text-balance text-[clamp(2rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight text-white sm:mt-[22vh]"
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
            className="group flex items-center gap-4 rounded-[14px] border border-on-ink/15 bg-ink/40 p-3.5 backdrop-blur-md transition-colors hover:bg-ink/55 sm:max-w-[306px]"
          >
            <div className="min-w-0">
              <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-on-ink/70">
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
    </section>
  );
}
