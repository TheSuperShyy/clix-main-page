import { motion, useReducedMotion } from "motion/react";
import { Navbar } from "../components/Navbar";
import { SiteFooter } from "../components/SiteFooter";
import { IndustryGlyph } from "../components/ui/IndustryGlyph";
import { LegalScene } from "../legal/LegalScene";
import { industries } from "../data/content";
import { accentFor, accentVars } from "./accents";

type Item = (typeof industries.items)[number];

/**
 * IndustryPage — one dedicated, standalone page per sector (/industry-<id>.html),
 * linked from the navbar "תעשיות" dropdown. The mounting HTML sets
 * data-industry="<id>"; main-page.tsx resolves it to the matching item.
 *
 * Design follows the HOME PAGE editorial vocabulary (KeyFeatures / Solutions),
 * not a generic centered card stack: an asymmetric display hero with a large
 * index number, a numbered "what we'll build" sequence, a big pull-quote
 * promise, the signature arrow-badge CTA, and a hairline-divided cross-nav.
 * The SAME live WebGL scene runs as a fixed backdrop (<LegalScene>).
 *
 * What makes each sector its OWN page: a signature accent pulled from the home
 * palette (see ./accents) — finance=sky, health=mint, eCommerce=orange … —
 * threaded through a soft ambient hero glow, the eyebrow, index number, feature
 * rules, glyph and every hover state via the `--accent` / `--accent-soft` vars.
 *
 * Accessibility: skip-link, semantic landmarks, one h1, motion gated on
 * prefers-reduced-motion. Scene + glow are decorative/aria-hidden, ungated (home
 * scene's standing reduced-motion exception).
 */
