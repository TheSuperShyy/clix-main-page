import { keyFeatures } from "../data/content";

/**
 * KeyFeatures — the numbered 01–03 sequence (ref: "ABOUT OUR SOLUTIONS · Key
 * Features"): a two-column section header (eyebrow + display title vs. short
 * subcopy), then three tall alternating rows — a text column (eyebrow →
 * statement headline → body → small dark CTA) beside a large rounded image
 * with the row number pinned to its top corner.
 *
 * Ref spec (clone CSS): section bg `#03021b`, pt 60px / pb 200px (100px
 * mobile) · rows 70vh desktop / 50vh tablet, 24px padding, 12px radius ·
 * image full-height, object-cover, 8px radius, number at top/start 24px ·
 * text col: 12px gap, copy max-width 500px · CTA 48px tall, 8px radius,
 * black fill, 20px arrow, 28px top margin. Rows alternate text/image sides;
 * on mobile every row stacks image-first.
 *
 * The row art is a PROCEDURAL placeholder (layered CSS gradients in the hero
 * scene's navy/sky language — no reference assets); swap each <KeyFeatureArt>
 * for a real render/webp later. Static section — no scroll reveal, matching
 * Solutions/Partners/Features.
 */

/** Small forward arrow for the row CTA — points to the RTL "forward" (left). */
function CtaArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M14 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Placeholder row art — deep-space compositions from CSS gradients, matching
    the hero canvas palette. Three framings: a particle-wave horizon with a
    small crescent moon, a large rim-lit planet, and a glowing energy field. */
