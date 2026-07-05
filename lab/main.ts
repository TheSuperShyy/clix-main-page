/**
 * Scene Lab — rebuilds the reference hero background as a real three.js scene,
 * scrubbed by scroll. Isolated from the production site (own Vite root, own
 * dev server: `npm run lab` → http://localhost:5174).
 *
 * Pipeline: scene.json (exact reference data, gitignored) → scene-builder →
 * Timeline sampler → postprocessing chain (same effects/values as the
 * reference) → scroll progress drives everything.
 */
import * as THREE from "three";
import {
  EffectComposer,
  RenderPass,
  EffectPass,
  SMAAEffect,
  SMAAPreset,
  BloomEffect,
  VignetteEffect,
  ToneMappingEffect,
  HueSaturationEffect,
  NoiseEffect,
  BlendFunction,
  ToneMappingMode,
} from "postprocessing";
import { buildScene, type SceneState } from "./scene-builder";
import { Timeline } from "./timeline";
import { FlutedGlassEffect, type CustomEffectDef } from "./fluted-glass";

const canvas = document.getElementById("scene") as HTMLCanvasElement;
const progressEl = document.getElementById("progress")!;
const statusEl = document.getElementById("status")!;
const jumpsEl = document.getElementById("jumps")!;

async function boot() {
  const state: SceneState = await (await fetch("./data/scene.json")).json();
  const es = state.engineState;

  const built = buildScene(state, window.innerWidth / window.innerHeight);
  const { scene, camera, mixers } = built;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false, // SMAA runs in the post chain
    stencil: false,
    depth: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.NoToneMapping; // tone mapping lives in the post chain

  // ── Post-processing chain — enabled effects + order straight from the JSON ──
  const fx = es.effects as Record<string, any>;
  const bloom = new BloomEffect({
    intensity: fx.BLOOM.intensity,
    radius: fx.BLOOM.radius,
    luminanceThreshold: fx.BLOOM.luminanceThreshold,
    luminanceSmoothing: fx.BLOOM.luminanceSmoothing,
    blendFunction: fx.BLOOM.blendFunction as BlendFunction,
    mipmapBlur: true,
  });
  const vignette = new VignetteEffect({
    offset: fx.VIGNETTE.offset,
    darkness: fx.VIGNETTE.darkness,
    blendFunction: fx.VIGNETTE.blendFunction as BlendFunction,
  });
  vignette.blendMode.opacity.value = fx.VIGNETTE.opacity;
  const toneMapping = new ToneMappingEffect({
    mode: Number(fx.TONE_MAPPING.mode) as ToneMappingMode,
    whitePoint: fx.TONE_MAPPING.whitePoint,
    middleGrey: fx.TONE_MAPPING.middleGrey,
    averageLuminance: fx.TONE_MAPPING.averageLuminance,
  });
  const hueSat = new HueSaturationEffect({
    hue: fx.HUE_SATURATION.hue,
    saturation: fx.HUE_SATURATION.saturation,
    blendFunction: fx.HUE_SATURATION.blendFunction as BlendFunction,
  });
  const noise = new NoiseEffect({ blendFunction: fx.NOISE.blendFunction as BlendFunction });
  noise.blendMode.opacity.value = fx.NOISE.opacity;
  const smaa = new SMAAEffect({ preset: fx.SMAA.preset as SMAAPreset });

  const customId = es.effectsOrder.find((k) => fx[k]?.type === "CUSTOM_EFFECT");
  const fluted = customId ? new FlutedGlassEffect(fx[customId] as CustomEffectDef) : null;

  const composer = new EffectComposer(renderer, { frameBufferType: THREE.HalfFloatType });
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new EffectPass(camera, smaa, bloom, vignette, toneMapping, hueSat, noise));
  if (fluted) composer.addPass(new EffectPass(camera, fluted));

  // Full page scroll covers sequence 0 → SEQ_END, per user ("stop at scrub 52%
  // thats the final stop") — the reference's keyframes all end by 0.499, so
  // this also keeps the fluted glass from fading out (its shader window only
  // closes past 0.8) and makes the whole runway cover the real animation.
  const SEQ_END = 0.52;

  // ── Timeline (the scroll-scrubbed animation) ──
  const sheet = Object.values(state.animations.sheetsById)[0];
  // The export animates one GLB-internal material clone (`339fa16b…`) that it
  // never describes — it's the giant "Three Coin" shape's glass, fading the
  // shape in at seq 0.47→0.50 (the arc in storyboard frames 9+). Alias it to
  // the shape's authored material (which starts at opacity 0) so that fade
  // lands somewhere; it registers after the static track, so it wins.
  const threeCoinMat = built.materialsById.get("25ba203d-f8ba-4a6a-bd18-c148a5268770");
  if (threeCoinMat) built.materialsById.set("339fa16b-f0d4-4551-9ed6-3a35287ebf70", threeCoinMat);
  const timeline = new Timeline(sheet, built.objectsById, built.materialsById);
  // Debug handle for headless inspection scripts (geometry probing etc.).
  (window as unknown as Record<string, unknown>).__built = built;
  statusEl.textContent = `tracks: ${timeline.trackCount} · loading models…`;
  built.glbReady.then(() => (statusEl.textContent = `tracks: ${timeline.trackCount} · ready`));

  // ── Quality control ──
  // Transmission (the glass look) makes three render the scene an extra time
  // per frame at full canvas resolution, so pixel ratio is the #1 cost lever.
  // Dispersion triples the transmission texture taps — off except on High.
  type Quality = "low" | "med" | "high";
  const applyQuality = (q: Quality) => {
    const dpr = q === "low" ? 0.65 : q === "med" ? 1 : Math.min(window.devicePixelRatio, 1.5);
    renderer.setPixelRatio(dpr);
    composer.setSize(window.innerWidth, window.innerHeight);
    for (const mat of built.materialsById.values()) {
      const m = mat as THREE.MeshPhysicalMaterial;
      if ("dispersion" in m) m.dispersion = q === "high" ? 1 : 0;
    }
    document.querySelectorAll<HTMLButtonElement>("#jumps button[data-q]").forEach((b) => {
      b.style.background = b.dataset.q === q ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.08)";
    });
  };

  // ── Scroll → progress ──
  let progress = 0;
  const readScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  };
  window.addEventListener("scroll", readScroll, { passive: true });
  readScroll();

  // Jump buttons: one per storyboard frame (1–16 across the full timeline).
  for (let i = 1; i <= 16; i++) {
    const b = document.createElement("button");
    b.textContent = String(i);
    b.title = `storyboard frame ${i}`;
    b.addEventListener("click", () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: (max * (i - 1)) / 15, behavior: "instant" as ScrollBehavior });
    });
    jumpsEl.appendChild(b);
  }
  for (const q of ["low", "med", "high"] as const) {
    const b = document.createElement("button");
    b.textContent = q.toUpperCase();
    b.dataset.q = q;
    b.title = `render quality: ${q}`;
    b.addEventListener("click", () => applyQuality(q));
    jumpsEl.appendChild(b);
  }

  // ── Mouse tilt (reference camera "TILT" controls: ±1°, eased) ──
  const tiltTarget = { x: 0, y: 0 };
  window.addEventListener("pointermove", (e) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    tiltTarget.x = -ny * built.tiltMax.x;
    tiltTarget.y = -nx * built.tiltMax.y;
  });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    composer.setSize(window.innerWidth, window.innerHeight);
    readScroll();
  });

  applyQuality("low"); // default to the fast tier — LOW/MED/HIGH buttons in the HUD

  // Show which GPU the browser picked — on dual-GPU laptops Chrome often lands
  // on the integrated chip, which makes this scene feel heavy.
  const dbg = renderer.getContext().getExtension("WEBGL_debug_renderer_info");
  if (dbg) {
    const gpu = renderer.getContext().getParameter(dbg.UNMASKED_RENDERER_WEBGL) as string;
    const el = document.createElement("div");
    el.style.cssText = "max-width:260px;margin-top:4px;opacity:.7";
    el.textContent = `gpu: ${gpu}`;
    document.getElementById("hud")!.appendChild(el);
  }

  const clock = new THREE.Clock();
  let lastProgress = -1;
  let idleSince = 0;
  let frameNo = 0;
  let fpsAccum = 0;
  let fpsCount = 0;
  let fpsShown = 0;
  renderer.setAnimationLoop((time) => {
    const dt = clock.getDelta();
    frameNo++;

    // Idle throttle: when the scene state isn't changing, render at ~1/4 rate
    // so the GPU (and fans) rest — full rate resumes instantly on scroll/tilt.
    const tiltMoving =
      Math.abs(tiltTarget.x - camera.rotation.x) + Math.abs(tiltTarget.y - camera.rotation.y) > 1e-4;
    if (progress !== lastProgress || tiltMoving) {
      lastProgress = progress;
      idleSince = time;
    }
    const idle = time - idleSince > 250;
    if (idle && frameNo % 4 !== 0) return;

    timeline.sample(progress * SEQ_END);
    if (fluted) fluted.progress = progress * SEQ_END;
    for (const m of mixers) m.update(dt);
    // Tilt is applied after the timeline so it layers on top of keyframed state.
    camera.rotation.x += (tiltTarget.x - camera.rotation.x) * Math.min(1, dt * 3);
    camera.rotation.y += (tiltTarget.y - camera.rotation.y) * Math.min(1, dt * 3);
    composer.render(dt);

    // FPS readout (only meaningful while active, so skip idle frames).
    if (!idle && dt > 0) {
      fpsAccum += 1 / dt;
      fpsCount++;
      if (fpsCount >= 20) {
        fpsShown = Math.round(fpsAccum / fpsCount);
        fpsAccum = 0;
        fpsCount = 0;
      }
    }
    progressEl.textContent = `${(progress * 100).toFixed(1)}%`;
    statusEl.textContent = `tracks: ${timeline.trackCount} · ${idle ? "idle" : `${fpsShown} fps`}`;
  });
}

boot().catch((err) => {
  console.error(err);
  statusEl.textContent = `boot failed: ${err.message}`;
});
