import { brand, closing, contact } from "../data/content";

/**
 * Closing — the last band: closing CTA + footer in ONE full-viewport section
 * (ref: final scene band — display headline + Get Started / Learn More over
 * the WebGL scene, with the footer riding the bottom edge).
 *
 * Ref spec (clone CSS): section 100vh flex column; inner column 100vh,
 * max-w 1440, p 40 (100/24/24 ≤480), `justify-content:space-between` with an
 * empty top spacer → the CTA block floats mid-viewport, footer sits at the
 * bottom. CTA block: display headline (5dvw cap 56px, 500, −0.03em; 40px
 * mobile) + button row gap 4px — solid black 48px radius-8 CTA with a 20px
 * arrow, and a ghost `#ffffff1a` + blur(20) one. Footer row `align-items:end,
 * justify-between` (stacks gap 24 ≤480): brand block (24px wordmark + email,
 * gap 24) opposite two link columns gap 60 (40 ≤992) — 20px light heading
 * (12px under it) + rows gap 16, 16px light labels.
 *
 * Like the ref, this band is TRANSPARENT over the site's fixed WebGL scene
 * (<SceneBackdrop>) — at this scroll depth the sequence shows its final beat:
 * the sliced sphere over the light horizon (the approved 52% stop).
 * id="contact" — every "דברו איתנו"/#contact link on the page lands here.
 * Static section — no reveal (the ref has none), like every band since
 * Solutions.
 */

/** Forward arrow for the primary CTA — points to the RTL "forward" (left). */
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

export function Closing() {
  const { footer } = closing;

  return (
    // Transparent over the page-wide fixed scene (ref behavior) — the
    // sequence's final beat is this band's backdrop.
    <section id="contact" className="relative">

      {/* Full-viewport column: spacer → CTA block → footer (ref behavior —
          the headline floats mid-scene, the footer hugs the bottom). */}
      <div className="container-x relative z-[1] flex min-h-dvh flex-col justify-between gap-20 pt-28 pb-6 sm:gap-10 sm:pt-32 sm:pb-10">
        <div aria-hidden className="hidden sm:block" />

        {/* Closing CTA — start-aligned display headline + button pair. */}
        <div className="flex flex-col items-start gap-6">
          <h2
            aria-label={closing.title}
            className="font-medium leading-[1.1] tracking-[-0.03em] text-fg text-[clamp(2.5rem,5vw,3.5rem)]"
          >
            {closing.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>

          {/* Ref: the two CTAs sit SIDE BY SIDE (content width), on mobile too —
              not stacked full-width. */}
          <div className="flex flex-row items-center gap-2">
            {closing.ctas.map((cta) =>
              cta.primary ? (
                <a
                  key={cta.label}
                  href={cta.href}
                  className="flex h-12 items-center justify-center gap-2 rounded-[8px] bg-black ps-6 pe-4 text-[16px] font-light tracking-[-0.03em] text-fg ring-1 ring-white/10 transition-colors hover:bg-ink-2"
                >
                  {cta.label}
                  <CtaArrow className="size-5" />
                </a>
              ) : (
                <a
                  key={cta.label}
                  href={cta.href}
                  className="flex h-12 items-center justify-center rounded-[8px] bg-white/10 px-6 text-[16px] font-light tracking-[-0.03em] text-fg backdrop-blur-[20px] transition-colors hover:bg-white/15"
                >
                  {cta.label}
                </a>
              ),
            )}
          </div>
        </div>

        {/* Footer — brand + email opposite the link columns, bottom-aligned. */}
        <footer className="flex w-full flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-start gap-5 sm:gap-6">
            <a
              href="#top"
              aria-label={brand.full}
              className="font-apple text-[1.6rem] font-medium uppercase leading-none text-fg transition-opacity hover:opacity-70"
            >
              {brand.name}
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="text-[16px] font-light tracking-[-0.03em] text-fg transition-colors hover:text-fg/70 sm:text-[18px]"
            >
              {contact.email}
            </a>
          </div>

          <div className="flex gap-14 sm:gap-16">
            {(
              [
                { heading: footer.menuHeading, links: footer.menu },
                { heading: footer.connectHeading, links: footer.connect },
              ] as const
            ).map((col) => (
              <nav key={col.heading} aria-label={col.heading} className="flex flex-col gap-4">
                <p className="mb-3 text-[18px] font-light tracking-[-0.03em] text-fg sm:text-[20px]">
                  {col.heading}
                </p>
                {col.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-[14px] font-light tracking-[-0.03em] text-fg/80 transition-colors hover:text-fg sm:text-[16px]"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            ))}
          </div>
        </footer>
      </div>
    </section>
  );
}
