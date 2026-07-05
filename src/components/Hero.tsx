import { useRef, type ReactNode } from "react";
import { motion } from "motion/react";
import { gsap, useGSAP } from "../lib/gsap";
import { hero } from "../data/content";

/**
 * Hero — a faithful clone of the "AI Finance" reference hero
 * (futureoffinance.peachweb.io), rebuilt in our stack, mirrored to Hebrew RTL.
 *
 * Reference composition (LTR) → our RTL mirror:
 *  • Split BOTTOM layout: huge display headline in the bottom-START corner
 *    (RTL right) with a small tagline + an avatar cluster under it; a short
 *    supporting paragraph + a white primary pill / dark ghost pill in the
 *    bottom-END corner (RTL left).
 *  • The deep-navy scene behind everything is the REAL rebuilt WebGL scene —
 *    but it is NOT rendered here: <SceneBackdrop> (App level) fixes it under
 *    the whole page and scrubs it by full-page scroll. This section is
 *    transparent, so the scene shows through it.
 *
 * Scroll behaviour (ref: scroll scrubs the 3D timeline like a video):
 *  • The section is a tall scroll region; the copy viewport is
 *    position:sticky, so the composition stays on screen while you scroll.
 *  • The copy fades out over the first ~28vh of scroll, leaving a BLANK beat
 *    of pure moving scene before the floating panels arrive.
 *
 * Motion: the scene + scroll scrub run ungated (ambient/scroll-tied —
 * standing reduced-motion exception; the client reviews on a reduced-motion
 * machine). The discrete copy entrance stays a framer-motion mount stagger.
 *
 * Integration: keeps id="top" (navbar logo target) + a #hero-inside marker
 * spanning the WHOLE tall region so the navbar stays light-glass through the
 * blank beat too.
 */

export function Hero({ children }: { children?: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);

  // ── GSAP: video scrubber + copy fade-out (scroll-tied, ungated) ──
  useGSAP(
    () => {
      // 1) The copy melts away over the first ~28vh of scroll (quick vanish,
      //    per user), leaving the blank scene beat. autoAlpha also drops it
      //    from the a11y tree / pointer targets once invisible.
      const fade = gsap.to(contentRef.current, {
        autoAlpha: 0,
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=28%",
          scrub: true,
        },
      });

      // 2) The bottom scrim exists for copy legibility — thin it out with the
      //    copy so the blank beat is pure scene.
      const scrim = gsap.to(scrimRef.current, {
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=28%",
          scrub: true,
        },
      });

      return () => {
        [fade, scrim].forEach((tw) => {
          tw.scrollTrigger?.kill();
          tw.kill();
        });
      };
    },
    { scope: sectionRef },
  );

  // Copy entrance — staggered mount reveal (framer-motion).
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
  };
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    // Scene region — TRANSPARENT over the page-wide fixed scene: viewport 1 =
    // composed hero copy, the copy fades out, a blank beat of pure scene
    // plays, then the floating sections passed as `children` (Solutions glass
    // panel, …) scroll OVER the still-scrubbing scene, with scene-visible
    // gaps between/after them (ref behaviour).
    <section ref={sectionRef} id="top" className="relative">
      {/* Navbar dark-treatment marker — spans the WHOLE scene region. */}
      <div id="hero-inside" aria-hidden className="pointer-events-none absolute inset-0" />

      {/* Sticky viewport — the "video" stays put while the region scrolls. */}
      <div
        ref={stickyRef}
        className="sticky top-0 flex h-dvh flex-col justify-end overflow-hidden"
      >
        {/* ── The scene itself renders in <SceneBackdrop> (fixed, page-wide).
            Here only a bottom scrim keeps the copy crisp; it thins as the
            copy fades. ── */}
        <div className="pointer-events-none absolute inset-0">
          <div
            ref={scrimRef}
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[55%]"
            style={{ background: "linear-gradient(to top, rgba(0,4,24,0.85), transparent)" }}
          />
        </div>

        {/* ── Content: split bottom composition (fades out on scroll) ── */}
        <div ref={contentRef} className="relative z-10 w-full will-change-transform">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="container-x w-full pb-16 sm:pb-20 lg:pb-24"
          >
            <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
              {/* START column (RTL right): headline → tagline → avatars. */}
              <div className="max-w-2xl">
                <motion.h1
                  variants={item}
                  aria-label={hero.headline}
                  className="font-medium leading-[1.05] tracking-[-0.03em] text-fg text-[clamp(2.4rem,4.8vw,5.5rem)]"
                >
                  {hero.headlineLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </motion.h1>

                <motion.p variants={item} className="mt-5 text-[1.25rem] font-normal text-fg/90">
                  {hero.tagline}
                </motion.p>

                {/* Avatar cluster — placeholder social-proof circles (ref: 4 photos). */}
                <motion.div variants={item} className="mt-3 flex items-center -space-x-1.5">
                  {[
                    "from-sky/70 to-indigo",
                    "from-mint/70 to-navy",
                    "from-gold/70 to-indigo",
                    "from-brand/70 to-navy",
                  ].map((g, i) => (
                    <span
                      key={i}
                      aria-hidden
                      className={`grid size-8 place-items-center rounded-full bg-gradient-to-br ${g} ring-2 ring-[#000735]`}
                    >
                      <span className="size-1.5 rounded-full bg-white/60" />
                    </span>
                  ))}
                </motion.div>
              </div>

              {/* END column (RTL left): supporting paragraph + CTAs. */}
              <motion.div variants={item} className="max-w-lg lg:pb-1">
                <p className="text-[clamp(1.05rem,1.2vw,1.3rem)] leading-normal text-fg/90">
                  {hero.subcopy}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  {hero.ctas.map((c) =>
                    c.primary ? (
                      <a
                        key={c.href}
                        href={c.href}
                        className="group inline-flex h-12 items-center gap-3 rounded-full bg-white ps-6 pe-2 text-[15px] font-bold text-ink transition-colors hover:bg-white/90"
                      >
                        {c.label}
                        <span className="grid size-8 place-items-center rounded-full bg-ink text-white transition-transform duration-200 group-hover:-translate-x-0.5">
                          <ArrowIcon />
                        </span>
                      </a>
                    ) : (
                      <a
                        key={c.href}
                        href={c.href}
                        className="inline-flex h-12 items-center rounded-full border border-border-strong bg-white/[0.06] px-6 text-[15px] font-bold text-fg backdrop-blur-sm transition-colors hover:bg-white/[0.12]"
                      >
                        {c.label}
                      </a>
                    ),
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating sections riding over the sticky scene. Spacers = beats of
          pure visible scene: a blank beat after the hero copy, and a gap after
          the last panel before the next (non-scene) section. */}
      <div className="relative z-10">
        <div aria-hidden className="h-[62vh] sm:h-[72vh]" />
        {children}
        <div aria-hidden className="h-[30vh] sm:h-[38vh]" />
      </div>
    </section>
  );
}

/** Small arrow inside the CTA badge — points to the RTL "forward" (left). */
function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
      <path
        d="M14 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
