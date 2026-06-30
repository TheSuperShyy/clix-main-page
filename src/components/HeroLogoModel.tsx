import { Canvas, useLoader } from "@react-three/fiber";
import {
  Environment,
  Float,
  Instance,
  Instances,
  Lightformer,
  MeshTransmissionMaterial,
  OrbitControls,
  RoundedBox,
} from "@react-three/drei";
import { Suspense, useMemo } from "react";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

/* ------------------------------------------------------------------ *
 * Layout — all positions/sizes in one place so the stack is easy to
 * re-tune during iteration. Units are three.js world units; the whole
 * group is scaled down by GROUP_SCALE to frame in the hero.
 * ------------------------------------------------------------------ */
const GROUP_SCALE = 0.82;
const PLATE = { w: 2.2, t: 0.16, r: 0.26 }; // metal plate footprint
const GLASS = { w: 2.34, t: 0.12, r: 0.32 }; // glass sheet (sticks out wider)

const Y = {
  mark: 1.3,
  topPlate: 1.18,
  glassTop: 0.46,
  field: 0.0,
  glassBot: -0.46,
  basePlate: -1.18,
  underglow: -1.42,
};

const SILVER = "#e2e7ec";
const SILVER_DARK = "#aab2bd";
const GRAD_BLUE = "#2f49c8";
const GRAD_PURPLE = "#8a6ce0";
const CYAN = "#19b6f0";

/* ------------------------------------------------------------------ *
 * Clix mark — reuse the proven SVGLoader -> ExtrudeGeometry pipeline,
 * but lay it FLAT on the top plate and paint a blue->purple gradient
 * via per-vertex colours (lerped along local X).
 * ------------------------------------------------------------------ */
