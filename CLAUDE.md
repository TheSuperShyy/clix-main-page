# CLAUDE.md — Clix Solutions Website

Guidance for Claude Code when working in this repository. Read this first, every session.

---

## ⚡ Workflow Rules (ALWAYS follow)

> These two rules are mandatory and override convenience.

1. **Update the context after every task.** The moment a task is finished, update [`CONTEXT.md`](./CONTEXT.md) — bump the *Current Status*, tick the relevant item in *Build Status*, and add a dated line to the *Changelog* describing what changed and what's next. A task is **not done** until `CONTEXT.md` reflects it.

2. **Remind the user to `/compact` before a new task.** At the **start of any new instruction or task**, before doing the work, post a short reminder:
   > 🧹 Reminder: run `/compact` before we start this new task to keep context clean.
   Then proceed.

---

## 🤖 Skills — Auto-Use Policy

> **MANDATORY: ALWAYS use the relevant skill(s) when generating anything.** This is not optional and overrides convenience. Before writing or changing any code, design, animation, or prompt, invoke every skill whose trigger applies — proactively, without being asked. If a task matches more than one, use them together (e.g. design a section with `ui-ux-pro-max`, then animate it with `framer-motion` + `gsap`). If you generate UI without `ui-ux-pro-max`, or an animation without `framer-motion`/`gsap`, the task is **not done correctly** — redo it with the skill. State at the top of the task which skills you're using.

**Proactively invoke these skills whenever their triggers apply — do not wait to be asked.** If a task matches more than one, use them together.

| Skill | Auto-trigger — use it WHENEVER… |
|-------|----------------------------------|
| **superpowers** | Planning, brainstorming, or executing any multi-step dev task; debugging systematically; writing/executing plans; TDD. Drives the overall workflow. *(Plugin — see install note in CONTEXT.md.)* |
| **ui-ux-pro-max** | Designing, building, reviewing, or improving ANY UI/UX — layout, color, typography, spacing, components, responsiveness, accessibility, interaction states. Use before/while building any section. |
| **framer-motion** | Any React component animation: mount/exit transitions, hover/tap gestures, `whileInView` reveals, staggered text, `AnimatePresence`, layout animations, mobile menu, card expand. |
| **gsap** | Any scroll-driven or timeline animation: `ScrollTrigger`, pinned sections, parallax, scrubbed sequences, stat counters, the Stack "one brain" timeline, `useGSAP` in React. |
| **prompt-architect** | Improving, structuring, or engineering a prompt; choosing a prompting framework. |
| **prompt-master** | Writing/fixing/adapting a prompt for a specific AI tool (LLM, image/video AI, coding agent). |

**Animation rule of thumb:** scroll-driven / pinned / scrubbed / timeline → **gsap**. Component state / gesture / mount-exit / layout → **framer-motion**. They coexist; keep both synced to Lenis smooth scroll.

---

## 📦 Project Overview

Marketing website for **Clix Solutions** — a Tel Aviv AI-engineering agency. Hebrew, **RTL**, single long-scroll landing page. **Clean, light, corporate-tech aesthetic inspired by [on.energy](https://www.on.energy/)** — white space, cool near-black type, a restrained **blue/teal** accent, photography-forward, minimal motion. Rebuilt with Clix's real content from [clixsolutions.info](https://www.clixsolutions.info/). Redesign lives in the **clix-main-page** repo (the prior SOHub version is archived in `clixsolutions`).

**Repo (origin):** [`clix-main-page`](https://github.com/TheSuperShyy/clix-main-page) — the active repo for this redesign. The prior SOHub build is archived at [`clixsolutions`](https://github.com/TheSuperShyy/clixsolutions).

See [`CONTEXT.md`](./CONTEXT.md) for the full content scrape, design notes, decisions, and build status.

## 🛠 Tech Stack

- **Vite + React 19 + TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite`; theme tokens in `src/styles/index.css`)
- **Motion** (Framer Motion) — `import { motion } from "motion/react"`
- **GSAP** + `@gsap/react` (`useGSAP`) — registered in `src/lib/gsap.ts`
- **Lenis** — global smooth scroll, synced to GSAP ScrollTrigger
- **Font:** Heebo (Hebrew), loaded in `index.html`

## ▶️ Commands

```bash
npm install      # install deps
npm run dev      # dev server (http://localhost:5173)
npm run build    # type-check + production build
npm run preview  # preview the build
```

## 📁 Structure

```
index.html                 # <html lang="he" dir="rtl">
src/
  main.tsx, App.tsx
  styles/index.css         # Tailwind + theme tokens + base styles
  data/content.ts          # ⭐ ALL Hebrew copy — single source of truth, edit here
  lib/        gsap.ts (plugin registration), motion.ts (shared variants)
  hooks/      useLenis.ts, useReveal.ts
  components/  Navbar, Hero, Stack, Services, VoiceAI, WebMobile,
               Work, Methodology, Testimonials, Training, CTA, Footer
  components/ui/  Button, Card, SectionHeading, Stat, Reveal, ...
public/                    # placeholder assets (swap for real brand assets later)
```

## 📐 Conventions

- **RTL first.** `dir="rtl"` is on `<html>`. Use Tailwind **logical** utilities (`ps-/pe-`, `ms-/me-`, `start-/end-`, `text-start/text-end`) — never hard-coded `left/right`. Test that layouts mirror correctly.
- **Hebrew copy lives in `src/data/content.ts` only.** Components import strings from there — don't hard-code Hebrew text in JSX. This keeps copy editable in one place.
- **One component per section**, composed in `App.tsx` in page order.
- **Theme tokens** — clean light palette (`bg`, `surface`, `border`, `fg`, `muted`, `brand` = blue, `cyan` = teal, `ink`/`on-ink` for dark bands) defined in `src/styles/index.css`. Use the tokens, don't invent hex values inline.
- **Respect `prefers-reduced-motion`** in every animation.
- **Placeholders** are intentional (gradients, mock dashboards, sample projects). Keep them swappable; don't hardwire fake data into logic.

---

## ✅ Definition of Done (per task)

1. Code works (`npm run dev` clean, no console errors; `npm run build` passes).
2. RTL + Hebrew render correctly; responsive at mobile/tablet/desktop.
3. Relevant skills were used (design via `ui-ux-pro-max`, animation via `gsap`/`framer-motion`).
4. **`CONTEXT.md` updated** (Rule 1).
