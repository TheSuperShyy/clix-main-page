/**
 * Per-industry accent colors — each pulled verbatim from the landing page's own
 * palette (src/styles/index.css): sky #aad4f6 · mint #a5edee · gold #ffe08c ·
 * brand orange #ff7600. This is the ONE thing that differs page-to-page: every
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
  realestate: { hex: "#ffe08c", soft: "#ffe08c" }, // gold
  finance: { hex: "#aad4f6", soft: "#aad4f6" }, // sky
  health: { hex: "#a5edee", soft: "#a5edee" }, // mint
  ecommerce: { hex: "#ff7600", soft: "#ffb066" }, // brand orange
  logistics: { hex: "#aad4f6", soft: "#aad4f6" }, // sky
  education: { hex: "#ffe08c", soft: "#ffe08c" }, // gold
};

const fallback: Accent = { hex: "#ffb066", soft: "#ffb066" };

export const accentFor = (id: string): Accent => industryAccents[id] ?? fallback;

/** CSS custom properties consumed by the page utilities (`var(--accent)` …). */
export const accentVars = (a: Accent) =>
  ({ "--accent": a.hex, "--accent-soft": a.soft }) as React.CSSProperties;
