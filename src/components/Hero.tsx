import { useEffect, useRef, type ReactNode } from "react";
import { motion } from "motion/react";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
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
 *  • A deep-navy rendered scene: a large rim-lit sphere in the top-END area
 *    (RTL left, opposite the headline), pleated diagonal folds down the START
 *    side, and a fine film grain over everything — reproduced procedurally on a
 *    <canvas> (the sphere + drift) plus CSS layers (folds, grain, vignette), so
 *    no third-party asset is used.
 *
 * Scroll behaviour (ref: the background is a SCRUBBED VIDEO — scroll plays it):
 *  • The section is a tall (250vh) scroll region; the scene viewport is
 *    position:sticky, so the "video" stays on screen while you scroll.
 *  • Scroll progress (0→1 across the whole region) drives the canvas like a
 *    video scrubber — the sphere pushes in / drifts down as you scroll.
 *  • The copy fades out over the first ~half viewport of scroll, leaving a
 *    BLANK beat of pure moving scene before section 2 arrives.
 *
 * Motion: canvas rAF loop + scroll scrub run ungated (ambient/scroll-tied —
 * standing reduced-motion exception; the client reviews on a reduced-motion
 * machine). The discrete copy entrance stays a framer-motion mount stagger.
 *
 * Integration: keeps id="top" (navbar logo target) + a #hero-inside marker
 * spanning the WHOLE tall region so the navbar stays light-glass through the
 * blank beat too.
 */

