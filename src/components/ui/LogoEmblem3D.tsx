import * as THREE from "three";
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

/**
 * LogoEmblem3D — the Clix mark as a REAL 3D object.
 *
 * The logo's own SVG path (`/clix-logo.svg`, a single evenodd fill with holes)
 * is extruded with `SVGLoader` + `ExtrudeGeometry` into beveled, dimensional
 * geometry, wrapped in a glossy near-black `MeshPhysicalMaterial`, and lit by a
 * procedural Lightformer studio (no external HDR download) so the chrome-black
 * surface catches white + brand-blue + teal reflections like the reference
 * renders. It spins continuously around its vertical axis (a true turntable).
 *
 * Lazy-loaded by <Integrations> behind a flat-PNG <Suspense> fallback so three
 * stays out of the initial bundle. Motion is UNGATED on reduced-motion by the
 * same project decision as the surrounding orbit.
 */

const LOGO_URL = "/clix-logo.svg";
const SPIN_SPEED = 0.55; // radians / second

function SpinningLogo() {
  const { paths } = useLoader(SVGLoader, LOGO_URL);

  const { geometry, scale } = useMemo(() => {
    // Honour the SVG's evenodd fill-rule so the mark's negative space stays open.
    const shapes: THREE.Shape[] = [];
    for (const path of paths) {
      for (const shape of SVGLoader.createShapes(path)) shapes.push(shape);
    }

    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: 90,
      bevelEnabled: true,
      bevelThickness: 18,
      bevelSize: 14,
      bevelSegments: 5,
      curveSegments: 24,
    });
    geo.center();
    geo.computeVertexNormals();
    geo.computeBoundingBox();

    const size = new THREE.Vector3();
    geo.boundingBox!.getSize(size);
    const fit = 2.9 / Math.max(size.x, size.y); // normalise to ~2.9 world units (bigger presence)

    return { geometry: geo, scale: fit };
  }, [paths]);

  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * SPIN_SPEED;
  });

  // Negative Y scale corrects the SVG's y-down axis; DoubleSide keeps the metal
  // lit correctly despite the winding flip that the reflection introduces.
  return (
    <mesh ref={ref} geometry={geometry} scale={[scale, -scale, scale]}>
      <meshPhysicalMaterial
        color="#0b0d14"
        metalness={0.95}
        roughness={0.16}
        clearcoat={1}
        clearcoatRoughness={0.14}
        envMapIntensity={1.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function LogoEmblem3D() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent", pointerEvents: "none" }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 6]} intensity={1.1} />
      <Suspense fallback={null}>
        <SpinningLogo />
        {/* Procedural studio — reflected in the glossy black as bright streaks.
            Built from Lightformers so there's no runtime HDR fetch. */}
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={3} position={[0, 2.5, 4]} scale={[9, 4, 1]} color="#ffffff" />
          <Lightformer
            form="rect"
            intensity={2.2}
            position={[-4, 0, 2]}
            rotation={[0, Math.PI / 3, 0]}
            scale={[3, 9, 1]}
            color="#2454f5"
          />
          <Lightformer
            form="rect"
            intensity={2.2}
            position={[4, -0.5, 2]}
            rotation={[0, -Math.PI / 3, 0]}
            scale={[3, 9, 1]}
            color="#13bcc8"
          />
          <Lightformer form="rect" intensity={1.4} position={[0, -3, 3]} scale={[9, 3, 1]} color="#ffffff" />
        </Environment>
      </Suspense>
    </Canvas>
  );
}
