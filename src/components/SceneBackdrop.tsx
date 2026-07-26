import { Suspense, lazy, useRef } from "react";
import { ScrollTrigger, useGSAP } from "../lib/gsap";
// From the constants module, NOT createHeroScene — a static import of the
// engine drags three + postprocessing into the eager bundle (Vite then
// modulepreloads the 660kB three chunk before first paint).
import { SEQ_END } from "./hero-scene/constants";

// Defer the WebGL scene (three.js + @react-three, the bulk of the JS) out of
// the initial bundle — it downloads/parses on its own chunk after first paint.
// The scroll-anchor logic below stays eager, so the sequence is wired up
// immediately; only the canvas mounts late, behind the poster fallback.
const HeroScene = lazy(() =>
  import("./hero-scene/HeroScene").then((m) => ({ default: m.HeroScene })),
);

/**
 * SceneBackdrop — the WebGL scene as a FIXED background behind the whole page
 * (ref behavior: one canvas rides under everything; solid sections cover it,
 * see-through sections — hero, Solutions/Partners gaps, Services, Benefits,
 * Closing — reveal whatever beat of the sequence the page has scrolled to).
 *
 * Scrub — ANCHORED, not linear (decoded from the ref's ui-state.json: zero-
 * height `pwb-anchor` divs pin sequence percentages to section starts). An
 * anchor fires when its section ENTERS the viewport (top crosses the viewport
 * bottom) — that's the only semantics under which the ref's own last anchor
 * (placed after the footer) is reachable, and it makes each beat complete
 * exactly as the next solid band starts covering the scene:
 *
 *   page top              → 0        (hero intro)
 *   #features enters      → 0.083    (intro done as the solid bands cover it)
 *   #services enters      → 0.235    (arc-slicing beat STARTS as it arrives)
 *   #testimonials enters  → 0.336    (drapes done as the solid bands return)
 *   #contact enters       → 0.4      (final beat plays across the closing band)
 *   page bottom           → SEQ_END  (the approved 52% stop, final frame held)
 *
 * Between anchors the sequence interpolates linearly by scroll position, so
 * each beat lands with its section — matching the ref's pacing instead of
 * rushing beats ahead of their sections.
 */

/** Section-top → sequence-position pins (raw sequence units, ref values). */
const ANCHORS = [
  { sel: "#features", seq: 0.083 },
  { sel: "#services", seq: 0.235 },
  { sel: "#testimonials", seq: 0.336 },
  { sel: "#contact", seq: 0.4 },
] as const;

/** Scroll windows where SOLID bands fully cover the viewport, so the scene is
    invisible and rendering it is pure GPU waste (~30fps on iGPUs mid-page):
    Features→KeyFeatures (both bg-[#0d0d0d], contiguous) hide it from the
    moment #features' top passes the viewport top until #services (transparent)
    enters the viewport bottom; Testimonials→Training likewise until #contact.
    A margin keeps a safety strip rendered around each edge. */
const COVERED = [
  { from: "#features", to: "#services" },
  { from: "#testimonials", to: "#contact" },
] as const;
const COVER_MARGIN = 96;

export function SceneBackdrop() {
  const progressRef = useRef(0);
  const coveredRef = useRef(false);

  useGSAP(() => {
    // Piecewise map: scroll y → sequence position, re-measured on every
    // ScrollTrigger refresh (resize, late images/fonts).
    let points: { y: number; seq: number }[] = [{ y: 0, seq: 0 }];
    let covered: [number, number][] = [];

    const measure = () => {
      const max = ScrollTrigger.maxScroll(window);
      points = [{ y: 0, seq: 0 }];
      for (const a of ANCHORS) {
        const el = document.querySelector(a.sel);
        if (!el) continue;
        // Anchor fires as the section enters the viewport bottom.
        const top = el.getBoundingClientRect().top + window.scrollY;
        const y = Math.min(Math.max(top - window.innerHeight, 0), max);
        points.push({ y, seq: a.seq });
      }
      points.push({ y: max, seq: SEQ_END });
      points.sort((a, b) => a.y - b.y);

      covered = [];
      for (const c of COVERED) {
        const from = document.querySelector(c.from);
        const to = document.querySelector(c.to);
        if (!from || !to) continue;
        // Covered once the solid band's top passes the viewport top, until the
        // next transparent section enters the viewport bottom.
        const start = from.getBoundingClientRect().top + window.scrollY + COVER_MARGIN;
        const end = to.getBoundingClientRect().top + window.scrollY - window.innerHeight - COVER_MARGIN;
        if (end > start) covered.push([start, end]);
      }
    };

    const seqAt = (y: number) => {
      for (let i = 1; i < points.length; i++) {
        if (y <= points[i].y) {
          const a = points[i - 1];
          const b = points[i];
          const t = b.y > a.y ? (y - a.y) / (b.y - a.y) : 1;
          return a.seq + (b.seq - a.seq) * t;
        }
      }
      return SEQ_END;
    };

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onRefresh: measure,
      onUpdate: (self) => {
        // Engine expects normalized 0–1 (it multiplies by SEQ_END itself).
        const y = self.scroll();
        progressRef.current = seqAt(y) / SEQ_END;
        coveredRef.current = covered.some(([a, b]) => y >= a && y <= b);
      },
    });
    measure();
    progressRef.current = seqAt(st.scroll()) / SEQ_END;
    coveredRef.current = covered.some(([a, b]) => st.scroll() >= a && st.scroll() <= b);
    return () => st.kill();
  });

  return (
    <div aria-hidden className="scene-fixed pointer-events-none z-0">
      <Suspense
        fallback={
          // Poster of the scene's first beat — holds the frame until the WebGL
          // chunk loads, so there's no flash of empty background.
          <div
            className="absolute inset-0 bg-[#0d0d0d] bg-cover bg-center"
            style={{ backgroundImage: "url(/hero-scene-poster.webp)" }}
          />
        }
      >
        <HeroScene progressRef={progressRef} coveredRef={coveredRef} />
      </Suspense>
    </div>
  );
}
