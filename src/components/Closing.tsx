import { SiteFooter } from "./SiteFooter";

/**
 * Closing — the last band: closing CTA + footer in ONE full-viewport section
 * (ref: final scene band — display headline + Get Started / Learn More over
 * the WebGL scene, with the footer riding the bottom edge).
 *
 * Ref spec (clone CSS): section 100vh flex column; inner column 100vh,
 * max-w 1440, p 40 (100/24/24 ≤480), `justify-content:space-between` with an
 * empty top spacer → the CTA block floats mid-viewport, footer sits at the
 * bottom.
 *
 * Like the ref, this band is TRANSPARENT over the site's fixed WebGL scene
 * (<SceneBackdrop>) — at this scroll depth the sequence shows its final beat:
 * the sliced sphere over the light horizon (the approved 52% stop).
 * id="contact" — every "דברו איתנו"/#contact link on the page lands here.
 *
 * The footer itself lives in the shared <SiteFooter> (also used by the
 * industries / legal sub-pages) so every page carries the identical footer.
 * Static section — no reveal (the ref has none), like every band since
 * Solutions.
 */

export function Closing() {
  return (
    // Transparent over the page-wide fixed scene (ref behavior) — the
    // sequence's final beat is this band's backdrop.
    <section id="contact" className="relative">
      {/* Full-viewport column: spacer → footer (ref behavior — the scene's
          final beat fills the space and the footer hugs the bottom). */}
      <div className="container-x relative z-[1] flex min-h-dvh flex-col justify-between gap-20 pt-28 pb-6 sm:gap-10 sm:pt-32 sm:pb-10">
        {/* Empty spacer — the scene's final beat fills the space above the
            footer (whose "בואו נדבר." heading is the band's title). */}
        <div aria-hidden />
        <SiteFooter />
      </div>
    </section>
  );
}
