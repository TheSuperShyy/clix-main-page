import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../lib/gsap";

// The live instance, for components that need programmatic scrolling through
// the SAME smooth-scroll source (e.g. the hero auto-flight). Null when Lenis
// is disabled (reduced motion) — callers must fall back to native/GSAP scroll.
let instance: Lenis | null = null;
export const getLenis = () => instance;

/**
 * Global smooth scroll (Lenis) driven by the GSAP ticker so that
 * ScrollTrigger pinning/scrub stays perfectly in sync.
 * Disabled when the user prefers reduced motion.
 */
export function useLenis() {
  useEffect(() => {
    // Recompute pinned/scrub trigger positions once async media (the hero +
    // zoom videos, the 363-frame reveal sequence) settles — otherwise a pin can
    // be computed against a stale layout and silently fail to engage.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t1 = window.setTimeout(refresh, 400);
    const t2 = window.setTimeout(refresh, 1200);
    const cleanupRefresh = () => {
      window.removeEventListener("load", refresh);
      clearTimeout(t1);
      clearTimeout(t2);
    };

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return cleanupRefresh;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    instance = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      cleanupRefresh();
      gsap.ticker.remove(raf);
      instance = null;
      lenis.destroy();
    };
  }, []);
}
