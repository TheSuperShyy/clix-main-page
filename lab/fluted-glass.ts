/**
 * fluted-glass — wrapper for the reference's CUSTOM_EFFECT post shader.
 *
 * The GLSL itself is NOT in this file: it ships inside lab/data/scene.json
 * (gitignored third-party reference content) and is passed in at runtime.
 * This class only adapts it to the `postprocessing` Effect API:
 *  - builds the uniform map from the JSON definition,
 *  - feeds the previous frame into `uPreviousFrame` each pass,
 *  - exposes `progress` (the reference's `e0E0E0Intensity`) for scroll scrub.
 */
import { Effect, BlendFunction } from "postprocessing";
import * as THREE from "three";

interface UniformDef {
  name: string;
  dataType: string;
  value: number | { x: number; y: number };
}

export interface CustomEffectDef {
  name: string;
  blendFunction: number;
  uniforms: Record<string, UniformDef>;
  fragmentShader: string;
}

export class FlutedGlassEffect extends Effect {
  private progressUniform: THREE.Uniform<number>;
  private resolutionUniform: THREE.Uniform<THREE.Vector2>;

  constructor(def: CustomEffectDef) {
    const uniforms = new Map<string, THREE.Uniform>();
    for (const u of Object.values(def.uniforms)) {
      uniforms.set(
        u.name,
        u.dataType === "vec2"
          ? new THREE.Uniform(new THREE.Vector2((u.value as { x: number }).x, (u.value as { y: number }).y))
          : new THREE.Uniform(u.value as number),
      );
    }
    uniforms.set("uPreviousFrame", new THREE.Uniform(null));
    uniforms.set("uTime", new THREE.Uniform(0));

    super(def.name ?? "FlutedGlass", def.fragmentShader, {
      blendFunction: def.blendFunction as BlendFunction,
      uniforms,
    });

    this.progressUniform = uniforms.get("e0E0E0Intensity") as THREE.Uniform<number>;
    this.resolutionUniform = uniforms.get("uResolution") as THREE.Uniform<THREE.Vector2>;
  }

  /** Scroll progress 0–1 — the shader windows itself via smoothstep(0,0.2)…(0.8,1). */
  set progress(p: number) {
    this.progressUniform.value = p;
  }

  override update(_renderer: THREE.WebGLRenderer, inputBuffer: THREE.WebGLRenderTarget, deltaTime?: number) {
    (this.uniforms.get("uPreviousFrame") as THREE.Uniform).value = inputBuffer.texture;
    (this.uniforms.get("uTime") as THREE.Uniform<number>).value += deltaTime ?? 0;
  }

  override setSize(width: number, height: number) {
    this.resolutionUniform.value.set(width, height);
  }
}
