import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";

/**
 * Hero centerpiece — the pre-rendered 3D Clix mark (transparent WebP).
 *
 * It's a finished isometric render, not a true 3D mesh, so instead of orbit we
 * keep it alive with two layered motions:
 *  - an outer idle float (gentle vertical bob), and
 *  - an inner pointer-parallax tilt (rotateX/rotateY toward the cursor) on a
 *    perspective stage, for a convincing pseudo-3D response.
 * Both collapse to a still image under prefers-reduced-motion.
 */
export default function HeroLogoImage() {
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);

  // Normalised pointer offset from centre (-0.5 … 0.5), smoothed by a spring.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 110, damping: 18, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 110, damping: 18, mass: 0.4 });

  const rotateY = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [10, -10]);
  const parallaxX = useTransform(sx, [-0.5, 0.5], [-14, 14]);

  function handleMove(e: React.PointerEvent) {
    if (reduced) return;
    const el = stage.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }

  function reset() {
    px.set(0);
    py.set(0);
  }

  return (
    <div
      ref={stage}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className="grid size-full place-items-center"
      style={{ perspective: 1100 }}
    >
      {/* Outer: idle float only (keeps the tilt axis clean of the bob). */}
      <motion.div
        animate={reduced ? undefined : { y: [0, -16, 0] }}
        transition={
          reduced
            ? undefined
            : { duration: 6.5, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {/* Inner: pointer-driven 3D tilt + horizontal parallax. */}
        <motion.img
          src="/clix-logo-3d.webp"
          alt="הלוגו של Clix"
          draggable={false}
          className="w-[clamp(240px,38vw,520px)] select-none will-change-transform"
          style={{
            rotateX: reduced ? 0 : rotateX,
            rotateY: reduced ? 0 : rotateY,
            x: reduced ? 0 : parallaxX,
            transformStyle: "preserve-3d",
            filter: "drop-shadow(0 34px 42px rgba(18,18,16,0.30))",
          }}
        />
      </motion.div>
    </div>
  );
}
