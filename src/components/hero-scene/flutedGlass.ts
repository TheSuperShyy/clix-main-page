import { Effect, BlendFunction } from "postprocessing";
import * as THREE from "three";

/**
 * Fluted (reeded) glass post effect — our own implementation of the classic
 * technique: the left portion of the frame is divided into narrow vertical
 * flutes, and each flute refracts the scene like a cylindrical lens, slicing
 * whatever is behind it into offset ribbons.
 *
 * The effect is ALWAYS ON: the ref keeps its intensity at a static 0.5 (no
 * timeline track animates it), so the flutes are fully visible from the hero
 * to the final frame. Intensity stays a uniform (default 0.5 = full strength
 * through the shader's ease window) in case we ever want to fade it.
 *
 * Flute width is aspect-scaled (density is per aspect-corrected unit, like the
 * ref) — call setSize so wide viewports get proportionally more flutes.
 *
 * (Clean-room rewrite — the reference site's shader text is third-party and
 * never shipped; only the generic technique and our tuning live here.)
 */

const FRAGMENT = /* glsl */ `
uniform sampler2D uSceneTex;
uniform float uProgress;
uniform float uDensity;
uniform float uCoverage;
uniform float uRefraction;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  // progress window: ease in 0→0.2, hold, ease out 0.8→1
  float w = smoothstep(0.0, 0.2, uProgress) * (1.0 - smoothstep(0.8, 1.0, uProgress));
  if (uProgress >= 0.999 || w <= 0.001) {
    outputColor = inputColor;
    return;
  }

  // fluted region: from the left edge up to uCoverage of the frame width
  float region = 1.0 - smoothstep(uCoverage - 0.0015, uCoverage + 0.0015, uv.x);
  if (region <= 0.0) {
    outputColor = inputColor;
    return;
  }

  // flute-local coordinate, -1 … 1 across each flute (uDensity flutes span
  // the covered region, not the whole frame)
  float stripW = uCoverage / uDensity;
  float local = fract(uv.x / stripW) * 2.0 - 1.0;

  // linear cylindrical lens: with the refraction exceeding the half-flute
  // width, each flute shows a flipped, slightly compressed copy of what's
  // behind it — the classic reeded-glass slicing
  vec2 ruv = vec2(uv.x + uRefraction * local * w, uv.y);
  vec3 refracted = texture2D(uSceneTex, ruv).rgb;

  // darken the outer fifth of each flute so the ribs read as glass slats
  refracted *= 1.0 - 0.3 * smoothstep(0.8, 1.0, abs(local)) * w;

  outputColor = vec4(mix(inputColor.rgb, refracted, region * w), inputColor.a);
}
`;

export class FlutedGlassEffect extends Effect {
  private progressUniform: THREE.Uniform<number>;
  private baseDensity: number;
  private coverage: number;

  constructor({ density = 22, coverage = 0.5, refraction = -0.025 } = {}) {
    const uniforms = new Map<string, THREE.Uniform>([
      ["uSceneTex", new THREE.Uniform(null)],
      ["uProgress", new THREE.Uniform(0.5)], // static, always-on (ref behavior)
      ["uDensity", new THREE.Uniform(density * coverage)],
      ["uCoverage", new THREE.Uniform(coverage)],
      ["uRefraction", new THREE.Uniform(refraction)],
    ]);
    super("FlutedGlassEffect", FRAGMENT, { blendFunction: BlendFunction.NORMAL, uniforms });
    this.progressUniform = uniforms.get("uProgress") as THREE.Uniform<number>;
    this.baseDensity = density;
    this.coverage = coverage;
  }

  /** Effect intensity 0–1 (0.5 = full strength through the ease window). */
  set progress(p: number) {
    this.progressUniform.value = p;
  }

  /** Density is per aspect-corrected unit — flutes keep their physical width. */
  override setSize(width: number, height: number) {
    (this.uniforms.get("uDensity") as THREE.Uniform<number>).value =
      this.baseDensity * (width / height) * this.coverage;
  }

  override update(_renderer: THREE.WebGLRenderer, inputBuffer: THREE.WebGLRenderTarget) {
    // the lens samples the scene at offset UVs, so it needs the buffer itself
    (this.uniforms.get("uSceneTex") as THREE.Uniform).value = inputBuffer.texture;
  }
}
