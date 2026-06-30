# Hero Video — Higgsfield Prompt Pack

Animate the 6-frame storyboard of the dark metallic **Clix** mark into one dramatic,
luxurious hero loop in the style of **on.energy**. Slow camera, deep blacks, rim light.

**Decided:** the hero will be a **full-bleed cinematic background video** (dark grade),
Hebrew headline + CTA overlaid bottom-start (bottom-right in RTL) over a gradient scrim.
Build the React integration only **after** the video is generated & exported.

---

## How to run each shot in Higgsfield
1. **Image → Video (DoP)**, upload the storyboard frame as the **start frame**.
2. Select the named **camera preset** below.
3. Paste the **prompt** + the **style anchor** (append to every prompt).
4. **Motion = Low** (this is what makes it feel slow & expensive). 16:9, ~5s.
5. Backbone model: **Kling 2.5 / Veo 3** for reflective-metal fidelity. Seed-lock for retries, then upscale.

### Style anchor — append to EVERY prompt
```
— anamorphic lens, shallow depth of field, volumetric light beams, deep crushed blacks,
fine film grain, 24fps cinematic cadence, slow deliberate camera, ultra-detailed brushed-metal
reflections, luxury product commercial. No text warping, no morphing edges, no flicker, no extra logos.
```

---

## Shot 1 — Intro reveal · *top-left frame*
**Preset:** `Super Dolly In` (slow push) · **Pacing:** opening beat, use first 4s, ease-in from black.
```
Slow cinematic dolly push toward a dark brushed-metal emblem floating on a matte charcoal stage.
A single hard key light rakes across its beveled edges, catching one thin specular rim. Fine dust
drifts through a soft volumetric beam. The mark rotates almost imperceptibly toward the light.
Patient, premium, the first breath of a luxury film.
```

## Shot 2 — Power-on · *top-middle (gold "ON")*
**Preset:** `Dolly In` + Low Angle · **Pacing:** emotional peak, 4s.
> ⚠️ Don't bake the "ON" text into the AI gen (video models warp type). Add "ON" as a clean
> overlay in the edit, timed to the rim-light ignition.
```
Low, slow push toward the metal emblem resting above a rooftop of industrial power units at dusk.
Warm amber rim light ignites along its edges as if powering on; faint heat shimmer rises from the
machines behind. Golden-hour haze, long shadows, controlled and dramatic — the moment the system wakes.
```

## Shot 3 — Engineered context · *top-right (silver/industrial)*
**Preset:** `Arc Right` (slow partial orbit) · **Pacing:** 4s, contrasts the pushes either side.
```
Slow lateral arc around the emblem suspended before heavy steel machinery in a bright industrial hall.
Cool silver light, polished reflections sliding across its faces as the camera glides. Sharp specular
highlights, soft background bokeh of pipes and rollers. Engineered, precise, high-end.
```

## Shot 4 — Monumental float · *bottom-left (low angle)*
**Preset:** `Crane Up` · **Pacing:** 4s, vertical move adds scale variety.
```
Camera cranes slowly upward past the floating dark emblem against a twilight building edge. The mark
hangs weightless, rim-lit in cold blue, rotating a few degrees. Atmospheric haze, distant city glow,
the lens gently breathing. Monumental, quiet, luxurious scale.
```

## Shot 5 — The core · *bottom-middle (macro spark)*
**Preset:** `Super Dolly In` (macro / push-to-center) · **Pacing:** 3–4s, the "wow" detail beat.
```
Extreme macro push into the heart of the emblem where a bright spark of energy blooms and swirls.
Filaments of light unfurl from the core and refract through brushed-metal channels. Sparkling
particulate, electric blue-white glow against deep shadow. Slow, hypnotic, powerful — the energy within.
```

## Shot 6 — Brand lockup + loop · *bottom-right (wall mount)*
**Preset:** `Super Dolly Out` (slow reveal / settle) · **Pacing:** 4s.
> Design this to cross-dissolve back into Shot 1 so the hero loop is seamless.
```
Slow pull back from the emblem mounted on a dark louvered industrial wall, easing into a centered hero
composition. Even moody key light, soft vignette, fine dust in the air. The mark holds still and confident
as the camera comes to rest. Clean, premium, brand-defining final frame.
```

---

## Assembly → one hero loop
- **Order:** 1 → 2 → 3 → 4 → 5 → 6 → (dissolve back to 1). Trim each to ~4s → **~24s loop**.
- **Transitions:** 0.5–0.8s slow cross-dissolves (no hard cuts).
- **Grade:** unify all six to one LUT (cold steel + warm "ON" accent). Crush blacks, lift rim highlights.
- **"ON" overlay:** add in the editor over Shot 2, fading in with the amber rim.

## Framing for the full-bleed RTL hero
- Master **16:9**, subject **centered / slightly high** — keep the **bottom-start (bottom-right in RTL)** corner
  quiet & dark; that's where the Hebrew headline + CTA + scrim sit.
- Hero uses `object-cover` → extreme left/right edges get cropped on wide screens. No critical detail at the edges.
- Keep the loop **dark-dominant** so white overlay text stays readable.
- Optional: also export a **9:16** crop of Shots 1, 5, 6 for mobile (otherwise a tall phone hero zooms in hard).

## Export specs (for the web hero)
- `1920×1080`, **MP4 (H.264) + WebM (VP9)**, target **< 8 MB**.
- A **poster JPG** (Shot 1 first frame) — also the `prefers-reduced-motion` fallback.
- Playback will be **muted + loop + autoplay + playsInline**.
- Drop files into `public/` (e.g. `public/hero.mp4`, `public/hero.webm`, `public/hero-poster.jpg`).
