import { Suspense, lazy, useEffect, useRef } from "react";
import { SEQ_END } from "../components/hero-scene/constants";

// Same lazy split as the home page's SceneBackdrop — three.js + postprocessing
// download on their own chunk after first paint, behind the poster fallback.
const HeroScene = lazy(() =>
  import("../components/hero-scene/HeroScene").then((m) => ({ default: m.HeroScene })),
);

/**
 * LegalScene — the SAME live WebGL scene the home page runs, as a fixed
 * backdrop behind a legal page (so the legal pages match the home design and
 * "follow the 3D bg"). The engine renders on the GSAP ticker exactly as on the
 * landing page; here there are no section anchors, so we drive the sequence
 * position from raw page scroll across a SMALL slice of the timeline
 * (0 → SCRUB_END) — enough for gentle life as you scroll a short document,
 * without flying through the whole coin choreography on a text page.
 *
 * Decorative + aria-hidden. Runs ungated (matching the home scene's standing
 * reduced-motion exception — the ambient scene is meant to be seen).
 */

// Keep the scrub inside the hero-intro band so the signature opening look holds
// down the whole page (the aurora + first coin beat), never mid-sequence.
const SCRUB_END = 0.08;

export function LegalScene() {
  // Engine expects a normalized 0–1 (it multiplies by SEQ_END internally).
  const progressRef = useRef(0);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const t = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      progressRef.current = (t * SCRUB_END) / SEQ_END;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div aria-hidden className="scene-fixed pointer-events-none z-0">
      <Suspense
        fallback={
          <div
            className="absolute inset-0 bg-[#04081f] bg-cover bg-center"
            style={{ backgroundImage: "url(/hero-scene-poster.webp)" }}
          />
        }
      >
        <HeroScene progressRef={progressRef} />
      </Suspense>
    </div>
  );
}
