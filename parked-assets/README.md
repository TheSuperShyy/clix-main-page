# Parked assets

Media used only by **parked components** (not on the live page). Everything in
`public/` ships verbatim into `dist/` on every build — these were moved here so
the deploy doesn't carry ~18MB of unused files.

| Asset | Belongs to (parked) |
|---|---|
| `reveal/` (145 frames) | `ScrollReveal.tsx` |
| `voice/` | `VoiceAI.tsx` |
| `workflow-montage.mp4` + `workflow-poster.jpg` | `ManagedAI.tsx`, `ZoomReveal.tsx` |
| `clix-logo.png`, `clix-logo-3d.webp` | `HeroLogo3D` / `HeroLogoImage` / `HeroLogoModel` / `Integrations` |
| `founder.jpeg`, `team-*.jpeg` | full-size team photos (small `.webp` versions live in `public/avatars/`) |
| `hero-scene-web.mp4` | old video-hero approach — superseded by the live WebGL scene |

**Reviving a parked component?** Move its media back into `public/` (paths in
the components point at `/…` public URLs) — and re-add Heebo weights 800/900 in
`index.html` if it uses `font-extrabold` / `font-black`.
