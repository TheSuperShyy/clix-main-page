import { partners } from "../data/content";
import { BrandMark } from "./ui/BrandMark";

/**
 * Partners — clone of the reference's OUR PARTNERS strip: a centered eyebrow +
 * big two-line statement headline, then a full-width row of translucent glass
 * logo tiles.
 *
 * Rendered INSIDE the Hero's scene region (after Solutions, past a
 * scene-visible gap) — the tiles' backdrop-blur samples the live scrubbed
 * canvas behind them, exactly like the reference where the video shows
 * through the tiles.
 *
 * Logos are real brand marks via <BrandMark> (simple-icons, recreated — no
 * reference assets). Tiles are a `group`, so hovering floods the mark with
 * the brand's official color (BrandMark's built-in behaviour).
 */

export function Partners() {
  return (
    <section id="partners" className="relative">
      <div className="gutter-x">
        {/* Centered header (ref: eyebrow + two-line statement). */}
        <p className="eyebrow text-center text-fg/80">{partners.eyebrow}</p>

        <h2
          aria-label={partners.title}
          className="mx-auto mt-5 max-w-3xl text-center font-medium leading-[1.12] tracking-[-0.03em] text-fg text-[clamp(2rem,3.6vw,3.5rem)]"
        >
          {partners.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        {/* Glass logo tiles — single row on wide screens (ref: 8 across). */}
        <ul className="mt-12 grid grid-cols-2 gap-2.5 sm:mt-16 sm:grid-cols-4 xl:grid-cols-8">
          {partners.logos.map((name) => (
            <li
              key={name}
              className="group grid aspect-[4/3] place-items-center rounded-[10px] bg-white/[0.08] px-3 text-fg/90 backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.14] xl:aspect-square"
            >
              <BrandMark name={name} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
