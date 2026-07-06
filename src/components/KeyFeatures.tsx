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
 * Row art = client-supplied renders (webp copies in /public/key-features,
 * mapped to rows 01–03 in numerical order; raw PNGs parked in gitignored
 * /assets-src/key-features). The renders had 01/02/03 baked into their top
 * corner — that strip is cropped out of the assets so the component's own
 * number overlay (which mirrors correctly in RTL and survives object-cover
 * at every viewport) stays the single source of numbering. Decorative art —
 * alt="" + lazy. Static section — no scroll reveal, matching
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
                <img
                  src={item.img}
                  alt=""
                  loading="lazy"
                  width={2048}
                  height={1374}
                  className="h-full w-full rounded-[8px] bg-[#04081f] object-cover"
                />
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
                {/* Only row 2 (i === 1) gets the ref's full-column block button;
                    rows 1 & 3 keep the compact content-width pill. */}
                <a
                  href={keyFeatures.cta.href}
                  className={`group mt-7 h-12 items-center gap-3 rounded-[8px] bg-black text-[16px] font-light tracking-[-0.03em] text-fg ring-1 ring-white/10 transition-colors hover:bg-white/[0.06] ${
                    i === 1 ? "flex w-full justify-center px-6" : "inline-flex ps-6 pe-2"
                  }`}
                >
                  {keyFeatures.cta.label}
                  <span className="grid size-8 place-items-center rounded-full bg-on-ink text-ink transition-transform duration-200 group-hover:-translate-x-0.5">
                    <CtaArrow className="size-4" />
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
