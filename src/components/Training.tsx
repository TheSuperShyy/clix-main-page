import { useEffect, useRef } from "react";
import { training } from "../data/content";

/**
 * Training — lectures & workshops band, REPLACING the placeholder Pricing
 * band (client call). Two-column layout lifted from the old site's lectures
 * section, restyled onto the current dark palette: copy block at the inline
 * start (right in RTL — eyebrow → display headline → body → CTA) opposite a
 * 16:9 stage-clip card with an "ON STAGE" live badge and a small-caps caption
 * riding under it.
 *
 * The clip is a 6s silent preview (1.2 MB) — it autoplays muted on loop as
 * ambient footage, same as the reference's scene media (standing client
 * exception for ambient motion; nothing here conveys information by motion).
 * Static band — no scroll reveal, like every band since Solutions.
 */

/** Forward arrow for the CTA — points to the RTL "forward" (left). */
function CtaArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M14 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * StageClip — the ambient muted loop, gated to the viewport. `preload="none"`
 * keeps the 1.2 MB clip off the initial load (the poster shows meanwhile); an
 * IntersectionObserver starts playback only when the card scrolls in and pauses
 * it when it leaves, so the video never decodes off-screen (CPU/battery win).
 */
function StageClip() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={training.video.src}
      poster={training.video.poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={training.video.ariaLabel}
      className="aspect-video w-full object-cover"
    />
  );
}

/** Quiet full-bleed base — flat navy continuing the Testimonials field. */
function TrainingBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#0d0d0d]" />
      {/* Faint glow behind the video card (inline-end half). */}
      <div
        className="absolute inset-y-0 end-0 w-[60%]"
        style={{
          background:
            "radial-gradient(45% 55% at 50% 50%, rgba(90,140,220,0.10), transparent 70%)",
        }}
      />
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

export function Training() {
  return (
    <section id="training" className="relative pt-14 pb-24 sm:pt-16 sm:pb-48">
      <TrainingBackdrop />

      <div className="container-x relative z-[1] grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Copy block — first child sits at the inline start (right in RTL),
            matching the reference screenshot. */}
        <div className="flex flex-col items-start gap-6">
          <p className="eyebrow text-fg/80">{training.eyebrow}</p>
          <h2 className="max-w-[560px] font-medium leading-[1.12] tracking-[-0.03em] text-fg text-[clamp(2.5rem,4.2vw,3.5rem)]">
            {training.title}
          </h2>
          <p className="max-w-[480px] text-[16px] font-light leading-relaxed tracking-[-0.02em] text-fg/75 sm:text-[18px]">
            {training.body}
          </p>
          <a
            href={training.cta.href}
            className="mt-2 flex h-12 items-center justify-center gap-2 rounded-[8px] bg-black ps-6 pe-4 text-[16px] font-light tracking-[-0.03em] text-fg ring-1 ring-white/10 transition-colors hover:bg-ink-2"
          >
            {training.cta.label}
            <CtaArrow className="size-5" />
          </a>
        </div>

        {/* Stage clip — ambient muted loop; caption rides under the card
            (the "ON STAGE" live badge was removed — user call, 2026-07-08). */}
        <figure className="flex w-full flex-col gap-3">
          <div className="relative overflow-hidden rounded-[12px] bg-white/[0.04] ring-1 ring-white/10">
            <StageClip />
          </div>
          <figcaption
            dir="ltr"
            className="text-center text-[10px] font-medium uppercase tracking-[0.3em] text-fg/45 sm:text-[11px]"
          >
            {training.video.caption}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