// Fine grain — an inline SVG turbulence tile, blended over the scene.
const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export function Hero({ children }: { children?: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const foldsRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  // Scroll progress across the tall region (0..1) — read by the canvas loop
  // every frame, written by ScrollTrigger (the "video scrubber").
  const progressRef = useRef(0);

  // ── Canvas: deep-navy scene — ambient drift + scroll-scrubbed camera ──
  useEffect(() => {
    const canvas = canvasRef.current;
    const sticky = stickyRef.current;
    const section = sectionRef.current;
    if (!canvas || !sticky || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = sticky.clientWidth;
      h = sticky.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const draw = (t: number) => {
      // Scrub position — eases the scene like a scrolled video timeline.
      const p = progressRef.current;

      // Deep-navy base wash.
      const base = ctx.createLinearGradient(0, 0, w, h);
      base.addColorStop(0, "#0a1330");
      base.addColorStop(0.5, "#060b1e");
      base.addColorStop(1, "#03050f");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, w, h);

      // Faint indigo ambient glow, slowly breathing near the top-end (left),
      // sliding down as the video scrubs.
      const gx = w * (0.3 + Math.sin(t * 0.05) * 0.015);
      const gy = h * (0.12 + p * 0.3 + Math.cos(t * 0.06) * 0.02);
      const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(w, h) * 0.6);
      glow.addColorStop(0, "rgba(30,42,110,0.55)");
      glow.addColorStop(1, "rgba(30,42,110,0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      // The sphere — top-END (left) area, partially off the top edge.
      // Scroll "plays" a slow camera push-in: it grows and drifts down/inward.
      const sr = Math.max(w, h) * (0.42 + p * 0.34);
      const sx = w * (0.29 + p * 0.16);
      const sy = -h * 0.08 + p * h * 0.52 + Math.sin(t * 0.08) * 6;
      ctx.save();
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.clip();
      // Dark body.
      const body = ctx.createRadialGradient(sx - sr * 0.25, sy - sr * 0.2, sr * 0.1, sx, sy, sr);
      body.addColorStop(0, "#0c1740");
      body.addColorStop(1, "#04081c");
      ctx.fillStyle = body;
      ctx.fillRect(sx - sr, sy - sr, sr * 2, sr * 2);
      // Cyan/sky rim light on the lower-right crescent — brightens slightly as
      // the camera closes in.
      const lx = sx + sr * 0.82;
      const ly = sy + sr * (0.9 + Math.sin(t * 0.08) * 0.02);
      const rim = ctx.createRadialGradient(lx, ly, sr * 0.35, lx, ly, sr * 1.12);
      rim.addColorStop(0, `rgba(150,205,240,${0.5 + p * 0.14})`);
      rim.addColorStop(0.55, "rgba(110,170,225,0.12)");
      rim.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = rim;
      ctx.fillRect(sx - sr, sy - sr, sr * 2, sr * 2);
      ctx.globalCompositeOperation = "source-over";
      ctx.restore();
    };

    let raf = 0;
    let running = true;
    let start = 0;
    const loop = (now: number) => {
      if (!running) return;
      if (!start) start = now;
      draw((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Pause the loop when the whole tall region is off-screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          start = 0;
          raf = requestAnimationFrame(loop);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    io.observe(section);

    const ro = new ResizeObserver(() => resize());
    ro.observe(sticky);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  // ── GSAP: video scrubber + copy fade-out (scroll-tied, ungated) ──
  useGSAP(
    () => {
      // 1) Master scrubber — 0..1 across the whole 250vh region, feeding the
      //    canvas loop like a video timeline.
      const scrubber = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });

      // 2) The copy melts away over the first ~28vh of scroll (quick vanish,
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

      // 3) The bottom scrim exists for copy legibility — thin it out with the
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

      // 4) Folds drift down slowly across the whole scrub (parallax texture).
      const folds = gsap.to(foldsRef.current, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      return () => {
        scrubber.kill();
        [fade, scrim, folds].forEach((tw) => {
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
    // Scene region — the sticky "video" is the page background for this whole
    // stretch: viewport 1 = composed hero, the copy fades out, a blank beat of
    // pure scene plays, then the floating sections passed as `children`
    // (Solutions glass panel, …) scroll OVER the still-scrubbing scene, with
    // scene-visible gaps between/after them (ref behaviour).
    <section ref={sectionRef} id="top" className="relative bg-[#03050f]">
      {/* Navbar dark-treatment marker — spans the WHOLE scene region. */}
      <div id="hero-inside" aria-hidden className="pointer-events-none absolute inset-0" />

      {/* Sticky viewport — the "video" stays put while the region scrolls. */}
      <div
        ref={stickyRef}
        className="sticky top-0 flex h-dvh flex-col justify-end overflow-hidden"
      >
        {/* ── Scene layers (scroll-scrubbed like a video) ── */}
        <div className="pointer-events-none absolute inset-0">
          <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
          {/* Pleated diagonal folds down the START side (RTL right) — slightly
              oversized so the scrubbed drift never reveals an edge. */}
          <div
            ref={foldsRef}
            aria-hidden
            className="absolute inset-x-0 -inset-y-[12%] will-change-transform"
            style={{
              backgroundImage:
                "repeating-linear-gradient(112deg, rgba(255,255,255,0) 0px, rgba(255,255,255,0.045) 2px, rgba(255,255,255,0) 26px, rgba(0,0,0,0.12) 40px, rgba(255,255,255,0) 54px)",
              WebkitMaskImage:
                "linear-gradient(to left, #000 0%, rgba(0,0,0,0.35) 34%, transparent 62%)",
              maskImage: "linear-gradient(to left, #000 0%, rgba(0,0,0,0.35) 34%, transparent 62%)",
              opacity: 0.7,
            }}
          />
          {/* Edge vignette so the corners deepen behind the copy. */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(130% 100% at 30% 8%, transparent 30%, rgba(0,0,0,0.5) 100%)",
            }}
          />
          {/* Bottom scrim — keeps the bottom copy crisp; thins as the copy fades. */}
          <div
            ref={scrimRef}
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[55%]"
            style={{ background: "linear-gradient(to top, rgba(3,5,15,0.9), transparent)" }}
          />
          {/* Film grain. */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.13] mix-blend-overlay"
            style={{ backgroundImage: `url("${GRAIN}")`, backgroundSize: "180px 180px" }}
          />
        </div>

        {/* ── Content: split bottom composition (fades out on scroll) ── */}
        <div ref={contentRef} className="relative z-10 w-full will-change-transform">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="container-x w-full pb-14 sm:pb-16"
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
                      className={`grid size-8 place-items-center rounded-full bg-gradient-to-br ${g} ring-2 ring-[#03050f]`}
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
        <div aria-hidden className="h-[55vh] sm:h-[65vh]" />
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
