/**
 * timeline — samples the Theatre.js-style keyframe sequence in the scene JSON
 * at an arbitrary scroll progress (0–1) and writes the values onto the live
 * three.js objects/materials.
 *
 * Keyframe easing: for a segment A→B the curve is a CSS-style cubic bezier
 * with control points (A.handles[2], A.handles[3]) and (B.handles[0],
 * B.handles[1]) — Theatre.js convention. `connectedRight:false` = step hold.
 */
import * as THREE from "three";
import type { AnimationSheet, Keyframe, TracksForObject } from "./scene-builder";

type ColorValue = { r: number; g: number; b: number; a?: number };
type Target = THREE.Object3D | THREE.Material;

// ---- cubic bezier y(x), CSS-timing-function style ----
function cubicBezierAt(x1: number, y1: number, x2: number, y2: number, x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  // Newton–Raphson on the x polynomial, fall back to bisection.
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
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
  let lo = 0, hi = 1;
  t = x;
  while (hi - lo > 1e-6) {
    if (sampleX(t) < x) lo = t; else hi = t;
    t = (lo + hi) / 2;
  }
  return sampleY(t);
}

const isColor = (v: Keyframe["value"]): v is ColorValue =>
  typeof v === "object" && v !== null && "r" in v;

class TrackSampler {
  private kfs: Keyframe[];
  constructor(
    keyframes: Keyframe[],
    private apply: (v: number | ColorValue) => void,
  ) {
    this.kfs = keyframes.slice().sort((a, b) => a.position - b.position);
  }

  sample(p: number) {
    const kfs = this.kfs;
    if (!kfs.length) return;
    if (p <= kfs[0].position) return this.apply(kfs[0].value);
    if (p >= kfs[kfs.length - 1].position) return this.apply(kfs[kfs.length - 1].value);
    let i = 0;
    while (i < kfs.length - 1 && kfs[i + 1].position <= p) i++;
    const a = kfs[i], b = kfs[i + 1];
    if (!a.connectedRight) return this.apply(a.value); // step hold
    const span = b.position - a.position || 1;
    const x = (p - a.position) / span;
    const y = cubicBezierAt(a.handles[2], a.handles[3], b.handles[0], b.handles[1], x);
    if (isColor(a.value) && isColor(b.value)) {
      this.apply({
        r: a.value.r + (b.value.r - a.value.r) * y,
        g: a.value.g + (b.value.g - a.value.g) * y,
        b: a.value.b + (b.value.b - a.value.b) * y,
      });
    } else if (typeof a.value === "number" && typeof b.value === "number") {
      this.apply(a.value + (b.value - a.value) * y);
    } else {
      this.apply(a.value); // mixed types — hold
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

  constructor(
    sheet: AnimationSheet,
    objectsById: Map<string, THREE.Object3D>,
    materialsById: Map<string, THREE.Material>,
  ) {
    const tracksByObject: Record<string, TracksForObject> = sheet.sequence.tracksByObject;
    for (const [targetId, tracks] of Object.entries(tracksByObject)) {
      const target: Target | undefined = objectsById.get(targetId) ?? materialsById.get(targetId);
      if (!target) {
        // e.g. a GLB-internal material uuid the export animates but doesn't describe.
        console.warn("[lab] timeline target not found, skipping:", targetId);
        continue;
      }
      for (const [propPathJson, trackId] of Object.entries(tracks.trackIdByPropPath)) {
        const path = JSON.parse(propPathJson) as string[];
        const data = tracks.trackData[trackId];
        if (!data) continue;
        const apply = makeApplier(target, path);
        if (!apply) {
          console.warn("[lab] cannot apply prop path", path, "on", (target as { name?: string }).name);
          continue;
        }
        this.samplers.push(new TrackSampler(Object.values(data.keyframes.byId), apply));
      }
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
