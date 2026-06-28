import { Canvas, useLoader } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

/** Extruded, beveled solid built from the traced logo outline. */
function LogoMesh() {
  const data = useLoader(SVGLoader, "/clix-logo.svg");

  const geometry = useMemo(() => {
    const shapes: THREE.Shape[] = [];
    for (const p of data.paths) shapes.push(...SVGLoader.createShapes(p));

    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: 150,
      bevelEnabled: true,
      bevelThickness: 26,
      bevelSize: 18,
      bevelSegments: 6,
      steps: 1,
    });
    geo.computeBoundingBox();
    const bb = geo.boundingBox!;
    geo.translate(
      -(bb.max.x + bb.min.x) / 2,
      -(bb.max.y + bb.min.y) / 2,
      -(bb.max.z + bb.min.z) / 2,
    );
    geo.computeVertexNormals();
    return geo;
  }, [data]);

  const scale = useMemo(() => {
    const bb = geometry.boundingBox!;
    return 2.9 / Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y);
  }, [geometry]);

  // rotation [PI,0,0] flips SVG's y-down into three's y-up without mirroring.
  return (
    <group rotation={[Math.PI, 0, 0]} scale={scale}>
      <mesh geometry={geometry}>
        {/* Piano-key lacquer: deep-black dielectric body under a high-gloss
            clearcoat. The shine is reflection, not metal → stays black, not gunmetal. */}
        <meshPhysicalMaterial
          color="#060606"
          metalness={0}
          roughness={0.12}
          clearcoat={1}
          clearcoatRoughness={0.03}
          ior={1.5}
          envMapIntensity={1.5}
          sheen={0}
        />
      </mesh>
    </group>
  );
}

export default function HeroLogo3D() {
  const reduced = useReducedMotion();

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, toneMappingExposure: 1.15 }}
      camera={{ position: [0, 0, 6], fov: 30 }}
      frameloop={reduced ? "demand" : "always"}
      // Shadow is a separate ground ellipse in Hero.tsx (bottom-only); a CSS
      // silhouette drop-shadow here would trace the whole non-convex shape and
      // bleed around the sides, which we don't want.
      style={{ width: "100%", height: "100%", touchAction: "none" }}
    >
      {/* Ambient crushed near-zero so the diffuse body stays deep black; the
          Environment carries illumination + reflection. Hemisphere removed —
          broad fill is exactly what greys piano black out. */}
      <ambientLight intensity={0.08} />
      {/* Crisp white key → sharp clearcoat specular hotspots on the bevels. */}
      <directionalLight position={[5, 6, 6]} intensity={1.8} color="#ffffff" />
      {/* Cool back-fill lifted (0.5 → 1.0) so the diffuse term isn't front-biased
          and the far-side silhouette never goes pitch-dead — low enough to keep black. */}
      <directionalLight position={[-6, -1, -3]} intensity={1.0} color="#cdd6ff" />

      <Suspense fallback={null}>
        <LogoMesh />
        {/* In-memory studio: on an alpha:true canvas the white PAGE is NOT in the
            reflection, so the gloss is built entirely here. An ENVELOPING ring of
            shaped strips (every 45°) means whichever way it spins, a bright streak
            sits where the clearcoat mirrors it — front AND back stay glossy. Thin
            strips + wide dark gaps (no flood, no grey backdrop) keep the flats and
            body deep piano-black. */}
        <Environment resolution={512}>
          {/* OVERHEAD KEY — the "piano-lid" sheet; reads on the top bevels at every azimuth. */}
          <Lightformer form="rect" intensity={5} position={[0, 6, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[9, 9, 1]} color="#ffffff" />

          {/* AZIMUTHAL RING — 8 inward-facing vertical strips on r≈5.5. A drei rect
              emits along local +z, so each faces center via rotation y = θ+π; a
              ±π/14 Z-roll keeps the highlight diagonal as it sweeps the bevels. */}
          {/* 0° — front softbox */}
          <Lightformer form="rect" intensity={3.4} position={[0, 0.4, 5.5]} rotation={[0, Math.PI, Math.PI / 14]} scale={[2.6, 7.5, 1]} color="#ffffff" />
          {/* 45° — front-right razor */}
          <Lightformer form="rect" intensity={8} position={[3.9, 0.6, 3.9]} rotation={[0, Math.PI + Math.PI / 4, -Math.PI / 14]} scale={[0.32, 7, 1]} color="#eef1ff" />
          {/* 90° — right cool panel */}
          <Lightformer form="rect" intensity={4.5} position={[5.5, 0.3, 0]} rotation={[0, Math.PI + Math.PI / 2, Math.PI / 14]} scale={[0.5, 7.5, 1]} color="#dfe4ff" />
          {/* 135° — back-right razor */}
          <Lightformer form="rect" intensity={9.5} position={[3.9, 0.6, -3.9]} rotation={[0, Math.PI + (3 * Math.PI) / 4, -Math.PI / 14]} scale={[0.32, 7, 1]} color="#ffffff" />
          {/* 180° — back softbox (lifts the far side that used to die to matte black) */}
          <Lightformer form="rect" intensity={5} position={[0, 0.4, -5.5]} rotation={[0, 0, Math.PI / 14]} scale={[2.6, 7.5, 1]} color="#ffffff" />
          {/* 225° — back-left razor */}
          <Lightformer form="rect" intensity={9.5} position={[-3.9, 0.6, -3.9]} rotation={[0, Math.PI / 4, Math.PI / 14]} scale={[0.32, 7, 1]} color="#f2eee6" />
          {/* 270° — left cool panel */}
          <Lightformer form="rect" intensity={4.5} position={[-5.5, 0.3, 0]} rotation={[0, Math.PI / 2, -Math.PI / 14]} scale={[0.5, 7.5, 1]} color="#dfe4ff" />
          {/* 315° — front-left signature streak */}
          <Lightformer form="rect" intensity={8} position={[-3.9, 0.6, 3.9]} rotation={[0, (3 * Math.PI) / 4, Math.PI / 14]} scale={[0.32, 7, 1]} color="#ffffff" />

          {/* LOWER GLINT RING — warm circles under the equator so the bottom bevel
              catches light at any spin instead of going dead. */}
          <Lightformer form="circle" intensity={1.4} position={[0, -4, 3.5]} scale={3} color="#f2eee6" />
          <Lightformer form="circle" intensity={1.6} position={[3.2, -4, -2.4]} scale={3} color="#f4efe6" />
          <Lightformer form="circle" intensity={1.6} position={[-3.2, -4, -2.4]} scale={3} color="#eef1ff" />
        </Environment>
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate={!reduced}
        autoRotateSpeed={1.1}
        rotateSpeed={0.9}
        minPolarAngle={Math.PI * 0.16}
        maxPolarAngle={Math.PI * 0.84}
      />
    </Canvas>
  );
}
