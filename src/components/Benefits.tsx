import { benefits } from "../data/content";

/**
 * Benefits — the sticky-header + stat-cards band (ref: "BENEFITS · Smart.
 * Secure. Scalable."). A start-side header column (eyebrow → two-line display
 * headline) that stays `position: sticky` while a 50%-wide column of wide stat
 * cards scrolls past it. The FIRST card is inverted (white fill, ink text);
 * the rest are frosted glass.
 *
 * Ref spec (clone CSS): section pt 60px / pb 200px (100px mobile), content
 * max-width 1440px · header sticky top 120px, width 40%, eyebrow↔headline gap
 * 40px, headline max-w 600px (centered stack ≤480) · cards col 50%, gap 24px ·
 * card: 250px tall (200 tablet / 160 mobile), 32px padding (20px mobile), 8px
 * radius, stat top / label bottom via justify-between; card 1 `#ffffff` fill,
 * cards 2–4 `#ffffff0f` + backdrop-blur(30px) · stat ~5dvw medium (56/40 caps),
 * label 18–20px light. Like the ref, the band is TRANSPARENT over the site's
 * fixed WebGL scene (<SceneBackdrop>) — the fluted drapes visible here are the
 * live sequence at this scroll depth.
 *
 * Static section — no scroll reveal and no counter animation (the ref has
 * neither; sticky is pure CSS), matching every band since Solutions.
 */

export function Benefits() {
  return (
    // Transparent over the page-wide fixed scene (ref behavior).
    <section id="benefits" className="relative pt-14 pb-24 sm:pt-16 sm:pb-48">
      <div className="container-x relative z-[1] flex flex-col gap-12 md:flex-row md:items-start md:justify-between md:gap-6">
        {/* Header column — sticks while the stat cards scroll past. */}
        <div className="flex flex-col items-center gap-6 text-center sm:gap-10 md:sticky md:top-[120px] md:w-[40%] md:items-start md:text-start">
          <p className="eyebrow text-fg/80">{benefits.eyebrow}</p>
          <h2 className="max-w-[600px] font-medium leading-[1.15] tracking-[-0.03em] text-fg text-[clamp(2.25rem,3.6vw,3rem)]">
            {benefits.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>

        {/* Stat cards — value top, label bottom; card 1 inverted white. */}
        <div className="flex w-full flex-col gap-6 md:w-1/2">
          {benefits.stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex h-[160px] flex-col items-start justify-between rounded-[8px] p-5 sm:h-[250px] sm:p-8 ${
                i === 0
                  ? "bg-white text-ink"
                  : "bg-white/[0.06] text-fg ring-1 ring-white/[0.06] backdrop-blur-[30px]"
              }`}
            >
              {/* dir=ltr so +/− signs render before the number in RTL flow. */}
              <p
                dir="ltr"
                className="font-medium leading-none tracking-[-0.03em] text-[clamp(2.5rem,5vw,3.5rem)]"
              >
                {stat.value}
              </p>
              <p
                className={`text-[18px] font-light leading-snug tracking-[-0.02em] sm:text-[20px] ${
                  i === 0 ? "text-ink/80" : "text-fg/85"
                }`}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
