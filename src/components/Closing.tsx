import { brand, closing, contact } from "../data/content";
import { ClixMark } from "./ui/ClixMark";

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

// Social glyphs (simple-icons paths, 24×24, single fill=currentColor) for the
// footer "בואו נתחבר" column. Keyed by the connect link's Latin label.
const SOCIAL_PATHS: Record<string, string> = {
  instagram:
    "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  whatsapp:
    "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.892c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a11.882 11.882 0 005.71 1.454h.006c6.585 0 11.946-5.359 11.949-11.893C24 8.514 22.797 5.652 20.52 3.449",
};

/** Social icon for a connect-column link, resolved from its Latin label. */
function SocialIcon({ label, className = "" }: { label: string; className?: string }) {
  const key = label.trim().toLowerCase();
  const path = SOCIAL_PATHS[key];
  if (!path) return null;
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d={path} />
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
        {/* Empty spacer — the closing headline/CTA pair was removed (user call);
            the scene's final beat fills the space and the footer (whose
            "בואו נדבר." heading is now the band's title) hugs the bottom. */}
        <div aria-hidden />

        {/* Footer — approved mock 1c: rows 1–2 live in ONE frosted glass card
            (same recipe as the navbar: hairline white/10 border + translucent
            white fill + backdrop blur of the scene), the legal bar rides below
            it outside the card. Row 1: contact block (display heading, email,
            hours | location, socials + CTA pill) at the reading start (right)
            opposite a large office map (left). Row 2: wordmark + horizontal
            menu (right) opposite the newsletter pill (left). Row 3 (outside):
            copyright (right) opposite legal links + back-to-top (left).
            Stacks to a column on mobile. */}
        <footer className="w-full">
          {/* Glass panel — everything but the legal bar, in one frosted card. */}
          <div className="rounded-[24px] border border-white/12 bg-[#33353c]/55 p-6 backdrop-blur-xl sm:p-8 lg:p-10">
          {/* Row 1 — contact block · office map. On mobile the CONTACT block
              leads (the "בואו נדבר." heading is the band's title — the map was
              sitting above it) and the map follows below. */}
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-14">
            <div className="flex flex-col items-start gap-4">
              <h2 className="font-medium leading-none tracking-[-0.03em] text-fg text-[clamp(2.25rem,4vw,3rem)]">
                {footer.heading}
              </h2>
              <a
                href={`mailto:${contact.email}`}
                className="text-[17px] font-light tracking-[-0.03em] text-fg/80 transition-colors hover:text-fg sm:text-[19px]"
              >
                {contact.email}
              </a>
              {/* Hours | location on one line, hairline divider between. */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] font-light tracking-[-0.02em] text-fg/50">
                <span>{contact.hours}</span>
                <span aria-hidden className="text-fg/25">
                  |
                </span>
                <span>{contact.locationLine}</span>
              </div>
              {/* Socials (44px circular hairline buttons) + black CTA pill. */}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {footer.connect.map((link) => {
                  const external = link.href.startsWith("http");
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      aria-label={link.label}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-fg/70 transition-[background-color,border-color,transform,color] duration-300 ease-out hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10 hover:text-fg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    >
                      <SocialIcon label={link.label} className="size-[18px]" />
                    </a>
                  );
                })}
                <a
                  href={footer.cta.href}
                  className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-black ps-6 pe-2 text-[15px] font-medium text-fg ring-1 ring-white/10 transition-colors hover:bg-ink-2"
                >
                  {footer.cta.label}
                  <span className="grid size-8 place-items-center rounded-full bg-white text-ink transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
                    <CtaArrow className="size-4" />
                  </span>
                </a>
              </div>
            </div>

            {/* Office map — lazy iframe in a hairline card, desaturated so the
                light Google tiles sit quieter on the dark scene. */}
            <iframe
              src={footer.map.src}
              title={footer.map.title}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[210px] w-full rounded-[18px] border border-white/10 saturate-[0.85] lg:h-[230px] lg:max-w-[430px]"
            />
          </div>

          {/* Row 2 — wordmark + horizontal menu · newsletter pill. */}
          <div className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <a
                href="#top"
                aria-label={brand.full}
                className="inline-flex items-center gap-[0.4em] font-apple text-[1.4rem] font-medium uppercase leading-none text-fg transition-opacity hover:opacity-70"
              >
                {/* Same logomark + wordmark lockup as the navbar — currentColor
                    (text-fg = white) tints the inlined mark to match. */}
                <ClixMark className="h-[1.1em] w-auto shrink-0" />
                {brand.name}
              </a>
              <nav
                aria-label={footer.menuHeading}
                className="flex flex-wrap items-center gap-x-6 gap-y-2"
              >
                {footer.menu.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="py-0.5 text-[15px] font-light tracking-[-0.03em] text-fg/70 transition-colors duration-300 hover:text-fg"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Newsletter — email field + inset white submit, one pill (UI
                only; wire the form to a real list). */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full items-center rounded-full border border-white/10 bg-white/[0.06] p-1.5 transition-colors focus-within:border-white/25 sm:max-w-[380px]"
            >
              <label htmlFor="nl-email" className="sr-only">
                {footer.newsletter.ariaLabel}
              </label>
              <input
                id="nl-email"
                type="email"
                required
                autoComplete="email"
                placeholder={footer.newsletter.placeholder}
                className="min-w-0 flex-1 bg-transparent px-4 text-[14px] text-fg placeholder:text-fg/40 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-white px-5 py-2.5 text-[14px] font-medium text-ink transition-colors hover:bg-white/90"
              >
                {footer.newsletter.button}
              </button>
            </form>
          </div>
          </div>

          {/* Row 3 — legal bar: copyright (reading start / right) opposite the
              legal links + back-to-top (left). Outside the glass card (mock 1c)
              — the card's edge is the separator, so no hairline of its own. */}
          <div className="mt-5 flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] font-light tracking-[-0.02em] text-fg/40">
              {footer.copyright}
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {footer.legal.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[13px] font-light tracking-[-0.02em] text-fg/50 transition-colors hover:text-fg"
                >
                  {link.label}
                </a>
              ))}
              {/* Back to top — ↑ + label, slightly brighter (mock). */}
              <a
                href="#top"
                className="inline-flex items-center gap-1.5 text-[13px] font-light tracking-[-0.02em] text-fg/75 transition-colors hover:text-fg"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-3.5">
                  <path
                    d="M12 19V5m-7 7 7-7 7 7"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {footer.backToTop}
              </a>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