function KeyFeatureArt({ variant }: { variant: "wave" | "planet" | "field" }) {
  const body =
    "radial-gradient(circle at 38% 30%, #0d1846 0%, #060d28 55%, #03071c 100%)";
  const sphere = (rim: string) => ({ backgroundImage: `${rim}, ${body}` });

  return (
    <div
      aria-hidden
      className="relative h-full w-full overflow-hidden rounded-[8px] bg-[#04081f]"
    >
      {/* Ambient indigo wash. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 90% at 50% 105%, rgba(30,42,110,0.45), transparent 65%)",
        }}
      />

      {variant === "wave" && (
        <>
          {/* Luminous wave band sweeping across the lower half. */}
          <div
            className="absolute inset-x-[-20%] bottom-[-10%] h-[70%] -rotate-6"
            style={{
              background:
                "radial-gradient(70% 45% at 50% 55%, rgba(90,140,220,0.5), rgba(50,80,170,0.18) 55%, transparent 75%)",
              filter: "blur(2px)",
            }}
          />
          <div
            className="absolute inset-x-[-10%] bottom-[6%] h-[38%] -rotate-3"
            style={{
              background:
                "radial-gradient(60% 40% at 45% 50%, rgba(150,205,240,0.4), transparent 70%)",
            }}
          />
          {/* Small crescent moon in the upper corner. */}
          <div
            className="absolute end-[8%] top-[10%] aspect-square w-[18%] rounded-full"
            style={sphere(
              "radial-gradient(70% 70% at 80% 35%, rgba(150,205,240,0.65), rgba(110,170,225,0.15) 45%, transparent 68%)",
            )}
          />
          {/* Scattered particle specks. */}
          <span className="absolute start-[18%] top-[38%] size-1 rounded-full bg-sky/50" />
          <span className="absolute start-[42%] top-[30%] size-0.5 rounded-full bg-sky/40" />
          <span className="absolute end-[30%] top-[52%] size-1 rounded-full bg-mint/40" />
        </>
      )}

      {variant === "planet" && (
        <>
          {/* Large planet rising from the end edge, rim-lit from above. */}
          <div
            className="absolute -end-[25%] top-[12%] aspect-square w-[90%] rounded-full"
            style={sphere(
              "radial-gradient(80% 55% at 30% 2%, rgba(150,205,240,0.55), rgba(110,170,225,0.12) 45%, transparent 70%)",
            )}
          />
          {/* Wide orbital ring crossing behind it. */}
          <div className="absolute -end-[45%] top-[2%] aspect-square w-[130%] rounded-full border border-sky/12" />
          <span className="absolute start-[14%] top-[24%] size-1 rounded-full bg-sky/50" />
          <span className="absolute start-[30%] bottom-[20%] size-1.5 rounded-full bg-gold/30" />
        </>
      )}

      {variant === "field" && (
        <>
          {/* Rising energy field — layered glow arcs from the bottom. */}
          <div
            className="absolute start-1/2 top-[68%] aspect-square w-[150%] -translate-x-1/2 rounded-full rtl:translate-x-1/2"
            style={sphere(
              "radial-gradient(85% 40% at 50% -4%, rgba(150,205,240,0.5), rgba(110,170,225,0.1) 48%, transparent 72%)",
            )}
          />
          <div className="absolute start-1/2 top-[58%] aspect-square w-[165%] -translate-x-1/2 rounded-full border border-sky/15 rtl:translate-x-1/2" />
          <div className="absolute start-1/2 top-[48%] aspect-square w-[180%] -translate-x-1/2 rounded-full border border-sky/[0.07] rtl:translate-x-1/2" />
          <span className="absolute start-[24%] top-[22%] size-1 rounded-full bg-sky/50" />
          <span className="absolute end-[20%] top-[34%] size-1 rounded-full bg-mint/40" />
        </>
      )}

      {/* Corner vignette so every framing sinks into the card. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 40%, transparent 45%, rgba(2,4,14,0.55) 100%)",
        }}
      />
    </div>
  );
}

export function KeyFeatures() {
  return (
    <section id="key-features" className="relative bg-[#03021b] pt-6 pb-24 sm:pt-16 sm:pb-48">
      <div className="container-x">
        {/* Two-column header (ref: eyebrow + display title vs. end-aligned subcopy). */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="flex flex-col gap-6 sm:gap-9">
            <p className="eyebrow text-fg/80">{keyFeatures.eyebrow}</p>
            <h2 className="font-medium leading-[1.08] tracking-[-0.03em] text-fg text-[clamp(2.5rem,5vw,4.5rem)]">
              {keyFeatures.title}
            </h2>
          </div>
          <p className="max-w-md font-light leading-snug tracking-[-0.02em] text-fg/85 text-[clamp(1.05rem,1.4vw,1.25rem)] md:text-end">
            {keyFeatures.subcopy}
          </p>
        </div>

        {/* Numbered rows — text beside a tall image, sides alternating per row;
            mobile stacks image-first (ref behavior). */}
        <div className="mt-14 flex flex-col gap-5 sm:mt-24 sm:gap-12">
          {keyFeatures.items.map((item, i) => (
            <article
              key={item.number}
              className={`flex flex-col gap-6 rounded-[12px] md:h-[70vh] md:min-h-[520px] md:flex-row md:items-stretch md:gap-6 ${
                i % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Image half — number badge pinned to the top/start corner. */}
              <div className="relative h-[300px] w-full sm:h-[46vh] md:h-full md:w-1/2">
                <KeyFeatureArt variant={item.art} />
                <p
                  aria-hidden
                  className="absolute start-6 top-6 z-[2] text-[16px] text-fg/70"
                >
                  {item.number}
                </p>
              </div>

              {/* Text half — vertically centered against the image. */}
              <div className="flex w-full flex-col items-start justify-center gap-3 md:w-1/2 md:p-12">
                <div className="flex max-w-[500px] flex-col gap-6">
                  <p className="eyebrow text-fg/80">{item.eyebrow}</p>
                  <h3 className="font-medium leading-[1.12] tracking-[-0.03em] text-fg text-[clamp(1.9rem,3.2vw,3.25rem)]">
                    {item.title}
                  </h3>
                </div>
                <p className="max-w-[500px] text-[16px] leading-relaxed text-fg/70 sm:text-[17px]">
                  {item.body}
                </p>
                <a
                  href={keyFeatures.cta.href}
                  className="mt-7 inline-flex h-12 items-center gap-2 rounded-[8px] bg-black ps-6 pe-4 text-[16px] font-light tracking-[-0.03em] text-fg ring-1 ring-white/10 transition-colors hover:bg-white/[0.06]"
                >
                  {keyFeatures.cta.label}
                  <CtaArrow className="size-5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
