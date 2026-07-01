import { useRef } from "react";
import { motion } from "motion/react";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
import { voiceAI } from "../data/content";

/**
 * VoiceAI — ZettaJoule-style scroll-scrubbed ASSEMBLY reveal.
 *
 * The section pins and scroll progress drives an image SEQUENCE on a <canvas>:
 * a scatter of glossy voice-waveform bars (disassembled) glides inward and
 * assembles into a crisp voice-spectrum. The camera never moves — only the bars
 * come together — exactly like the ZettaJoule reactor exploded-view, applied to
 * an AI voice agent. Pre-decoded JPG frames (not <video>.currentTime) → buttery
 * scrub (the Apple / on.energy technique). Flanking RTL editorial columns + a
 * spec block sit in the side margins, ZettaJoule-style.
 *
 * Frames: public/voice/frame-0001.jpg … (Kling keyframe assembly, disassembled
 * → assembled). Like ScrollReveal, the scrub runs even under reduced-motion by
 * design — it's the section's core content and the client tests on a
 * reduced-motion machine. The overlay text "whisper" slide-ins run ungated for
 * the same reason (see `slide` below).
 */
const FRAME_COUNT = 121;
const framePath = (i: number) => `/voice/frame-${String(i).padStart(4, "0")}.jpg`;
// Fallback shown before the frames decode; cover-fill then paints the render's
// own background edge-to-edge, so there's no seam against the page.
const CANVAS_BG = "#fbfcfe";

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

export function VoiceAI() {
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

      // COVER-fill the current frame so the render's own background reaches
      // every edge of the section — no letterbox, so nothing to mismatch
      // against the page. The waveform is centered, so cover crops only the
      // empty margin, not the wave.
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

      // Scroll → frame index. Pin the section and scrub through the assembly.
      const anim = gsap.to(state, {
        frame: FRAME_COUNT - 1,
        ease: "none",
        onUpdate: render,
      });
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=220%",
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

  // Slow "whisper" slide-in: each cluster drifts in from its OWN side as the
  // section scrolls into view — right column from the right (+x), left column
  // from the left (−x). Ungated by request: the client reviews on a
  // reduced-motion machine and wants this reveal, matching the scroll-scrub.
  const slide = (fromX: number, delay: number) => ({
    initial: { opacity: 0, x: fromX },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-10%" },
    transition: { duration: 1.3, ease: [0.16, 1, 0.3, 1] as const, delay },
  });

  return (
    <section ref={sectionRef} id="voice" className="bg-ink">
      <div
        className="relative h-svh overflow-hidden text-fg"
        style={{ backgroundColor: CANVAS_BG }}
      >
        {/* scroll-scrubbed assembly */}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />

        {/* bottom scrim so stacked mobile text stays legible over the waveform */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 lg:hidden"
          style={{ background: `linear-gradient(to top, ${CANVAS_BG}, ${CANVAS_BG}cc 30%, transparent)` }}
        />

        <div className="container-x relative z-10 flex h-full flex-col">
          {/* top row: brand pill (start / right) + spec block (end / left) */}
          <div className="flex items-start justify-between pt-24 sm:pt-28">
            <motion.span
              {...slide(60, 0)}
              className="eyebrow inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3.5 py-1.5 text-brand backdrop-blur"
            >
              <span className="size-1.5 rounded-full bg-brand" />
              {voiceAI.eyebrow}
            </motion.span>

            <motion.dl {...slide(-60, 0.08)} className="hidden text-end lg:block">
              {voiceAI.specs.map((s) => (
                <div key={s.k} className="flex items-baseline justify-end gap-3 py-1">
                  <dt className="eyebrow text-faint">{s.k}</dt>
                  <dd className="nums text-sm font-semibold text-fg">{s.v}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* body: flanks the waveform on lg; stacks at the bottom on mobile */}
          <div className="flex flex-1 flex-col justify-end gap-10 pb-16 lg:grid lg:grid-cols-2 lg:items-center lg:pb-24">
            {/* start / right — statement + CTA */}
            <div className="max-w-sm lg:max-w-xs">
              <motion.h2 {...slide(60, 0.05)} className="text-balance text-statement text-fg">
                {voiceAI.title}
              </motion.h2>
              <motion.div {...slide(60, 0.16)} className="mt-8">
                <a
                  href={voiceAI.cta.href}
                  className="inline-flex items-center rounded-xl bg-brand px-5 py-3 text-[15px] font-semibold text-on-ink shadow-[0_12px_30px_-12px_rgba(46,91,255,0.65)] transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbfcfe]"
                >
                  {voiceAI.cta.label}
                </a>
              </motion.div>
            </div>

            {/* end / left — supporting paragraph + points (desktop only).
                RTL: Hebrew stays right-aligned (start); the check sits at the
                start (right) of each item, text flowing right-to-left. */}
            <div className="hidden max-w-xs justify-self-end lg:block">
              <motion.p {...slide(-60, 0.1)} className="text-lead text-muted">
                {voiceAI.body}
              </motion.p>
              <motion.ul {...slide(-60, 0.2)} className="mt-6 flex flex-col gap-3">
                {voiceAI.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-base text-fg/85">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand/12 text-brand">
                      <CheckIcon className="size-3.5" />
                    </span>
                    {p}
                  </li>
                ))}
              </motion.ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
