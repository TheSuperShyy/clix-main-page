import { motion, useReducedMotion } from "motion/react";
import { Navbar } from "../components/Navbar";
import { SiteFooter } from "../components/SiteFooter";
import { LegalScene } from "./LegalScene";
import type { LegalBlock, LegalDoc } from "./content";

/**
 * LegalPage — one dark, RTL, editorial document page shared by the three legal
 * routes (privacy / terms / accessibility). Content is passed in as a LegalDoc
 * (scraped verbatim; see content.ts).
 *
 * Design matches the home page: the SAME live WebGL scene runs as a fixed
 * backdrop (<LegalScene>), and the document floats over it in a frosted glass
 * panel — the site's Solutions/navbar glass language. It also wears the SAME
 * chrome as the home page and the industries pages: the real floating
 * <Navbar variant="page" /> up top and the shared <SiteFooter /> at the bottom
 * (whose legal bar already cross-links privacy/terms/accessibility), so a legal
 * page never reads as a different site.
 *
 * Accessibility (this brand ships an accessibility statement — the page must
 * practice it): a real skip-link, semantic landmarks, h1→h2 hierarchy, visible
 * focus rings (global), and motion gated on prefers-reduced-motion. The scene
 * is decorative/aria-hidden and runs ungated per the home scene's standing
 * reduced-motion exception.
 */

// One paragraph / list / contact block.
function Block({ block }: { block: LegalBlock }) {
  if (block.kind === "p") {
    return <p className="text-[15px] leading-[1.75] text-muted sm:text-base">{block.text}</p>;
  }
  if (block.kind === "contact") {
    return (
      <dl className="grid gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        {block.rows.map((row) => (
          <div key={row.label} className="flex flex-wrap gap-x-2 text-[15px] leading-relaxed">
            <dt className="font-semibold text-fg">{row.label}:</dt>
            <dd className="text-muted">{row.value}</dd>
          </div>
        ))}
      </dl>
    );
  }
  return (
    <ul className="grid gap-2.5">
      {block.items.map((item) => (
        <li key={item} className="flex gap-3 text-[15px] leading-[1.7] text-muted sm:text-base">
          {/* Orange hairline marker — the site's one accent, at the reading start. */}
          <span aria-hidden className="mt-[0.62em] h-px w-3.5 shrink-0 bg-brand/70" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function LegalPage({ doc }: { doc: LegalDoc }) {
  const reduced = useReducedMotion();

  // Shared reveal — a small fade-up, opacity-only under reduced motion.
  const reveal = (i: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.04 * i, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <div id="top" className="relative min-h-dvh text-fg">
      {/* Live WebGL scene — same engine as the home page, fixed behind the
          page (z-0). The glass panel below floats over it. */}
      <LegalScene />

      {/* Skip link — the first Tab target, hidden until focused (matches the
          accessibility statement's promise). */}
      <a
        href="#legal-content"
        className="sr-only rounded-md bg-brand px-4 py-2 text-sm font-semibold text-ink focus:not-sr-only focus:absolute focus:top-4 focus:start-4 focus:z-50"
      >
        דילוג לתוכן
      </a>

      {/* Same floating navbar as the home page (sub-page variant → its in-page
          links resolve back to the home sections). */}
      <Navbar variant="page" />

      {/* Scene strip up top (hero-like), then the document floats over the
          scene in one frosted glass panel. */}
      <main id="legal-content" className="relative z-10 container-x pb-24 pt-[13vh] sm:pt-[17vh]">
        <motion.article
          {...reveal(0)}
          className="mx-auto max-w-[760px] rounded-[24px] border border-white/12 bg-[#1a1a2e]/55 px-6 py-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_40px_90px_-40px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:px-12 sm:py-14"
        >
          {/* Title block */}
          <div>
            <p className="eyebrow text-brand-300">{doc.eyebrow}</p>
            <h1 className="mt-4 text-[clamp(2rem,5vw,3rem)] font-medium tracking-[-0.03em] text-fg">
              {doc.title}
            </h1>
            <p className="mt-3 text-[13.5px] font-light text-faint">{doc.updated}</p>
          </div>

          {/* Sections */}
          <div className="mt-11 space-y-11">
            {doc.sections.map((section, i) => (
              <motion.section key={section.title} {...reveal(i + 1)}>
                <h2 className="text-[1.15rem] font-semibold tracking-[-0.02em] text-fg sm:text-[1.28rem]">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-3.5">
                  {section.blocks.map((block, j) => (
                    <Block key={j} block={block} />
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        </motion.article>
      </main>

      {/* Shared site footer (identical to the home page). Its legal bar already
          cross-links privacy / terms / accessibility. */}
      <div className="relative z-10 container-x mx-auto max-w-[1120px] pb-8">
        <SiteFooter linkBase="/" homeHref="/" />
      </div>
    </div>
  );
}