function ClixMark() {
  const data = useLoader(SVGLoader, "/clix-logo.svg");

  const geometry = useMemo(() => {
    const shapes: THREE.Shape[] = [];
    for (const p of data.paths) shapes.push(...SVGLoader.createShapes(p));

    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: 60,
      bevelEnabled: true,
      bevelThickness: 10,
      bevelSize: 7,
      bevelSegments: 3,
      steps: 1,
    });
    geo.computeBoundingBox();
    const bb = geo.boundingBox!;
    geo.translate(
      -(bb.max.x + bb.min.x) / 2,
      -(bb.max.y + bb.min.y) / 2,
      -(bb.max.z + bb.min.z) / 2,
    );

    // gradient via vertex colours along X
    const pos = geo.attributes.position;
    const blue = new THREE.Color(GRAD_BLUE);
    const purple = new THREE.Color(GRAD_PURPLE);
    const tmp = new THREE.Color();
    const span = bb.max.x - bb.min.x || 1;
    const colors = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const t = (pos.getX(i) - bb.min.x) / span;
      tmp.copy(blue).lerp(purple, t);
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, [data]);

  // fit the mark onto the plate, then lay it flat (face up).
  const scale = useMemo(() => {
    const bb = geometry.boundingBox!;
    return 1.5 / Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y);
  }, [geometry]);

  return (
    <group position={[0, Y.mark, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={scale}>
      <mesh geometry={geometry} castShadow>
        <meshPhysicalMaterial
          vertexColors
          metalness={0.15}
          roughness={0.16}
          clearcoat={1}
          clearcoatRoughness={0.06}
          envMapIntensity={1.3}
          emissive={GRAD_BLUE}
          emissiveIntensity={0.08}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Dot field — a gently domed grid of small metallic pins between the
 * glass sheets, clipped to a rounded disc. Instanced for perf.
 * ------------------------------------------------------------------ */
function DotField() {
  const positions = useMemo(() => {
    const pts: [number, number, number][] = [];
    const N = 13;
    const half = 0.82;
    const step = (half * 2) / (N - 1);
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const x = -half + i * step;
        const z = -half + j * step;
        const d = Math.hypot(x, z);
        if (d > half) continue; // rounded clip
        const dome = 0.16 * (1 - (d / half) ** 2);
        pts.push([x, Y.field + dome, z]);
      }
    }
    return pts;
  }, []);

  return (
    <Instances limit={positions.length} range={positions.length}>
      <sphereGeometry args={[0.032, 12, 12]} />
      <meshStandardMaterial
        color="#d5e9f4"
        metalness={0.8}
        roughness={0.28}
        emissive={CYAN}
        emissiveIntensity={0.18}
      />
      {positions.map((p, i) => (
        <Instance key={i} position={p} />
      ))}
    </Instances>
  );
}

/* ------------------------------------------------------------------ *
 * The full badge stack.
 * ------------------------------------------------------------------ */
function Stack() {
  return (
    <group scale={GROUP_SCALE}>
      {/* TOP metal plate + mark */}
      <RoundedBox
        args={[PLATE.w, PLATE.t, PLATE.w]}
        radius={PLATE.r}
        smoothness={6}
        position={[0, Y.topPlate, 0]}
      >
        <meshStandardMaterial color={SILVER} metalness={1} roughness={0.32} envMapIntensity={1.2} />
      </RoundedBox>
      <ClixMark />

      {/* upper glass tray */}
      <RoundedBox
        args={[GLASS.w, GLASS.t, GLASS.w]}
        radius={GLASS.r}
        smoothness={6}
        position={[0, Y.glassTop, 0]}
      >
        <MeshTransmissionMaterial
          transmission={1}
          thickness={0.4}
          roughness={0.07}
          ior={1.45}
          chromaticAberration={0.03}
          anisotropicBlur={0.1}
          color="#dff1ff"
          attenuationColor="#bfe6ff"
          attenuationDistance={3}
          samples={4}
          resolution={256}
        />
      </RoundedBox>

      {/* core glow + dot field */}
      <mesh position={[0, Y.field - 0.02, 0]}>
        <cylinderGeometry args={[0.66, 0.66, 0.16, 48]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.45} />
      </mesh>
      <pointLight position={[0, Y.field, 0]} color={CYAN} intensity={3} distance={3.4} />
      <DotField />

      {/* lower glass tray */}
      <RoundedBox
        args={[GLASS.w, GLASS.t, GLASS.w]}
        radius={GLASS.r}
        smoothness={6}
        position={[0, Y.glassBot, 0]}
      >
        <MeshTransmissionMaterial
          transmission={1}
          thickness={0.4}
          roughness={0.09}
          ior={1.45}
          chromaticAberration={0.03}
          color="#dceeff"
          attenuationColor="#9fd2ff"
          attenuationDistance={2.5}
          samples={4}
          resolution={256}
        />
      </RoundedBox>

      {/* base metal plate + blue underglow */}
      <RoundedBox
        args={[PLATE.w, PLATE.t + 0.02, PLATE.w]}
        radius={PLATE.r}
        smoothness={6}
        position={[0, Y.basePlate, 0]}
      >
        <meshStandardMaterial color={SILVER_DARK} metalness={1} roughness={0.36} envMapIntensity={1.1} />
      </RoundedBox>
      <mesh position={[0, Y.underglow, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.05, 48]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

/* In-memory studio: a soft overhead key + an enveloping ring of strips
   so the brushed metal and glass catch moving highlights at every
   azimuth as the camera orbits (no network HDRI). */
function Studio() {
  return (
    <Environment resolution={256}>
      <Lightformer form="rect" intensity={3} position={[0, 6, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[10, 10, 1]} color="#ffffff" />
      <Lightformer form="rect" intensity={2.4} position={[0, 1, 6]} rotation={[0, Math.PI, 0]} scale={[6, 6, 1]} color="#eaf2ff" />
      <Lightformer form="rect" intensity={3.4} position={[5, 1, 3]} rotation={[0, Math.PI + Math.PI / 3, 0]} scale={[0.5, 8, 1]} color="#ffffff" />
      <Lightformer form="rect" intensity={3.4} position={[-5, 1, 3]} rotation={[0, -Math.PI / 3, 0]} scale={[0.5, 8, 1]} color="#dfe8ff" />
      <Lightformer form="rect" intensity={3} position={[5, 1, -3]} rotation={[0, Math.PI / 3, 0]} scale={[0.5, 8, 1]} color="#ffffff" />
      <Lightformer form="rect" intensity={3} position={[-5, 1, -3]} rotation={[0, Math.PI - Math.PI / 3, 0]} scale={[0.5, 8, 1]} color="#eef2ff" />
      <Lightformer form="circle" intensity={1.6} position={[0, -4, 2]} scale={4} color="#bfe6ff" />
    </Environment>
  );
}

export default function HeroLogoModel() {
  const reduced = useReducedMotion();

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, toneMappingExposure: 1.05 }}
      camera={{ position: [3.4, 2.0, 5.6], fov: 30 }}
      frameloop={reduced ? "demand" : "always"}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 7, 5]} intensity={1.6} color="#ffffff" />
      <directionalLight position={[-5, 2, -4]} intensity={0.7} color="#cdd9ff" />

      <Suspense fallback={null}>
        <Float
          enabled={!reduced}
          speed={1.4}
          rotationIntensity={0}
          floatIntensity={0.6}
          floatingRange={[-0.06, 0.06]}
        >
          <Stack />
        </Float>
        <Studio />
      </Suspense>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        autoRotate={!reduced}
        autoRotateSpeed={1.0}
        rotateSpeed={0.9}
        target={[0, 0, 0]}
        minPolarAngle={Math.PI * 0.16}
        maxPolarAngle={Math.PI * 0.72}
      />
    </Canvas>
  );
}
