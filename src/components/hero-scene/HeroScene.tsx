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
      handle = createHeroScene(canvas, host.clientWidth, host.clientHeight);
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

    const ro = new ResizeObserver(() => {
      handle.setSize(host.clientWidth, host.clientHeight);
    });
    ro.observe(host);

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

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />;
}
