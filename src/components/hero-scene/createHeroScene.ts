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
import { buildHeroScene, data } from "./buildScene";
import { Timeline } from "./timeline";
import { FlutedGlassEffect } from "./flutedGlass";
import { SEQ_END } from "./constants";

/**
 * The hero background engine: builds the scene, the post chain and the scroll
 * timeline, and exposes a tiny imperative API the React wrapper drives.
 *
 * Values (bloom/vignette/tone-mapping/…) match the lab build that the client
 * approved; the scroll sequence is sampled 0 → SEQ_END across the hero region
 * ("stop at scrub 52% thats the final stop").
 */

// Transmission ("glass") makes three render the scene an extra time per frame
// at full canvas resolution, so pixel ratio is the #1 cost lever. Dispersion
// triples the transmission taps — only enabled on the high tier.
type Quality = "low" | "med" | "high";

export interface HeroSceneHandle {
  /** Render one frame at scroll progress 0–1 (dt in seconds). */
  render(progress: number, dt: number): void;
  setSize(width: number, height: number): void;
  /** Pointer position normalized to -1…1 for the subtle camera tilt. */
  setPointer(nx: number, ny: number): void;
  dispose(): void;
}

export function createHeroScene(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
): HeroSceneHandle {
  const built = buildHeroScene(width / height);
  const { scene, camera } = built;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false, // SMAA runs in the post chain
    stencil: false,
    depth: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(width, height, false);
  renderer.toneMapping = THREE.NoToneMapping; // tone mapping lives in the post chain
  // Calibrated against the reference render (the ref engine applies a gain its
  // export doesn't carry): 1.8 matches its measured output within ±2 RGB across
  // hero / services / finale — see CONTEXT.md v6.17.3. Exposure feeds the ACES
  // tone-mapping effect in the post chain.
  renderer.toneMappingExposure = 1.8;

  const bloom = new BloomEffect({
    intensity: 0.6,
    radius: 0.46,
    luminanceThreshold: 0.9,
    luminanceSmoothing: 0.02849,
    blendFunction: BlendFunction.ADD,
    mipmapBlur: true,
  });
  const vignette = new VignetteEffect({
    offset: 0.2048,
    darkness: 1,
    blendFunction: BlendFunction.NORMAL,
  });
  vignette.blendMode.opacity.value = 0.5;
  const toneMapping = new ToneMappingEffect({
    mode: 6 as ToneMappingMode,
    whitePoint: 6.8,
    middleGrey: 0.17,
    averageLuminance: 0.02,
  });
  const hueSat = new HueSaturationEffect({
    hue: 0,
    saturation: -0.3,
    blendFunction: BlendFunction.NORMAL,
  });
  const noise = new NoiseEffect({ blendFunction: 29 as BlendFunction });
  noise.blendMode.opacity.value = 0.2;
  const smaa = new SMAAEffect({ preset: 2 as SMAAPreset });
  const fluted = new FlutedGlassEffect();

  const composer = new EffectComposer(renderer, { frameBufferType: THREE.HalfFloatType });
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new EffectPass(camera, smaa, bloom, vignette, toneMapping, hueSat, noise));
  composer.addPass(new EffectPass(camera, fluted));

  const timeline = new Timeline(data.tracks, built.targets);

  let w = width;
  let h = height;
  const applyQuality = (q: Quality) => {
    // dpr scales with the device's PHYSICAL pixel ratio (capped per tier), not
    // an absolute value. A phone at devicePixelRatio 2–3 previously rendered
    // the scene at dpr 1 (~⅓ of its real resolution) then upscaled it → the
    // ball/glass looked pixelated. Now high-DPR screens render near their true
    // resolution like the desktop does; the caps + adaptive downgrade keep the
    // (expensive) transmission glass affordable. Desktop (dpr 1) is unchanged.
    const cap = q === "low" ? 1 : q === "med" ? 1.5 : 2;
    const dpr = Math.min(window.devicePixelRatio || 1, cap);
    renderer.setPixelRatio(dpr);
    composer.setSize(w, h);
    // High tier restores each material's REFERENCE dispersion (coins 1,
    // fullscreen Background plane 0) — forcing 1 everywhere tripled the
    // transmission taps on ~every pixel for a fringe the ref doesn't have.
    for (const m of built.materials)
      m.dispersion = q === "high" ? ((m.userData.refDispersion as number) ?? 0) : 0;
  };

  // Full quality on every device (per user): always the TOP tier — dispersion
  // on, dpr up to 2 — and NO adaptive downgrade, so mobile renders the same as
  // the PC instead of dropping to a lower tier when the frame rate dips. (The
  // idle throttle in render() still rests the GPU when nothing is moving.)
  applyQuality("high");

  // Subtle camera tilt toward the pointer (±1°, eased) — layered on top of the
  // keyframed camera state each frame.
  const tiltTarget = { x: 0, y: 0 };
  let lastProgress = -1;
  let idleFor = 0;
  let frameNo = 0;

  return {
    render(progress, dt) {
      frameNo++;
      const p = Math.min(1, Math.max(0, progress));

      const tiltMoving =
        Math.abs(tiltTarget.x - camera.rotation.x) + Math.abs(tiltTarget.y - camera.rotation.y) >
        1e-4;
      if (p !== lastProgress || tiltMoving) {
        lastProgress = p;
        idleFor = 0;
      } else {
        idleFor += dt;
      }
      // Idle throttle: nothing is changing → render at ~1/4 rate so the GPU
      // rests; full rate resumes instantly on scroll or pointer move.
      if (idleFor > 0.25 && frameNo % 4 !== 0) return;

      // fluted glass is static (always on, ref behavior) — only the timeline scrubs
      timeline.sample(p * SEQ_END);
      camera.rotation.x += (tiltTarget.x - camera.rotation.x) * Math.min(1, dt * 3);
      camera.rotation.y += (tiltTarget.y - camera.rotation.y) * Math.min(1, dt * 3);
      composer.render(dt);
    },

    setSize(width, height) {
      w = width;
      h = height;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      composer.setSize(w, h);
    },

    setPointer(nx, ny) {
      tiltTarget.x = -ny * built.tiltMax.x;
      tiltTarget.y = -nx * built.tiltMax.y;
    },

    dispose() {
      composer.dispose();
      built.dispose();
      renderer.dispose();
    },
  };
}
