import * as THREE from "three";

/**
 * Our own coin-disc geometry (clean-room replacement for the reference GLBs —
 * see CONTEXT.md rights note). A classic rounded-rim coin as a lathe profile:
 * flat faces out to FACE_R, then a semicircular rim of radius HALF_T joining
 * the two faces, for a total radius of FACE_R + HALF_T ≈ 0.99 at thickness 0.1
 * — the proportions the scene transforms were authored around.
 */
const FACE_R = 0.942; // radius of the flat face
const HALF_T = 0.05; // half thickness = rim semicircle radius

/** The scene data expects the coin mesh slightly scaled down inside its node. */
export const COIN_MESH_SCALE = 0.861;

export function makeCoinGeometry(radialSegments = 96, rimSegments = 24): THREE.BufferGeometry {
  const pts: THREE.Vector2[] = [];
  // bottom face, center → edge (a midpoint keeps lathe triangulation tidy)
  pts.push(new THREE.Vector2(0, -HALF_T));
  pts.push(new THREE.Vector2(FACE_R * 0.55, -HALF_T));
  pts.push(new THREE.Vector2(FACE_R, -HALF_T));
  // rim: semicircle around (FACE_R, 0) from the bottom face to the top face
  for (let i = 1; i < rimSegments; i++) {
    const a = -Math.PI / 2 + (i / rimSegments) * Math.PI;
    pts.push(new THREE.Vector2(FACE_R + Math.cos(a) * HALF_T, Math.sin(a) * HALF_T));
  }
  // top face, edge → center
  pts.push(new THREE.Vector2(FACE_R, HALF_T));
  pts.push(new THREE.Vector2(FACE_R * 0.55, HALF_T));
  pts.push(new THREE.Vector2(0, HALF_T));

  const geo = new THREE.LatheGeometry(pts, radialSegments);
  geo.computeVertexNormals();
  return geo;
}
