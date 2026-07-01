import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
import { stack } from "../data/content";

/**
 * ScrollReveal — on.energy-style scroll-scrubbed product reveal.
 *
 * Instead of autoplaying, the Clix mark "reveals" frame-by-frame as you scroll:
 * the section pins, and scroll progress drives an image SEQUENCE drawn on a
 * <canvas>. We use pre-decoded JPG frames (not <video>.currentTime) because
 * seeking a video on scroll is janky — drawing already-loaded images is the
 * technique Apple/on.energy use for buttery-smooth frame scrubbing.
 *
 * Frames: public/reveal/frame-0001.jpg … frame-0363.jpg — the stitched VOID
 * reveal (ignition → reveal → drone, three beats concatenated): the Clix mark
 * ignites out of a black void, flares to a neon outline, then drones back.
 *
 * Note: this is a scroll-tied effect (only moves when the user scrolls), and it
 * runs even under reduced-motion by design — it's the section's core content and
 * the client tests on a reduced-motion machine. The UI text below is static.
 */
const FRAME_COUNT = 363;
const framePath = (i: number) =>
  `/reveal/frame-${String(i).padStart(4, "0")}.jpg`;

export function ScrollReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const canvas = canvasRef.current;
      if (!section || !canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.imageSmoothingQuality = "high";

      // Preload every frame up front so scrubbing never waits on a decode.
      const images: HTMLImageElement[] = [];
      for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        img.src = framePath(i);
        images.push(img);
      }

      const state = { frame: 0 };

      // Cover-draw the current frame into the (DPR-scaled) canvas.
      const render = () => {
        const img = images[Math.round(state.frame)];
        if (!img || !img.complete || !img.naturalWidth) return;
        const cw = canvas.width;
        const ch = canvas.height;
        const ir = img.naturalWidth / img.naturalHeight;
        const cr = cw / ch;
        let dw: number, dh: number, dx: number, dy: number;
        if (cr > ir) {
          dw = cw;
          dh = cw / ir;
          dx = 0;
          dy = (ch - dh) / 2;
        } else {
          dh = ch;
          dw = ch * ir;
          dy = 0;
          dx = (cw - dw) / 2;
        }
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, dx, dy, dw, dh);
      };

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(canvas.clientWidth * dpr);
        canvas.height = Math.round(canvas.clientHeight * dpr);
        render();
      };
      resize();
      window.addEventListener("resize", resize);

      // Draw the first frame as soon as it lands (preload may finish after mount).
      images[0].decode?.().then(render).catch(() => render());

      // Scroll → frame index. Pin the section and scrub through the sequence.
      const anim = gsap.to(state, {
        frame: FRAME_COUNT - 1,
        ease: "none",
        onUpdate: render,
      });
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 0.5,
        animation: anim,
      });

      return () => {
        window.removeEventListener("resize", resize);
        st.kill();
        anim.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="reveal" className="bg-black p-2 sm:p-2.5">
      {/* Floating card — the scroll-scrubbed canvas clipped to the rounded card. */}
      <div className="relative h-[calc(100svh-1.5rem)] overflow-hidden rounded-[1.5rem] bg-graphite text-white">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />

      {/* Legibility scrims: darken the start side (text) and the top (navbar). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/75 via-black/25 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent"
      />

      {/* Static overlay copy — stays put while the mark reveals on scroll. */}
      <div className="container-x relative z-10 flex h-full flex-col justify-center pb-16 pt-32 sm:ps-8 lg:ps-24">
        <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
          <span className="size-1.5 rounded-full bg-cyan" />
          {stack.eyebrow}
        </span>
        <h2 className="mt-5 max-w-2xl text-balance text-[clamp(1.9rem,4.4vw,3.5rem)] leading-[1.05] tracking-tight">
          {stack.title}
        </h2>
        <p className="mt-6 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
          {stack.subtitle}
        </p>
      </div>
      </div>
    </section>
  );
}
