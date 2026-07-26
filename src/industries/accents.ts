/**
 * Per-industry accent colors — each pulled verbatim from the landing page's own
 * palette (src/styles/index.css): sky #6f9adf · mint #a9c7ef · gold #f2879b ·
 * brand orange #e94560. This is the ONE thing that differs page-to-page: every
 * sector page shares the home editorial skeleton but gets its own signature
 * light, so finance (sky) reads differently from health (mint) or eCommerce
 * (orange) while all clearly belong to the same site.
 *
 * `hex`  — vivid value for glows, rules, bars, glyphs.
 * `soft` — readable value for small text labels (pastels are already light, so
 *          hex == soft; only orange steps to the site's softer brand-300 tint).
 *
 * Design concern only — NOT Hebrew copy — so it lives here, not in content.ts.
 */
export type Accent = { hex: string; soft: string };

export const industryAccents: Record<string, Accent> = {
  realestate: { hex: "#f2879b", soft: "#f2879b" }, // gold
  finance: { hex: "#6f9adf", soft: "#6f9adf" }, // sky
  health: { hex: "#a9c7ef", soft: "#a9c7ef" }, // mint
  ecommerce: { hex: "#e94560", soft: "#f2879b" }, // brand orange
  logistics: { hex: "#6f9adf", soft: "#6f9adf" }, // sky
  education: { hex: "#f2879b", soft: "#f2879b" }, // gold
};

const fallback: Accent = { hex: "#f2879b", soft: "#f2879b" };

export const accentFor = (id: string): Accent => industryAccents[id] ?? fallback;

/** CSS custom properties consumed by the page utilities (`var(--accent)` …). */
export const accentVars = (a: Accent) =>
  ({ "--accent": a.hex, "--accent-soft": a.soft }) as React.CSSProperties;
