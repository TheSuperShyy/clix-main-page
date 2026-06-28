# CONTEXT.md — Clix Solutions Website

> Living document. **Per CLAUDE.md Rule 1, update this after every task** (Current Status + Build Status + Changelog).

---

## 🟢 Current Status

**Phase:** ✅ v2 — rebuilt as a faithful **SOHub clone** (light theme, minimal section set).
**Done:** Pivoted from the dark 12-section "blend" to SOHub's actual structure: **light "paper" theme** (ink-black type on off-white), hero centered on the **3D WebGL logo** render (bottom-start headline + scroll cue; background wordmark removed), SOHub-accurate floating navbar (wordmark + light chat pill + ink "תפריט" pill, each with a trailing circle icon → full-screen ink menu overlay), and only the Clix sections that fit SOHub's page: **Hero → Work → Services (4-col) → "בואו נבנה משהו" ink CTA → Footer**. `npm run build` passes; dev serves HTTP 200.
**Parked (not forced into SOHub's structure, per user):** Stack, Voice-AI dashboard, Web+Mobile feature, Methodology (pinned), Testimonials, Training — components/data still on disk, just not rendered in `App.tsx`.
**Next (suggested):** Swap the hero render + project thumbnails for real assets; confirm the `info@clixsolution.com` vs `clixsolutions.info` discrepancy; decide whether any parked section returns; install Superpowers plugin; responsive QA.

---

## 🎯 Project Goal

Build, from scratch, a new Hebrew **RTL** marketing site for **Clix Solutions** (Tel Aviv AI-engineering agency). Reuse Clix's real content from [clixsolutions.info](https://www.clixsolutions.info/), rebuilt with the **premium dark, image-first aesthetic of [sohub.digital](https://sohub.digital/)** as the design reference. **Blend** approach: SOHub's look + ALL of Clix's richer sections.

## 🔒 Locked Decisions

| Decision | Choice |
|----------|--------|
| Language / direction | **Hebrew, full RTL** |
| Stack | **Vite + React + TS + Tailwind v4 + Motion (Framer) + GSAP + Lenis** |
| Design fidelity | **Blend** — SOHub aesthetic, keep all Clix sections |
| Assets | **Polished placeholders** now; real assets swapped later |

---

## 📋 Content Scrape — clixsolutions.info (source of truth for copy)

**Identity:** Clix Solutions · tagline **"בינה מהונדסת לעסק שלכם"** (engineered AI for your business).
**Nav:** שירותים · תעשיות · פרויקטים · תובנות · פלייגראונד · אודותינו · CTA **"בואו נתחיל"**.

**Sections (page order):**
- **Hero** — "מערכות AI מהונדסות לעסק שלכם" · CTA "בואו נתחיל".
- **The Stack** — "כל הכלים שאתם משתמשים בהם מזינים מוח אחד". Integrations: Vapi, n8n, Make, OpenAI, Gemini, WhatsApp, Claude.
- **Voice AI** — "סוכנים קוליים שמנהלים את כל השיחה"; production-grade voice agents: answer inbound calls, validate leads, book meetings, hand off to a human.
- **Web + Mobile** — "אפליקציות ואתרים, מהונדסים כמערכות"; CRM systems, customer portals, native iOS/Android, dedicated sites.
- **Testimonials** — אסף פרץ (founder, SalesIQ) · אדיר פרץ (video/photo studio) · נבו יהלומן (founder) · נועם תובי (investments).
- **Lectures & Training** — "מביאים את צוות המומחים אל החדר שלכם".
- **Methodology** — "מהירות של מעבדה. משמעת של מפעל". 4 steps:
  - **01 אבחון** — meet the team, map existing systems, find where AI creates real business value.
  - **02 תכנון** — design the most compact system that solves the biggest problem (ROI, security, durability).
  - **03 בנייה** — senior engineers ship fast; usable products weekly, not slideware.
  - **04 הפעלה** — monitor, improve, train your team for independent operation.
- **CTA** — "בואו נבנה משהו" / "אתם מביאים את העסק. אנחנו מביאים את הבינה."
- **Footer** — © 2026 Clix Solutions; Privacy / Terms / Accessibility; back-to-top.

**Stats / metrics:** real-time avg response · follow-up < 1 business day · dashboard mock (**1.2k** closed, **842ms** p50, **99.9%** availability, **+18%** growth, **+24%** close rate).

**Services:** Voice AI · Web + Mobile dev · AI Automation (Vapi/n8n/Make/OpenAI/Gemini/WhatsApp/Claude) · CRM systems · WhatsApp automation · Consultation & Training.

**Contact:** info@clixsolution.com · Tel Aviv · global service · Instagram @clix_solution · Sun–Thu 09:00–18:00.
> ⚠️ Site domain is `clixsolutions.info` but listed email is `info@clixsolution.com` — using the on-site value; **confirm with user**.

## 🎨 SOHub Design Reference

Deep-charcoal/near-black bg, high contrast, big hero render, minimal narrative copy. Work portfolio as 2-col card grid; Services as 2×2 expandable cards; sticky nav + persistent CTA; scroll-triggered reveals; large closing-CTA visual ("Don't be shy"). Next.js, image-first.

## 🧱 Architecture — SOHub clone (page order)

**v2 (current):** Navbar (minimal) → **Hero** (giant wordmark + render + bottom headline) → **Work** (project grid) → **Services** (4-col + bullets) → **CTA** ("בואו נבנה משהו", ink band) → **Footer** (minimal). Light "paper" theme.

> ⚠️ Decision change (user, 2026-06-28): drop the "blend" and **clone SOHub's real structure** — light theme, only the Clix content that fits SOHub's ~4 content sections. **Do not force all 12 sections in.** The dark/blend `~v1~` sections below are parked.

**Parked v1 sections (on disk, not rendered):** The Stack · Voice-AI dashboard · Web+Mobile feature · Methodology (pinned) · Testimonials · Training · AmbientBackground. Their data still lives in `content.ts`; re-add to `App.tsx` to revive.

---

## 🏗 Build Status

- [x] Vite + React + TS scaffold (configs, `index.html`, entry)
- [x] Dependencies installed
- [x] `CLAUDE.md` (skills auto-use + 2 rules)
- [x] `CONTEXT.md`
- [x] GSAP skill added locally
- [ ] Superpowers plugin installed *(user action — see below)*
- [x] Tailwind v4 + RTL + dark theme tokens + Heebo font
- [x] `src/data/content.ts` (all Hebrew copy)
- [x] UI primitives + lib/hooks (gsap, motion, Lenis, Reveal, Button, Counter, Icon, Marquee, AmbientBackground)
- [x] Sections: Navbar, Hero, Stack, Services, VoiceAI, WebMobile, Work, Methodology, Testimonials, Training, CTA, Footer
- [x] GSAP scroll animations (counters, pinned 4-step Methodology) + Framer Motion interactions
- [x] Placeholder assets (gradients, console/dashboard/device mocks, favicon)
- [x] Verify `npm run build` (passes) + `npm run dev` (HTTP 200)

---

## 🤖 Skills Status

Installed locally (`~/.claude/skills/`): **framer-motion**, **prompt-master**, **prompt-architect**, **ui-ux-pro-max**, **gsap** (added this session).

All are set to **auto-use** in `CLAUDE.md`.

### ⬇️ Superpowers — needs a one-time install by you

Superpowers is a multi-skill **plugin** (not a single local skill). Claude **cannot** run interactive `/plugin` commands for you — run these in Claude Code yourself:

```
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

(Official alternative: `/plugin install superpowers@claude-plugins-official`.) After install, restart the session so its SessionStart context loads.

### GSAP skill — official alternative
A local `gsap` skill was added this session. To instead use GreenSock's official multi-skill plugin:
```
/plugin marketplace add greensock/gsap-skills
/plugin install gsap-react@gsap-skills
```

> Sources: [obra/superpowers](https://github.com/obra/superpowers/) · [obra/superpowers-marketplace](https://github.com/obra/superpowers-marketplace) · [greensock/gsap-skills](https://github.com/greensock/gsap-skills)

---

## 🗒 Changelog

- **2026-06-29 (v2.6d — wordmark back to top-right)** — Position-only change: moved the big mark from the fixed left-center back into the navbar row at the **top-right** (start in RTL), where it aligns with the pills' edge. Kept every style attribute (Apple/Inter `font-apple`, `text-h1`, `font-extrabold`, `tracking-[0.15em]`, lowercase). Removed the standalone `fixed` element; the mark is now the row's `md:block` `<a>` (mobile keeps the compact `text-2xl` wordmark). Pills stay left via `ms-auto`. `npm run build` passes.
- **2026-06-29 (v2.6c — left-center mark matches headline weight/size)** — Per a reference screenshot of the hero headline, matched the left-center "clix" mark's **weight and size** to it: `font-thin → font-extrabold` (800, same as the `text-h1`/h1 headline) and `text-[clamp(3rem,6vw,5rem)] → text-h1`. Kept the earlier explicit choices (Apple/Inter `font-apple`, `tracking-[0.15em]`, lowercase, left-center position) since the ask was scoped to weight + size only. `npm run build` passes. **Skill:** ui-ux-pro-max (type weight/scale matching).
- **2026-06-29 (v2.6b — wordmark → editorial left-center mark)** — Moved the "clix" wordmark out of the navbar top-right to the **vertical center of the left edge** as a large, thin, letter-spaced brand mark: `fixed top-1/2 -translate-y-1/2 end-6 lg:end-10` (end-* = physical left in RTL), `text-[clamp(3rem,6vw,5rem)]` (48→80px), `font-thin` (100), `tracking-[0.15em]`, lowercase, ink. Loaded Inter **100/200/300** weights in `index.html` (only 400–800 were there, so `font-thin` had no file). Mobile (<md) keeps a compact `text-2xl` wordmark in the bar so the big mark never collides with the centered hero logo; pills pinned left via `ms-auto`. Opacity-only fade-in (keeps the `-translate-y-1/2` centering intact). `npm run build` passes. **Skills:** ui-ux-pro-max (placement/scale/tracking/responsive), framer-motion (entrance).
- **2026-06-28 (fix — dev-server watcher crash)** — The dev server died with `EBUSY: resource busy or locked, watch 'clix-ads.mp4'`: a video file sitting in the project root was locked (open/copying on Windows), and Vite's chokidar watcher throws an unhandled error and takes the whole server down. Added `server.watch.ignored: ["**/*.mp4","**/*.mov","**/*.webm"]` to `vite.config.ts` so locked media can never crash dev again (we never HMR those). Server reboots clean on :5173. *(Suggestion: move `clix-ads.mp4` into `public/` or out of the repo root.)*
- **2026-06-28 (v2.6a — larger pills + Apple typeface)** — Enlarged the navbar pills **48px → 60px** (`py-2`, circle `size-9 → size-11`, `ps-6`, `gap-3.5`, label `text-sm → text-base`; chat icon `18px → size-5`, menu dots `1.5 → size-2`; wordmark `1.7rem → 2rem`). Gave the navbar **Apple's UI font**: added Inter (Google Fonts, the free SF-Pro lookalike) in `index.html`; new `--font-apple` token in `@theme` (`-apple-system → BlinkMacSystemFont → SF Pro → Inter → Heebo`) → `font-apple` utility applied to the header + overlay. Real San Francisco on Apple devices, Inter on Windows; Hebrew glyphs fall through to Heebo (SF/Inter carry no Hebrew), so Hebrew labels stay Heebo. `npm run build` passes. **Skills:** ui-ux-pro-max (pill sizing + Apple type system).
- **2026-06-28 (v2.6 — SOHub-accurate header pills)** — Rebuilt `Navbar.tsx` to match SOHub's header signature: **floating islands** (wordmark on the start, pill pair on the end — dropped the full-width glass-on-scroll bar). Both pills now carry SOHub's signature **trailing circle icon**: the light CTA pill ("בואו נדבר") gets a white circle with a Lucide chat-bubble icon (nudges −12° on hover); the dark "תפריט" pill gets the "••" dots inside a circle (was inline). Chunky **48px pill geometry** — `p-1.5 + ps-5` around a `size-9` circle = symmetric 6px inset. Refined label type to `text-sm font-semibold tracking-tight`; wordmark bumped to `text-[1.7rem]`. Light pill is token-driven `bg-ink/[0.07] → hover:0.12` (soft gray, no invented hex). Subtle spring press/hover feedback (`whileTap 0.96`, `whileHover 1.015`) via Framer Motion; header drops in on mount (reduced-motion respected). Overlay close button mirrors the pill anatomy. `npm run build` passes. **Skills:** ui-ux-pro-max (pill proportions/sizing/states), framer-motion (press feedback + entrance).
- **2026-06-28 (v2.5b — visible ground shadow)** — The v2.5a pool (`bg-ink/22 blur-2xl`) was still too faint to read on white. Replaced the uniform blurred box with a **radial-gradient ground pool** (`rgba(18,18,16,0.40)` core → `0.20` → transparent at 72%, `blur(6px)`) at `bottom-[8%]`, `w-[clamp(170px,24vw,360px)]` × `h-12`. Naturally-fading, clearly visible on the white bg, still soft. `npm run build` passes.
- **2026-06-28 (v2.5a — visible floating shadow)** — The v2.5 ground ellipse sat at `bottom-[15%]`, hidden behind the logo's lower tip, so no shadow was visible. Moved it down to `bottom-[10%]` (clearly below the mark's base, small gap = floating) and made it **small + subtle**: `w-[clamp(130px,18vw,260px)]` (narrower than the logo), `h-8`, `bg-ink/22 blur-2xl`. `npm run build` passes.
- **2026-06-28 (v2.5 — 360° gloss + bottom-only shadow)** — User: the back/far side of the spinning logo looked rough & pitch-black, and the shadow should be bottom-only. **(1) 360° gloss** (ultracode workflow, 2 enveloping-studio approaches → verify+synth): the studio was front-loaded (all bright formers on +z + a dark backdrop at z=-8), so the far side mirrored only the dark hemisphere and went matte. Replaced with an **enveloping ring of 8 inward-facing vertical softbox strips every 45° (r≈5.5)** + an overhead key + a 3-circle lower glint ring; dropped the dark backdrop. Trimmed `envMapIntensity` 2.0→1.5 (8 panels raise avg env luminance) and rebalanced lights (key 2.2→1.8, back-fill 0.5→1.0) so the far side's diffuse never dies while the body stays piano-black. **Panel caught a real bug:** the 225° & 315° ring strips were rotated 90° off (facing edge-on, not inward) — verified numerically (inward dot now 1.000) and fixed (a drei rect emits along local +z, so inward facing = rotation y=θ+π). **(2) Bottom-only shadow:** the CSS silhouette `drop-shadow` traced the whole non-convex shape and bled around the sides; removed it and replaced with a single soft **ground-pool ellipse** beneath the logo in `Hero.tsx` (`bottom-[15%]`, `bg-ink/30 blur-2xl`), canvas raised to `z-10` above it. `npm run build` passes. **Check:** confirm back is now glossy and shadow sits only at the bottom; if the ring greys the flats, drop `envMapIntensity` toward 1.3.
- **2026-06-28 (v2.4 — piano-black logo on white)** — User: white background + black "piano-key finish" logo (shiny, glossy). Ran an **ultracode design-panel workflow** (3 diverse R3F approaches → API-verify + synthesize). Page bg → pure white (`--color-bg #ffffff`, `--color-bg-2 #fafafa`). Logo material swapped `meshStandardMaterial` → **`meshPhysicalMaterial`** (piano lacquer = dielectric clearcoat over black, not metal): `color #060606, metalness 0, roughness 0.12, clearcoat 1, clearcoatRoughness 0.03, ior 1.5, envMapIntensity 2.0`. Because the canvas is `alpha:true` the white page isn't in the reflection, so the gloss is built entirely inside `<Environment resolution={512}>`: a dark backdrop former pins the body to true black, then an overhead key panel + front softbox + a tilted **razor streak** + cool side panel + warm lower glint sweep bright highlights across the bevels on auto-rotate. Lights: ambient crushed to 0.08, hemisphere removed (broad fill greys black out), white key 2.2 + low cool fill 0.5. `gl.toneMappingExposure 1.15` (kept ACES default) blooms the streaks without clipping. **Panel caught a real bug:** `reflectivity` + `ior` together on `meshPhysicalMaterial` is contradictory in three 0.171 (`reflectivity` is a setter that overwrites `ior`) — dropped `reflectivity`, pinned `ior 1.5`. `npm run build` passes. **Check:** gloss/brightness on screen; if too dark raise `envMapIntensity`/exposure, if highlights clip lower exposure (≤1.25).
- **2026-06-28 (v2.3c — clean floating hero)** — User: remove the purple background gradient + the floating cyan/"green" dot (upper-left), and make the drop shadow bottom-only so the logo reads as lit from above and floating. In `src/components/Hero.tsx` deleted the violet brand-glow radial, the static contact-shadow ellipse, and the animated cyan accent dot — the 3D stage is now just the canvas + the drag hint. In `src/components/HeroLogo3D.tsx` re-tuned the canvas `drop-shadow` so each layer's vertical offset exceeds its blur (`0 16px 12px` + `0 44px 30px`), pooling the shadow **beneath** the mark instead of around it → single top-down key light, product floating. `npm run build` passes.
- **2026-06-28 (v2.3b — live drop shadow)** — User: "add a drop shadow to add depth in the logo to make it have life." Added a layered CSS `drop-shadow` filter to the WebGL `<Canvas>` in `src/components/HeroLogo3D.tsx` (tight contact `0 9px 11px` + soft cast `0 26px 32px`, ink-tinted). Because the filter is computed from the canvas's live alpha silhouette, the shadow **re-traces every frame and follows the logo as it rotates** — real depth, not a static blob. Safe on WebGL (the filter is on the canvas element, not a CSS-3D layer, so nothing flattens). Applied `ui-ux-pro-max` elevation guidance (soft, large-radius, low-opacity). `npm run build` passes.
- **2026-06-28 (v2.3a — drop background wordmark)** — User: "remove the clix name in the background." Removed the giant `clix` wordmark block (the `text-ink/15` `motion.span` at `clamp(7rem,30vw,28rem)`) from `src/components/Hero.tsx`, so the 3D logo render now stands alone over the paper background. `hero.wordmark` left in `content.ts` (harmless, unused). `npm run build` passes.
- **2026-06-28 (v2.3 — real WebGL logo)** — Feedback: the CSS faux-extrusion looked flat and the side view fell apart into a comb of slices; painted highlight didn't move so lighting looked fake. Replaced the CSS approach with a **true 3D mesh**. Pipeline: `potrace` traces the logo → `public/clix-logo.svg` (single path, evenodd holes) via `scripts/trace-logo.cjs`; Three.js `SVGLoader` → `ExtrudeGeometry` (beveled solid) in `src/components/HeroLogo3D.tsx` rendered with **@react-three/fiber v9 + drei** (React 19). Natural lighting = ambient + hemisphere + key/fill/violet-rim directional lights **+ an in-memory `<Environment>` of `<Lightformer>`s** (real moving reflections, no HDRI/network). `<OrbitControls>` = drag to orbit all sides (autorotate when motion allowed). Orientation fix: `rotation=[π,0,0]` (corrects SVG y-down without mirroring). Lazy-loaded (`React.lazy`) with the static PNG as Suspense fallback, so `three` is a separate ~261 KB-gzip chunk off the initial bundle. New deps: `three`, `@react-three/fiber`, `@react-three/drei` (+ dev `potrace`, `@types/three`). `npm run build` passes. **Check:** logo orientation/holes + lighting brightness on screen; tune metalness/roughness if too dark.
- **2026-06-28 (v2.2a — grab fix)** — Logo wasn't grabbable: the bottom headline block (`z-10`, big `pt-40` padding) overlapped the logo's center/lower area and its invisible hit-zone swallowed the pointer (CSS masks don't change hit-testing). Fixed by making the headline block `pointer-events-none` (no links inside) so events pass through to the logo. `npm run build` passes.
- **2026-06-28 (v2.2 — interactive 3D logo)** — Feedback: logo looked flat + a faint white box was still visible behind it (the PNG's near-white bg got partial alpha and compounded across the stacked layers). Fixes: (1) **hard knockout** — reprocessed from the root source with a crisp threshold so the background is fully transparent (verified alpha 0), re-cropped + resized → `public/clix-logo.png` (~272 KB). (2) **Definition** — rebuilt the mark from flat `<img>` copies to **CSS `mask-image` gradient surfaces**: a lit metallic front face (specular highlight + violet rim + diagonal body), extruded dark side layers for real thickness, and a top bevel highlight. (3) **Interactivity** — grab-to-rotate (pointer drag → spring rotateX/rotateY) and **click-to-flip 180°**, with an RTL hint ("גררו לסיבוב · לחצו להיפוך"). Kept idle float/sway + reduced-motion gating. Avoided `filter`/`opacity` on any ancestor of the 3D layers (those flatten `preserve-3d`). Also strengthened **CLAUDE.md** Skills policy to **MANDATORY always-use**. `npm run build` passes.
- **2026-06-28 (v2.1 — 3D logo hero)** — User added their real brand mark (`clix-logo.png`, root) and asked to replace the placeholder orb with a **3D, framer-motion** version of it. Processed the source (24bpp white-bg) → transparent, anti-aliased, auto-cropped tight to the mark, downscaled to 820px → `public/clix-logo.png` (248 KB) via a compiled C#/System.Drawing routine. Rebuilt the hero centerpiece as `HeroLogo3D`: faux-**extruded depth** (6 stacked Z-layers, darker toward back) for real thickness, **pointer-driven parallax tilt** (`useMotionValue`/`useSpring`/`useTransform` → rotateX/rotateY), idle float + sway, brand glow that tracks the pointer, glossy sheen, grounded contact shadow, and a floating cyan accent — all gated by `useReducedMotion`. Softened the giant background wordmark (`text-ink/15`) so the navy mark reads in front. `npm run build` passes. **Note:** source `clix-logo.png` left in repo root; swap-ready if the mark changes.
- **2026-06-28 (v2 — SOHub clone)** — User feedback: v1 looked "ugly" and didn't match SOHub; instruction was to **clone SOHub first** and only fit the Clix content that belongs in its landing page (no force-merging all sections). Re-studied sohub.digital (light theme, minimal: Hero → Work → Services → "Don't be shy" CTA → Footer). Flipped the whole theme **dark → light "paper"** (new `@theme` tokens: paper surfaces, ink near-black, restrained violet/cyan accent, bigger fluid display type). Rebuilt: minimal **Navbar** (wordmark + chat pill + ink menu pill → full-screen ink overlay), **Hero** (giant `clix` wordmark + glossy obsidian render placeholder + bottom-start headline + scroll cue), **Work** (project grid, dark thumbnails on light), **Services** (SOHub 4-col with top rules + bullets — maps 1:1 to Clix's 4 services), **CTA** (ink band, two pills), **Footer** (minimal). Parked Stack/VoiceAI/WebMobile/Methodology/Testimonials/Training (kept on disk). `npm run build` passes. **Next:** real hero render + project images; revisit parked sections if wanted.
- **2026-06-28 (build)** — Built full v1: Tailwind v4 dark theme tokens (violet→cyan) + RTL base styles + Heebo; `src/data/content.ts` (all Hebrew copy); lib (`gsap`, `motion`) + hooks (`useLenis`); UI primitives (Reveal, Button, SectionHeading, Counter, Icon, Marquee, AmbientBackground); all 12 sections (Navbar, Hero, Stack, Services, VoiceAI, WebMobile, Work, Methodology, Testimonials, Training, CTA, Footer); GSAP scroll counters + pinned 4-step Methodology; Framer Motion mount/hover/mobile-menu; Lenis smooth scroll synced to GSAP; favicon + mock visuals. `npm run build` passes, `npm run dev` returns 200. **Next:** real assets/projects, email-domain confirm, install Superpowers.
- **2026-06-28 (setup)** — Scraped clixsolutions.info + analyzed sohub.digital. Scaffolded Vite + React + TS (configs, RTL `index.html`); installed deps. Wrote `CLAUDE.md` (skills auto-use policy + 2 workflow rules) and `CONTEXT.md`. Added local `gsap` skill; documented Superpowers `/plugin` install.
