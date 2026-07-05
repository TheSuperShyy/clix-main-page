import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { testimonials } from "../data/content";

/**
 * Testimonials — centered header + four client VIDEO cards (real phone-shot
 * clips, 9:16). This replaces the ref's three text-quote columns: the client
 * supplied actual video testimonials, which read far stronger than quotes.
 *
 * Card behavior: poster frame + frosted play button at rest; tap anywhere on
 * the card to play WITH sound (it's a testimonial — muted would be pointless),
 * tap again to pause. Only ONE video plays at a time — starting a card pauses
 * whichever was playing. `preload="metadata"` keeps the initial page load
 * light (web copies are ~2–3 MB each; posters are separate jpgs).
 *
 * Name + role ride a bottom scrim on each card. The play/pause affordance is
 * a real <button> stretched over the card (keyboard + SR reachable, labeled
 * per person). Playback starts only on user gesture — nothing autoplays, so
 * no reduced-motion concern here; the framer-motion fades are sub-300ms.
 */

/** Play triangle — playback icons stay LTR even in RTL UIs (platform rule). */
function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path d="M7 5h3.5v14H7V5Zm6.5 0H17v14h-3.5V5Z" fill="currentColor" />
    </svg>
  );
}

/** Quiet full-bleed base — flat navy with one soft center glow + vignette. */
function TestimonialsBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* Flat continuation of the Benefits band's final color. */}
      <div className="absolute inset-0 bg-[#03021b]" />
      {/* Faint aurora behind the headline. */}
      <div
        className="absolute inset-x-0 top-0 h-[70%]"
        style={{
          background:
            "radial-gradient(45% 55% at 50% 30%, rgba(90,140,220,0.14), transparent 70%)",
        }}
      />
      {/* Edge vignette. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 45%, transparent 55%, rgba(2,3,16,0.5) 100%)",
        }}
      />
    </div>
  );
}

export function Testimonials() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [playing, setPlaying] = useState<number | null>(null);

  /** Play card i (pausing any other) or pause it if it's the active one. */
  const toggle = (i: number) => {
    const target = videoRefs.current[i];
    if (!target) return;

    if (playing === i) {
      target.pause();
      setPlaying(null);
      return;
    }
    if (playing !== null) videoRefs.current[playing]?.pause();
    void target.play();
    setPlaying(i);
  };

  return (
    <section id="testimonials" className="relative pt-24 pb-14 sm:pt-48 sm:pb-16">
      <TestimonialsBackdrop />

      <div className="container-x relative z-[1] flex flex-col items-center gap-16 sm:gap-24">
        {/* Centered header — eyebrow over the display headline. */}
        <div className="flex flex-col items-center gap-6 text-center sm:gap-10">
          <p className="eyebrow text-fg/80">{testimonials.eyebrow}</p>
          <h2 className="max-w-[700px] font-medium leading-[1.15] tracking-[-0.03em] text-fg text-[clamp(2.25rem,3.6vw,3rem)]">
            {testimonials.title}
          </h2>
        </div>

        {/* Video cards — 9:16 client clips, 2-up on mobile, 4-up on desktop. */}
        <div className="grid w-full grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {testimonials.videos.map((t, i) => {
            const isPlaying = playing === i;
            return (
              <figure
                key={t.name}
                className="group relative aspect-[9/16] overflow-hidden rounded-[12px] bg-white/[0.04] ring-1 ring-white/10"
              >
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  src={t.src}
                  poster={t.poster}
                  preload="metadata"
                  playsInline
                  onEnded={() => setPlaying((p) => (p === i ? null : p))}
                  onPause={() => setPlaying((p) => (p === i ? null : p))}
                  className="size-full object-cover"
                />

                {/* Bottom scrim so the caption stays readable over any frame. */}
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 via-black/35 to-transparent transition-opacity duration-300 ${
                    isPlaying ? "opacity-60" : "opacity-100"
                  }`}
                />

                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 sm:p-5">
                  <span className="text-[15px] font-medium leading-tight text-fg sm:text-[17px]">
                    {t.name}
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-fg/60 sm:text-[11px]">
                    {t.role}
                  </span>
                </figcaption>

                {/* Full-card play/pause control — the whole card is the tap
                    target; the visible circle is just the affordance. */}
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-label={`${isPlaying ? testimonials.pauseLabel : testimonials.playLabel} ${t.name}`}
                  className="absolute inset-0 grid cursor-pointer place-items-center outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-inset"
                >
                  <AnimatePresence initial={false}>
                    {!isPlaying && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="grid size-14 place-items-center rounded-full bg-white/15 text-fg ring-1 ring-white/25 backdrop-blur-[20px] transition-transform duration-200 group-hover:scale-105 sm:size-16"
                      >
                        <PlayIcon className="size-6 translate-x-[1px] sm:size-7" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {/* Pause affordance only surfaces on hover/focus while playing —
                      keeps the video unobstructed. */}
                  {isPlaying && (
                    <span className="grid size-14 place-items-center rounded-full bg-black/40 text-fg opacity-0 ring-1 ring-white/20 backdrop-blur-[12px] transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 sm:size-16">
                      <PauseIcon className="size-6 sm:size-7" />
                    </span>
                  )}
                </button>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
