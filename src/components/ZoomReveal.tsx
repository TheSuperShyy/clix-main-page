import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
import { brand, stack } from "../data/content";

/**
 * ZoomReveal — "step inside the video" side-anchored expand (ZettaJoule-style).
 *
 * The video starts as a medium rounded card anchored to the LEFT with copy on the
 * RIGHT (RTL start); as you scroll, the card grows to full-bleed — scaled from its
 * left edge (transform-origin: left center) so it expands rightward across the
 * copy — and a tagline caption fades in. RTL mirror of the reference (image on the
 * left instead of the right, because the site is Hebrew).
 *
 * Robust by construction: the "hold" is native CSS `position: sticky`; ScrollTrigger
 * only reads scroll progress (no position:fixed pin). Runs under reduced-motion by
 * design (scroll-tied; client tests on a reduced-motion machine).
 */
export function ZoomReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reliable muted autoplay (same React `muted`-property fix as the hero).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    const play = () => v.play().catch(() => {});
    play();
    v.addEventListener("canplay", play);
    return () => v.removeEventListener("canplay", play);
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const frame = frameRef.current;
      const copy = copyRef.current;
      const caption = captionRef.current;
      if (!section || !frame || !copy || !caption) return;

      const apply = (p: number) => {
        // Grow the left-anchored card to full-bleed.
        gsap.set(frame, { scale: 0.5 + p * 0.5, borderRadius: 24 * (1 - p) });
        // Right-side copy fades as the expanding video covers it.
        gsap.set(copy, {
          autoAlpha: gsap.utils.clamp(0, 1, 1 - p / 0.55),
        });
        // Full-bleed caption fades in over the back third.
        const cp = gsap.utils.clamp(0, 1, (p - 0.65) / 0.3);
        gsap.set(caption, { autoAlpha: cp, y: 20 * (1 - cp) });
      };
      apply(0);

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => apply(self.progress),
      });
      return () => st.kill();
    },
    { scope: sectionRef },
  );

  return (
    // Tall section = scroll room; the sticky child holds the scene while the video
    // scrubs from a left-anchored card → full-bleed.
    <section ref={sectionRef} id="zoom" className="relative z-10 h-[240vh] bg-ink">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Right-side copy (RTL start) — sits behind the video, revealed at the
            small state and covered as the video expands. */}
        <div className="absolute inset-0 z-0">
          <div className="container-x flex h-full items-center sm:pe-8 lg:pe-24">
            <div ref={copyRef} className="max-w-md text-white">
              <span className="eyebrow flex items-center gap-2 text-white/60">
                <span className="size-1.5 rounded-full bg-cyan" />
                {stack.eyebrow}
              </span>
              <h2 className="mt-5 text-balance text-h2">
                {stack.title}
              </h2>
              <p className="mt-5 text-lead text-white/70">
                {stack.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Left-anchored video card — scales from its left edge to full-bleed. */}
        <div
          ref={frameRef}
          className="absolute inset-0 z-10 overflow-hidden will-change-transform"
          style={{
            transformOrigin: "left center",
            transform: "scale(0.5)",
            borderRadius: "24px",
          }}
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
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
          <div aria-hidden className="absolute inset-0 bg-black/30" />

          {/* Caption — fades in once full-bleed. */}
          <div
            ref={captionRef}
            className="absolute inset-0 grid place-items-center px-6 text-center"
            style={{ opacity: 0 }}
          >
            <h2 className="max-w-3xl text-balance text-h2 text-white">
              {brand.tagline}
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
