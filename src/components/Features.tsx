import { features } from "../data/content";

/**
 * Features — clone of the reference's FEATURES section: a solid dark band
 * (the first non-floating section after the hero's scene region) with a
 * centered eyebrow → big statement headline → short subcopy header, then a
 * row of three glass cards, each holding a rendered globe image above a
 * title + one-line description.
 *
 * Ref card spec (clone CSS): `#ffffff0f` fill · 8px radius · 20px padding ·
 * 24px gap · image 400px tall (200px mobile), 8px radius, object-cover ·
 * 24px title / 16px desc, 8px apart. Grid gap 24px.
 *
 * Card art = client-supplied globe renders (webp copies in /public/features,
 * mapped to the cards in numerical order; raw PNGs parked in gitignored
 * /assets-src/features). Decorative — the title/desc carry the meaning, so
 * the images are alt="" + lazy. Static section — no scroll reveal, matching
 * Solutions/Partners.
 */

export function Features() {
  return (
    <section id="features" className="relative bg-[#0d0d0d] py-24 sm:py-32">
      <div className="container-x">
        {/* Centered header (ref: eyebrow → statement headline → light subcopy). */}
        <p className="eyebrow text-center text-fg/80">{features.eyebrow}</p>

        <h2
          aria-label={features.title}
          className="mx-auto mt-8 max-w-3xl text-center font-medium leading-[1.12] tracking-[-0.03em] text-fg text-[clamp(2rem,3.6vw,3.5rem)] sm:mt-10"
        >
          {features.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-center font-light leading-snug tracking-[-0.02em] text-fg/85 text-[clamp(1.05rem,1.4vw,1.25rem)]">
          {features.subcopy}
        </p>

        {/* Three glass cards — image → title → one-liner (ref spec). */}
        <div className="mt-12 grid gap-5 sm:mt-16 sm:gap-6 md:grid-cols-3">
          {features.items.map((item) => (
            <article
              key={item.title}
              className="flex flex-col gap-6 rounded-[8px] bg-white/[0.06] p-5"
            >
              <img
                src={item.img}
                alt=""
                loading="lazy"
                width={1024}
                height={1024}
                className="h-[220px] w-full rounded-[8px] bg-[#04081f] object-cover sm:h-[400px]"
              />
              <div className="flex flex-col gap-2 pb-1">
                <h3 className="text-[1.4rem] text-fg">{item.title}</h3>
                <p className="text-[16px] text-fg/70">{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
