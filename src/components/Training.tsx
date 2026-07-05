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

/** Quiet full-bleed base — flat navy continuing the Testimonials field. */
function TrainingBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#03021b]" />
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

        {/* Stage clip — ambient muted loop with a live badge; caption rides
            under the card (ref format: "ON STAGE" + "RECENT · Q3 KEYNOTE"). */}
        <figure className="flex w-full flex-col gap-3">
          <div className="relative overflow-hidden rounded-[12px] bg-white/[0.04] ring-1 ring-white/10">
            <video
              // React can skip writing the `muted` ATTRIBUTE (it only sets the
              // property), and browsers block autoplay unless the element is
              // muted when playback starts — force both, then kick play()
              // ourselves (autoplay attr alone silently fails in that state).
              ref={(el) => {
                if (!el) return;
                el.muted = true;
                void el.play().catch(() => {});
              }}
              src={training.video.src}
              poster={training.video.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label={training.video.ariaLabel}
              className="aspect-video w-full object-cover"
            />
            {/* Live-style badge — Latin small caps, so pinned LTR. */}
            <span
              dir="ltr"
              className="absolute start-3 top-3 flex items-center gap-2 rounded-full bg-black/45 px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.3em] text-fg ring-1 ring-white/15 backdrop-blur-[12px] sm:text-[11px]"
            >
              {training.video.badge}
              <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-sky" />
            </span>
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
