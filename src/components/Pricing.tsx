import { pricing } from "../data/content";

/**
 * Pricing — centered header + 3 tier cards (ref: "PRICING · Plans for every
 * scale."). Side tiers sit flush on the section field (their fill is the
 * section color — no visible chrome, just content + a black CTA); the middle
 * tier is the FEATURED plan: a raised pure-black card, taller than its
 * neighbors (the ref row is `align-items:center`, so it protrudes both ways)
 * with an inverted white CTA.
 *
 * Ref spec (clone CSS): section pt 60px / pb 200px (100/100 ≤992), flat
 * `#0d0d0d` base — the same color Testimonials sits on, so the bands keep
 * chaining · centered header, gap 40px · cards row gap 24px, `align-items:
 * center`, max-w 1440, p 40 · card p 32 (20 mobile), inner gap 24px, radius
 * 8px; side fills `#0d0d0d`, featured fill `#000` · per card: 28px medium
 * title → 20px light desc → 1px hairline → display-size price + 32px "/mo"
 * suffix → feature rows (gap 16, 12px sparkle icons — bright on the featured
 * card, dim on the sides) → 48px full-width `rounded-[8px]` CTA (black on
 * side cards / white on the featured one) with a 20px forward arrow. ≤992 the
 * row wraps to a grid; ≤480 it stacks.
 *
 * ⚠️ Tier copy + prices are PLACEHOLDER (see `content.ts`) — confirm with the
 * client. Static section — no reveal (the ref has none), like every band
 * since Solutions.
 */

/** Small 4-point sparkle — the ref's 12px feature-bullet icon. */
function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden className={className}>
      <path
        d="M6 0c.5 3.2 2.8 5.5 6 6-3.2.5-5.5 2.8-6 6-.5-3.2-2.8-5.5-6-6 3.2-.5 5.5-2.8 6-6Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Forward arrow for the tier CTAs — points to the RTL "forward" (left). */
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
function PricingBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#0d0d0d]" />
      {/* Faint glow behind the featured middle card. */}
      <div
        className="absolute inset-x-0 top-[20%] h-[60%]"
        style={{
          background:
            "radial-gradient(35% 50% at 50% 50%, rgba(90,140,220,0.10), transparent 70%)",
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

export function Pricing() {
  return (
    <section id="pricing" className="relative pt-14 pb-24 sm:pt-16 sm:pb-48">
      <PricingBackdrop />

      <div className="container-x relative z-[1] flex flex-col items-center gap-16 sm:gap-24">
        {/* Centered header — eyebrow over the display headline. */}
        <div className="flex flex-col items-center gap-6 text-center sm:gap-10">
          <p className="eyebrow text-fg/80">{pricing.eyebrow}</p>
          <h2 className="font-medium leading-[1.15] tracking-[-0.03em] text-fg text-[clamp(2.25rem,3.6vw,3rem)]">
            {pricing.title}
          </h2>
        </div>

        {/* Tier cards — row is center-aligned so the taller featured card
            protrudes above and below its neighbors (ref behavior). */}
        <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:items-center">
          {pricing.tiers.map((tier) => (
            <article
              key={tier.name}
              className={`flex flex-col gap-6 rounded-[8px] p-5 sm:p-8 ${
                tier.featured ? "bg-black sm:py-14" : "bg-[#0d0d0d]"
              }`}
            >
              {/* Plan name + who it's for. */}
              <div className="flex flex-col gap-2">
                <h3 className="text-[24px] font-medium leading-tight tracking-[-0.02em] text-fg sm:text-[28px]">
                  {tier.name}
                </h3>
                <p className="text-[16px] font-light leading-snug tracking-[-0.02em] text-fg/80 sm:text-[18px]">
                  {tier.desc}
                </p>
              </div>

              <div aria-hidden className="h-px w-full bg-white/20" />

              {/* Price — digits forced LTR so ₪ + the amount render as one
                  number run, with the Hebrew /month suffix beside it. */}
              <p className="flex items-baseline gap-1 text-fg">
                <span
                  dir="ltr"
                  className="font-medium leading-none tracking-[-0.03em] text-[clamp(2.5rem,3.8vw,3.5rem)]"
                >
                  {tier.price}
                </span>
                <span className="text-[20px] font-light tracking-[-0.02em] sm:text-[26px]">
                  {pricing.perMonth}
                </span>
              </p>

              {/* Features — sparkle bullets, bright only on the featured plan. */}
              <ul className="flex flex-col gap-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <Sparkle
                      className={`size-3 shrink-0 ${
                        tier.featured ? "text-fg" : "text-fg/25"
                      }`}
                    />
                    <span className="text-[16px] font-light tracking-[-0.02em] text-fg/90 sm:text-[18px]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA — black on the side tiers, inverted white on the featured. */}
              <a
                href={pricing.ctaHref}
                className={`mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-[8px] text-[16px] font-light tracking-[-0.03em] ${
                  tier.featured ? "btn-fill" : "btn-fill-soft"
                }`}
              >
                {tier.cta}
                <CtaArrow className="size-5" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
