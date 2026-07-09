import { motion, useReducedMotion } from "motion/react";
import { Navbar } from "../components/Navbar";
import { SiteFooter } from "../components/SiteFooter";
import { IndustryGlyph } from "../components/ui/IndustryGlyph";
import { LegalScene } from "../legal/LegalScene";
import { industries } from "../data/content";
import { accentFor, accentVars } from "./accents";

/**
 * IndustriesPage — the /industries.html overview hub, deep-linked from the
 * navbar "תעשיות" dropdown ("כל התעשיות"). Each row links to that sector's
 * dedicated page. Content is single-sourced in content.ts (`industries`).
 *
 * Design follows the HOME PAGE editorial vocabulary (KeyFeatures / Solutions),
 * not a generic card grid: a two-column display header, then a numbered index
 * of large typographic rows inside one gray-glass panel with hairline dividers
 * — the "01–06" reference sequence, RTL. The SAME live WebGL scene runs as a
 * fixed backdrop (<LegalScene>).
 *
 * Accessibility: skip-link, semantic landmarks, h1→h2 hierarchy, motion gated
 * on prefers-reduced-motion. Scene is decorative/aria-hidden and ungated (home
 * scene's standing reduced-motion exception).
 */
export function IndustriesPage() {
  const reduced = useReducedMotion();
  const { page, items } = industries;
  const closing = page.closing;

  const reveal = (i = 0) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, delay: 0.04 * i, ease: [0.16, 1, 0.3, 1] as const },
  });

  // Index rows stagger in as the panel enters view.
  const rowItem = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <div id="top" className="relative min-h-dvh text-fg">
      <LegalScene />

      <a
        href="#industries-content"
        className="sr-only rounded-md bg-brand px-4 py-2 text-sm font-semibold text-ink focus:not-sr-only focus:absolute focus:top-4 focus:start-4 focus:z-50"
      >
        דילוג לתוכן
      </a>

      {/* Same floating navbar as the home page (sub-page variant → its in-page
          links resolve back to the home sections). */}
      <Navbar variant="page" />

      <main
        id="industries-content"
        className="relative z-10 container-x mx-auto max-w-[1120px] pb-28 pt-[13vh] sm:pt-[17vh]"
      >
        {/* Editorial header — display title (start) vs. intro (end), like KeyFeatures. */}
        <motion.header
          {...reveal(0)}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-14"
        >
          <div className="max-w-3xl">
            <p className="eyebrow text-brand-300">{page.eyebrow}</p>
            <h1 className="mt-5 text-[clamp(2.4rem,6vw,4.5rem)] font-medium leading-[1.04] tracking-[-0.03em] text-fg">
              {page.title}
            </h1>
          </div>
          <p className="max-w-sm text-[clamp(1rem,1.3vw,1.2rem)] font-light leading-relaxed text-muted md:pb-2 md:text-end">
            {page.intro}
          </p>
        </motion.header>

        {/* Numbered industry index — one gray-glass panel, hairline-divided rows. */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }}
          className="mt-14 overflow-hidden rounded-[24px] border border-white/12 bg-[#33353c]/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_50px_110px_-55px_rgba(0,0,0,0.92)] backdrop-blur-2xl sm:mt-20"
        >
          {items.map((it, i) => (
            <motion.a
              key={it.id}
              href={it.href}
              variants={rowItem}
              aria-label={`${it.title} — ${page.cardCta}`}
              style={accentVars(accentFor(it.id))}
              className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-4 border-t border-white/10 px-5 py-6 transition-colors first:border-t-0 hover:bg-white/[0.035] sm:gap-8 sm:px-9 sm:py-8"
            >
              {/* Accent bar that grows on hover (start edge — RTL), in this
                  sector's own signature color. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 end-0 w-[3px] origin-top scale-y-0 bg-[color:var(--accent)] transition-transform duration-300 group-hover:scale-y-100"
              />

              {/* Index number. */}
              <span className="nums w-9 text-[clamp(1.35rem,3vw,2.1rem)] font-light leading-none tracking-[-0.03em] text-fg/25 transition-colors duration-300 group-hover:text-[color:var(--accent-soft)] sm:w-14">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Body — icon + name, tagline, and the problem line (sm+). */}
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <IndustryGlyph
                    name={it.icon}
                    className="size-[18px] shrink-0 text-[color:var(--accent)] transition-transform duration-300 group-hover:scale-110 sm:size-[22px]"
                  />
                  <h2 className="truncate text-[clamp(1.3rem,2.7vw,2rem)] font-medium tracking-[-0.03em] text-fg">
                    {it.title}
                  </h2>
                </div>
                <p className="mt-1.5 text-[14px] font-light text-[color:var(--accent-soft)] sm:text-[15px]">{it.desc}.</p>
                <p className="mt-2 hidden max-w-xl text-[14px] leading-[1.6] text-muted sm:block">
                  {it.problem}
                </p>
              </div>

              {/* Arrow badge — slides forward (RTL: left) on hover, tinting to
                  this sector's accent. */}
              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/15 text-fg/70 transition-all duration-300 group-hover:border-[color-mix(in_oklab,var(--accent)_50%,transparent)] group-hover:bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] group-hover:text-[color:var(--accent-soft)] sm:size-12">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5 transition-transform duration-300 group-hover:-translate-x-0.5">
                  <path
                    d="M10 19l-7-7 7-7M3 12h18"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </motion.a>
          ))}
        </motion.div>

        {/* Closing — large editorial statement + arrow-badge CTA (home vocabulary). */}
        <motion.section
          {...reveal(0)}
          className="mt-24 border-t border-white/10 pt-16 sm:mt-32 sm:pt-20"
        >
          <span aria-hidden className="block h-px w-12 bg-brand/70" />
          <p className="eyebrow mt-8 text-brand-300">{closing.eyebrow}</p>
          <h2 className="mt-5 max-w-2xl text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.06] tracking-[-0.03em] text-fg">
            {closing.title}
          </h2>
          <p className="mt-5 max-w-md text-[clamp(1rem,1.2vw,1.15rem)] font-light leading-relaxed text-muted">
            {closing.body}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a
              href={closing.cta.href}
              className="group inline-flex h-12 items-center gap-3 rounded-[12px] bg-white ps-6 pe-2 text-[15px] font-bold text-ink transition-colors hover:bg-white/90"
            >
              {closing.cta.label}
              <span className="grid size-8 place-items-center rounded-full bg-ink text-white transition-transform duration-200 group-hover:-translate-x-0.5">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-3.5">
                  <path d="M14 6l-6 6 6 6" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
            <p className="text-[13px] font-light text-faint">{closing.note}</p>
          </div>
        </motion.section>
      </main>

      {/* Shared site footer (identical to the home page). */}
      <div className="relative z-10 container-x mx-auto max-w-[1120px] pb-8">
        <SiteFooter linkBase="/" homeHref="/" />
      </div>
    </div>
  );
}
