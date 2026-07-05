import { testimonials } from "../data/content";

/**
 * Testimonials — centered header + three quote columns (ref: "TESTIMONIALS ·
 * What our clients say."). Eyebrow + display headline stacked in the middle,
 * then a row of three columns; each column is a person block (48px round
 * avatar · name · small-caps role) on top with the quote pinned to the column
 * bottom via justify-between — that bottom alignment is what gives the quotes
 * their staggered look in the ref.
 *
 * Ref spec (clone CSS): section pt 200px / pb 60px, flat `#03021b` base (the
 * exact color the Benefits backdrop ends on — the bands chain seamlessly) ·
 * header centered column, gap 40px, padding 40px · columns row height 350px,
 * gap 24px, each column p 32, justify-between, fill `#03021b` (same as the
 * section — no visible card chrome) · avatar 48px, radius 999px, gap 20px to
 * the name/role stack (gap 5px) · quote + name 18–20px, role in the eyebrow
 * treatment. ≤992px the row becomes a 2-up grid; ≤480px a plain stack.
 *
 * Avatars are PLACEHOLDER initials on pastel washes — swap for real client
 * photos later. Static section — no reveal (the ref has none), matching every
 * band since Solutions.
 */

// Pastel washes for the placeholder initial-avatars (sky / mint / gold — the
// hero aurora palette). Cycles if there are ever more than three quotes.
const AVATAR_WASHES = [
  "bg-sky/20 text-sky",
  "bg-mint/20 text-mint",
  "bg-gold/20 text-gold",
] as const;

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

        {/* Quote columns — person block top, quote bottom-aligned (ref: 350px
            columns with justify-between). 2-up on tablet, stacked on mobile. */}
        <div className="grid w-full gap-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {testimonials.items.map((t, i) => (
            <figure
              key={t.name}
              className="flex flex-col gap-8 lg:min-h-[350px] lg:justify-between"
            >
              <figcaption className="flex items-center gap-5">
                {/* Placeholder initial-avatar — swap for a real photo. */}
                <span
                  aria-hidden
                  className={`grid size-12 shrink-0 place-items-center rounded-full text-lg font-medium ${
                    AVATAR_WASHES[i % AVATAR_WASHES.length]
                  }`}
                >
                  {t.name.charAt(0)}
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-[18px] font-medium leading-tight text-fg sm:text-[20px]">
                    {t.name}
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-fg/50">
                    {t.role}
                  </span>
                </span>
              </figcaption>
              <blockquote className="text-[18px] font-light leading-relaxed tracking-[-0.02em] text-fg/90 sm:text-[20px]">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
