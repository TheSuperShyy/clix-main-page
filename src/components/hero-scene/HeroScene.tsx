import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "../../lib/gsap";
import { createHeroScene, type HeroSceneHandle } from "./createHeroScene";

/**
 * React wrapper for the hero background engine. Fills its parent, renders on
 * the GSAP ticker (the same clock that drives Lenis, so the scrub can never
 * drift from ScrollTrigger), and pauses entirely while the hero region is
 * off-screen.
 *
 * Motion policy: the scene is scroll-scrubbed + ambient (standing
 * reduced-motion exception for the hero scene — the client reviews on a
 * reduced-motion machine), so it runs ungated.
 */
export function HeroScene({ progressRef }: { progressRef: RefObject<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    let handle: HeroSceneHandle;
    try {
      // Size to the CANVAS box, not the host layer — on mobile the canvas is
      // shorter than the layer (it leaves a dark safe-gutter at the bottom for
      // the address bar), so the host height would give the wrong aspect.
      handle = createHeroScene(canvas, canvas.clientWidth, canvas.clientHeight);
    } catch (err) {
      // No WebGL (or context creation failed) — the section's own dark
      // background is the graceful fallback.
      if (import.meta.env.DEV) console.warn("[hero-scene] disabled:", err);
      return;
    }

    let visible = true;
    const tick = (_time: number, deltaTime: number) => {
      if (!visible) return;
      handle.render(progressRef.current ?? 0, deltaTime / 1000);
    };
    gsap.ticker.add(tick);

    // Stop rendering once the hero region has scrolled away.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(host);

    // Only rebuild the GL buffers on a real WIDTH change (layout / orientation).
    // Ignore height-only changes: on mobile the browser's address bar collapses
    // and expands continuously during scroll. The layer is locked to `lvh` and
    // the canvas leaves a fixed-px safe-gutter, so its height is already stable
    // as the bar toggles — but the width guard keeps a stray height-only event
    // from reallocating the composer's render targets (which flashes black).
    let lastW = canvas.clientWidth;
    const ro = new ResizeObserver(() => {
      const nw = canvas.clientWidth;
      if (nw === lastW) return;
      lastW = nw;
      handle.setSize(nw, canvas.clientHeight);
    });
    ro.observe(canvas);

    const onPointerMove = (e: PointerEvent) => {
      handle.setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1,
      );
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      ro.disconnect();
      io.disconnect();
      gsap.ticker.remove(tick);
      handle.dispose();
    };
  }, [progressRef]);

  return <canvas ref={canvasRef} aria-hidden className="scene-canvas" />;
}