export function IndustryPage({ item }: { item: Item }) {
  const reduced = useReducedMotion();
  const { page } = industries;
  const { detail, closing } = page;
  const index = industries.items.findIndex((i) => i.id === item.id) + 1;
  const others = industries.items.filter((i) => i.id !== item.id);
  const accent = accentFor(item.id);

  const reveal = (i = 0) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, delay: 0.04 * i, ease: [0.16, 1, 0.3, 1] as const },
  });

  const stepItem = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <div id="top" className="relative min-h-dvh text-fg" style={accentVars(accent)}>
      <LegalScene />

      {/* Signature per-sector light — a soft accent wash at the top-start (RTL:
          right), echoing the landing page's pastel glows. Sits above the scene,
          below the content. Decorative. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(46% 38% at 82% 6%, color-mix(in oklab, var(--accent) 20%, transparent) 0%, transparent 62%)",
        }}
      />

      <a
        href="#industry-content"
        className="sr-only rounded-md bg-brand px-4 py-2 text-sm font-semibold text-ink focus:not-sr-only focus:absolute focus:top-4 focus:start-4 focus:z-50"
      >
        דילוג לתוכן
      </a>

      {/* Same floating navbar as the home page (sub-page variant → its in-page
          links resolve back to the home sections). */}
      <Navbar variant="page" />

      <main
        id="industry-content"
        className="relative z-10 container-x mx-auto max-w-[1120px] pb-28 pt-[13vh] sm:pt-[17vh]"
      >
        {/* Hero — asymmetric editorial: index + glyph, eyebrow, big tagline, problem lead. */}
        <motion.header {...reveal(0)} className="max-w-4xl">
          <div className="flex items-center gap-5">
            <span className="nums text-[clamp(2.25rem,6vw,4rem)] font-light leading-none tracking-[-0.04em] text-fg/25">
              {String(index).padStart(2, "0")}
            </span>
            <span aria-hidden className="h-10 w-px bg-white/15 sm:h-12" />
            <span
              className="grid size-12 place-items-center overflow-hidden rounded-[15px] bg-[linear-gradient(150deg,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0.03)_100%)] shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.14)] ring-1 ring-inset ring-white/10 sm:size-14"
              style={{ boxShadow: "inset 0 1px 0.5px rgba(255,255,255,0.14), 0 0 34px -8px color-mix(in oklab, var(--accent) 60%, transparent)" }}
            >
              <IndustryGlyph name={item.icon} className="size-6 text-[color:var(--accent)] sm:size-7" />
            </span>
          </div>

          <p className="eyebrow mt-8 text-[color:var(--accent-soft)]">
            {detail.eyebrowPrefix} · {item.title}
          </p>
          <h1 className="mt-4 text-[clamp(2.5rem,6.5vw,5rem)] font-medium leading-[1.02] tracking-[-0.03em] text-fg">
            {item.desc}.
          </h1>
          <p className="mt-6 max-w-xl text-[clamp(1.05rem,1.5vw,1.35rem)] font-light leading-relaxed text-muted">
            {item.problem}
          </p>
        </motion.header>

        {/* Features — "what we'll build", numbered editorial columns. */}
        <section className="mt-24 border-t border-white/10 pt-14 sm:mt-32 sm:pt-20">
          <motion.p {...reveal(0)} className="eyebrow text-[color:var(--accent-soft)]">
            {detail.featuresHeading}
          </motion.p>
          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.06 } } }}
            className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-5"
          >
            {item.features.map((f, i) => (
              <motion.li
                key={f}
                variants={stepItem}
                whileHover={reduced ? undefined : { y: -5, transition: { type: "spring", stiffness: 320, damping: 22 } }}
                className="group flex transform-gpu flex-col rounded-[18px] border border-white/12 bg-[#33353c]/45 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_40px_90px_-55px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-colors duration-300 hover:border-[color-mix(in_oklab,var(--accent)_45%,transparent)] sm:p-7"
              >
                <span className="nums text-[15px] font-medium tracking-[0.1em] text-[color:var(--accent-soft)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden
                  className="mt-4 block h-px w-8 origin-right bg-[color:var(--accent)] opacity-60 transition-all duration-300 group-hover:w-12 group-hover:opacity-100"
                />
                <p className="mt-5 text-[17px] font-medium leading-[1.4] text-fg sm:text-[19px]">{f}</p>
              </motion.li>
            ))}
          </motion.ul>
        </section>

        {/* Promise — large pull-quote, no box. */}
        <motion.section {...reveal(0)} className="mt-24 border-t border-white/10 pt-14 sm:mt-32 sm:pt-20">
          <span aria-hidden className="block h-px w-12 bg-[color:var(--accent)] opacity-80" />
          <p className="mt-8 max-w-4xl text-[clamp(1.75rem,4.6vw,3.15rem)] font-medium leading-[1.14] tracking-[-0.03em] text-fg">
            {item.promise}
          </p>
        </motion.section>

        {/* Closing CTA — editorial statement + arrow-badge button. */}
        <motion.section {...reveal(0)} className="mt-24 border-t border-white/10 pt-14 sm:mt-32 sm:pt-20">
          <p className="eyebrow text-[color:var(--accent-soft)]">{closing.eyebrow}</p>
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

        {/* More industries — hairline-divided list, matching the overview index.
            Each row carries its OWN sector accent on the glyph + hover chevron. */}
        <motion.nav {...reveal(0)} aria-label={detail.moreHeading} className="mt-24 border-t border-white/10 pt-14 sm:mt-32 sm:pt-20">
          <p className="eyebrow text-[color:var(--accent-soft)]">{detail.moreHeading}</p>
          <ul className="mt-8 overflow-hidden rounded-[20px] border border-white/12 bg-[#33353c]/45 backdrop-blur-2xl">
            {others.map((o) => (
              <li key={o.id} className="border-t border-white/10 first:border-t-0">
                <a
                  href={o.href}
                  className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.035] sm:px-7 sm:py-5"
                  style={accentVars(accentFor(o.id))}
                >
                  <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-[linear-gradient(150deg,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0.03)_100%)] ring-1 ring-inset ring-white/10 transition-transform duration-300 group-hover:scale-105">
                    <IndustryGlyph name={o.icon} className="size-[18px] text-[color:var(--accent)]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-medium tracking-[-0.02em] text-fg sm:text-[17px]">{o.title}</span>
                    <span className="block truncate text-[13px] font-light text-muted">{o.desc}</span>
                  </span>
                  {/* RTL: forward chevron points left. */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                    className="size-4 shrink-0 -translate-x-1 text-[color:var(--accent-soft)] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  >
                    <path
                      d="M10 19l-7-7 7-7M3 12h18"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </motion.nav>
      </main>

      {/* Shared site footer (identical to the home page). */}
      <div className="relative z-10 container-x mx-auto max-w-[1120px] pb-8">
        <SiteFooter linkBase="/" homeHref="/" />
      </div>
    </div>
  );
}
