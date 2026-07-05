import * as THREE from "three";
import type { Keyframe, TrackDef } from "./buildScene";

/**
 * Samples the scroll keyframe timeline (scene-data.json tracks) at a progress
 * value 0–1 and writes the values onto the live three.js objects/materials.
 *
 * Easing between keyframes A→B is a CSS-style cubic bezier with control
 * points (A.h[2], A.h[3]) and (B.h[0], B.h[1]); `step: true` holds A's value.
 */

type ColorValue = { r: number; g: number; b: number; a?: number };
type Target = THREE.Object3D | THREE.Material;

// ---- cubic bezier y(x), CSS-timing-function style ----
function cubicBezierAt(x1: number, y1: number, x2: number, y2: number, x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  // Newton–Raphson on the x polynomial, fall back to bisection.
  const cx = 3 * x1,
    bx = 3 * (x2 - x1) - cx,
    ax = 1 - cx - bx;
  const cy = 3 * y1,
    by = 3 * (y2 - y1) - cy,
    ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleDX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  let t = x;
  for (let i = 0; i < 8; i++) {
    const dx = sampleX(t) - x;
    if (Math.abs(dx) < 1e-6) return sampleY(t);
    const d = sampleDX(t);
    if (Math.abs(d) < 1e-6) break;
    t -= dx / d;
  }
  let lo = 0,
    hi = 1;
  t = x;
  while (hi - lo > 1e-6) {
    if (sampleX(t) < x) lo = t;
    else hi = t;
    t = (lo + hi) / 2;
  }
  return sampleY(t);
}

const isColor = (v: Keyframe["v"]): v is ColorValue =>
  typeof v === "object" && v !== null && "r" in v;

class TrackSampler {
  constructor(
    private kfs: Keyframe[],
    private apply: (v: number | ColorValue) => void,
  ) {}

  sample(p: number) {
    const kfs = this.kfs;
    if (!kfs.length) return;
    if (p <= kfs[0].p) return this.apply(kfs[0].v);
    if (p >= kfs[kfs.length - 1].p) return this.apply(kfs[kfs.length - 1].v);
    let i = 0;
    while (i < kfs.length - 1 && kfs[i + 1].p <= p) i++;
    const a = kfs[i],
      b = kfs[i + 1];
    if (a.step) return this.apply(a.v); // step hold
    const span = b.p - a.p || 1;
    const x = (p - a.p) / span;
    const y = cubicBezierAt(a.h[2], a.h[3], b.h[0], b.h[1], x);
    if (isColor(a.v) && isColor(b.v)) {
      this.apply({
        r: a.v.r + (b.v.r - a.v.r) * y,
        g: a.v.g + (b.v.g - a.v.g) * y,
        b: a.v.b + (b.v.b - a.v.b) * y,
      });
    } else if (typeof a.v === "number" && typeof b.v === "number") {
      this.apply(a.v + (b.v - a.v) * y);
    } else {
      this.apply(a.v); // mixed types — hold
    }
  }
}

/** Builds a setter for one prop path (e.g. ["position","x"], ["opacity"], ["color"]). */
function makeApplier(target: Target, path: string[]): ((v: number | ColorValue) => void) | null {
  const rec = target as unknown as Record<string, unknown>;
  if (path.length === 2) {
    const outer = rec[path[0]];
    if (outer && typeof outer === "object") {
      const vec = outer as unknown as Record<string, number>;
      const key = path[1];
      return (v) => {
        if (typeof v === "number") vec[key] = v;
      };
    }
    return null;
  }
  const key = path[0];
  const current = rec[key];
  if (current instanceof THREE.Color) {
    return (v) => {
      if (isColor(v)) current.setRGB(v.r, v.g, v.b);
    };
  }
  return (v) => {
    if (typeof v === "number") rec[key] = v;
  };
}

export class Timeline {
  private samplers: TrackSampler[] = [];

  constructor(tracks: TrackDef[], targets: Map<string, Target>) {
    for (const track of tracks) {
      const target = targets.get(track.target);
      if (!target) {
        if (import.meta.env.DEV) console.warn("[hero-scene] timeline target missing:", track.target);
        continue;
      }
      const apply = makeApplier(target, track.path);
      if (!apply) continue;
      this.samplers.push(new TrackSampler(track.keyframes, apply));
    }
  }

  get trackCount() {
    return this.samplers.length;
  }

  /** Apply the whole timeline state for scroll progress p (0–1). */
  sample(p: number) {
    for (const s of this.samplers) s.sample(p);
  }
}
