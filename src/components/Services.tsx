import { services } from "../data/content";

/**
 * Services — the sticky-header + glass-cards band (ref: "SERVICES · Tailored
 * for every financial need."). A start-side header column (eyebrow → headline
 * → subcopy) that stays `position: sticky` while a 50%-wide column of tall
 * frosted-glass cards scrolls past it. Each card: title pinned top, body
 * pinned bottom, decorative art behind.
 *
 * Ref spec (clone CSS): section pt 200px / pb 60px (100px mobile), content
 * max-width 1440px, header sticky top 120px (eyebrow↔title gap 40px, title↔
 * subcopy 12px; headline max-w 400px, subcopy max-w 600px) · cards col 50%,
 * gap 24px · card: `#ffffff0f` fill + backdrop-blur(30px), 8px radius, 32px
 * padding (20px mobile), heights 400/450/300/400 (300/250 mobile), title top /
 * body bottom via justify-between. Like the ref, the band is TRANSPARENT over
 * the site's fixed WebGL scene (<SceneBackdrop>) — the arc-slicing beat STARTS
 * (seq 0.235 anchor) exactly as this section lands, so the ribbed wave visible
 * here is the live sequence. Card art is a PLACEHOLDER — swap later.
 *
 * Static section — no scroll reveal (the ref has none; sticky is pure CSS),
 * matching Solutions/Partners/Features/KeyFeatures.
 */

/** Decorative in-card art (behind the text, ref: per-card 3D vectors).
    Procedural placeholders in the same palette; the ref's 3rd card is bare,
    so `glow` stays minimal. */
function ServiceCardArt({ variant }: { variant: "tiles" | "orbit" | "glow" | "waves" }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden rounded-[8px]">
      {variant === "tiles" && (
        <div className="absolute -end-10 top-1/2 grid -translate-y-1/2 grid-cols-3 gap-3 opacity-70 max-sm:scale-75">
          {Array.from({ length: 9 }, (_, i) => (
            <span
              key={i}
              className={`size-16 rounded-[14px] border sm:size-20 ${
                i === 4
                  ? "border-sky/40 bg-sky/15 shadow-[0_0_40px_rgba(170,212,246,0.25)]"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            />
          ))}
        </div>
      )}

      {variant === "orbit" && (
        <>
          <div className="absolute -end-[12%] -bottom-[45%] aspect-square w-[75%] rounded-full border border-sky/15" />
          <div className="absolute -end-[20%] -bottom-[55%] aspect-square w-[95%] rounded-full border border-sky/[0.08]" />
          <div
            className="absolute end-[16%] bottom-[18%] size-3 rounded-full bg-sky/70"
            style={{ boxShadow: "0 0 24px rgba(170,212,246,0.6)" }}
          />
        </>
      )}

      {variant === "glow" && (
        <div
          className="absolute -end-[10%] -top-[30%] h-[120%] w-[60%]"
          style={{
            background:
              "radial-gradient(60% 60% at 60% 30%, rgba(90,140,220,0.22), transparent 70%)",
          }}
        />
      )}

      {variant === "waves" && (
        <>
          <div
            className="absolute inset-x-[-15%] bottom-[-20%] h-[70%] -rotate-3"
            style={{
              background:
                "radial-gradient(60% 45% at 50% 55%, rgba(90,140,220,0.35), transparent 72%)",
              filter: "blur(2px)",
            }}
          />
          <div
            className="absolute inset-x-[-5%] bottom-[-6%] h-[40%] rotate-2"
            style={{
              background:
                "radial-gradient(55% 40% at 45% 50%, rgba(150,205,240,0.28), transparent 70%)",
            }}
          />
        </>
      )}
    </div>
  );
}

// Per-card heights, ref rhythm 400/450/300/400 (shorter on mobile).
const CARD_SIZES = [
  "h-[300px] md:h-[400px]",
  "h-[300px] md:h-[450px]",
  "h-[250px] md:h-[300px]",
  "h-[280px] md:h-[400px]",
] as const;

export function Services() {
  return (
    // Transparent over the page-wide fixed scene (ref behavior) — the
    // arc-slicing beat is anchored to this section's top.
    <section id="services" className="relative pt-24 pb-14 sm:pt-48 sm:pb-16">
      <div className="container-x relative z-[1] flex flex-col gap-12 md:flex-row md:items-start md:justify-between md:gap-6">
        {/* Header column — sticks while the cards scroll past (ref: sticky top 120px). */}
        <div className="flex flex-col items-center gap-6 text-center sm:gap-10 md:sticky md:top-[120px] md:w-[45%] md:items-start md:text-start">
          <p className="eyebrow text-fg/80">{services.eyebrow}</p>
          <div className="flex flex-col items-center gap-3 md:items-start">
            <h2 className="max-w-[400px] font-medium leading-[1.1] tracking-[-0.03em] text-fg text-[clamp(2.25rem,3.6vw,3rem)]">
              {services.title}
            </h2>
            <p className="max-w-[600px] text-[18px] font-light leading-snug tracking-[-0.03em] text-fg/85 sm:text-[20px]">
              {services.subcopy}
            </p>
          </div>
        </div>

        {/* Cards column — tall frosted-glass panels, title top / body bottom. */}
        <div className="flex w-full flex-col gap-6 md:w-1/2">
          {services.items.map((item, i) => (
            <article
              key={item.title}
              className={`relative flex flex-col justify-between gap-6 overflow-hidden rounded-[8px] bg-white/[0.06] p-5 ring-1 ring-white/[0.06] backdrop-blur-[30px] sm:p-8 ${CARD_SIZES[i]}`}
            >
              <ServiceCardArt variant={item.art} />
              <h3 className="relative z-[1] max-w-[75%] font-medium leading-[1.15] tracking-[-0.03em] text-fg text-[clamp(1.5rem,2.5vw,2.25rem)]">
                {item.title}
              </h3>
              <p className="relative z-[1] max-w-[520px] text-[16px] font-light leading-snug tracking-[-0.02em] text-fg/85 sm:text-[18px]">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
