import * as THREE from "three";
import sceneData from "./scene-data.json";
import { makeCoinGeometry, COIN_MESH_SCALE } from "./coinGeometry";

/**
 * Builds the hero's three.js scene graph from scene-data.json — our own data
 * file describing the AI-Finance-style scene (node transforms, PBR materials,
 * cameras and the scroll keyframe timeline). All meshes are procedural: coin
 * discs (coinGeometry), spheres and a background plane — no external assets.
 */

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface MaterialDef {
  name: string;
  side: string;
  transparent: boolean;
  color: string;
  opacity: number;
  alphaTest: number;
  roughness: number;
  metalness: number;
  emissive: string;
  emissiveIntensity: number;
  ior: number;
  reflectivity: number;
  iridescence: number;
  iridescenceIOR: number;
  sheen: number;
  sheenRoughness: number;
  sheenColor: string;
  clearcoat: number;
  clearcoatRoughness: number;
  transmission: number;
  dispersion: number;
  specularIntensity: number;
  specularColor: string;
  thickness: number;
  attenuationColor: string;
  attenuationDistance: number;
}

interface NodeDef {
  id: string;
  name: string;
  type: "GROUP" | "LIGHT" | "MESH" | "COIN";
  parent: string | null;
  position: Vec3;
  rotation: Vec3;
  scale: Vec3;
  visible: boolean;
  light?: { kind: string; color: string; intensity: number };
  geometry?:
    | { kind: "SPHERE"; radius: number; widthSegments: number; heightSegments: number }
    | { kind: "PLANE"; width: number; height: number };
  materialId?: string;
}

interface CameraDef {
  fov: number;
  near: number;
  far: number;
  zoom: number;
  position: Vec3;
  rotation: Vec3;
}

export interface Keyframe {
  p: number;
  v: number | { r: number; g: number; b: number; a?: number };
  h: [number, number, number, number];
  step?: boolean;
}

export interface TrackDef {
  target: string;
  path: string[];
  keyframes: Keyframe[];
}

interface SceneData {
  background: string;
  cameras: {
    rig: string | null;
    desktop: CameraDef;
    mobile: CameraDef | null;
    tilt: { x: number; y: number };
  };
  nodes: NodeDef[];
  materials: Record<string, MaterialDef>;
  tracks: TrackDef[];
}

export const data = sceneData as unknown as SceneData;

export interface BuiltScene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  tiltMax: { x: number; y: number };
  /** Timeline targets: node ids → Object3D, material ids → Material. */
  targets: Map<string, THREE.Object3D | THREE.Material>;
  materials: THREE.MeshPhysicalMaterial[];
  dispose: () => void;
}

function makeMaterial(def: MaterialDef): THREE.MeshPhysicalMaterial {
  const m = new THREE.MeshPhysicalMaterial();
  m.name = def.name;
  m.side =
    def.side === "BACK" ? THREE.BackSide : def.side === "DOUBLE" ? THREE.DoubleSide : THREE.FrontSide;
  m.transparent = def.transparent;
  m.color.set(def.color);
  m.opacity = def.opacity;
  m.alphaTest = def.alphaTest;
  m.roughness = def.roughness;
  m.metalness = def.metalness;
  m.emissive.set(def.emissive);
  m.emissiveIntensity = def.emissiveIntensity;
  m.ior = def.ior;
  m.reflectivity = def.reflectivity;
  m.iridescence = def.iridescence;
  m.iridescenceIOR = def.iridescenceIOR;
  m.sheen = def.sheen;
  m.sheenRoughness = def.sheenRoughness;
  m.sheenColor.set(def.sheenColor);
  m.clearcoat = def.clearcoat;
  m.clearcoatRoughness = def.clearcoatRoughness;
  m.transmission = def.transmission;
  m.dispersion = def.dispersion;
  m.specularIntensity = def.specularIntensity;
  m.specularColor.set(def.specularColor);
  m.thickness = def.thickness;
  m.attenuationColor.set(def.attenuationColor);
  // 0 means "disabled" in the data; three uses Infinity for that.
  m.attenuationDistance = def.attenuationDistance > 0 ? def.attenuationDistance : Infinity;
  return m;
}

export function buildHeroScene(aspect: number): BuiltScene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(data.background);

  const materialsById = new Map<string, THREE.MeshPhysicalMaterial>();
  for (const [id, def] of Object.entries(data.materials)) {
    materialsById.set(id, makeMaterial(def));
  }

  const geometries: THREE.BufferGeometry[] = [];
  const coinGeo = makeCoinGeometry();
  geometries.push(coinGeo);

  const objects = new Map<string, THREE.Object3D>();
  for (const n of data.nodes) {
    let obj: THREE.Object3D;
    switch (n.type) {
      case "LIGHT": {
        const color = new THREE.Color(n.light!.color);
        obj =
          n.light!.kind === "DIRECTIONAL"
            ? new THREE.DirectionalLight(color, n.light!.intensity)
            : new THREE.AmbientLight(color, n.light!.intensity);
        break;
      }
      case "MESH": {
        const g = n.geometry!;
        const geo =
          g.kind === "SPHERE"
            ? new THREE.SphereGeometry(g.radius, g.widthSegments, g.heightSegments)
            : new THREE.PlaneGeometry(g.width, g.height);
        geometries.push(geo);
        obj = new THREE.Mesh(geo, materialsById.get(n.materialId!));
        break;
      }
      case "COIN": {
        // A coin node is a holder group with the (shared) coin mesh inside,
        // mirroring the structure the transforms were authored against.
        const holder = new THREE.Group();
        const mesh = new THREE.Mesh(coinGeo, materialsById.get(n.materialId!));
        mesh.scale.setScalar(COIN_MESH_SCALE);
        holder.add(mesh);
        obj = holder;
        break;
      }
      default:
        obj = new THREE.Group();
    }
    obj.name = n.name;
    obj.position.set(n.position.x, n.position.y, n.position.z);
    obj.rotation.set(n.rotation.x, n.rotation.y, n.rotation.z);
    obj.scale.set(n.scale.x, n.scale.y, n.scale.z);
    obj.visible = n.visible;
    objects.set(n.id, obj);
  }
  for (const n of data.nodes) {
    (n.parent ? objects.get(n.parent)! : scene).add(objects.get(n.id)!);
  }

  // Camera — the reference authored a separate mobile framing (wider fov).
  const camDef = aspect < 0.9 && data.cameras.mobile ? data.cameras.mobile : data.cameras.desktop;
  const camera = new THREE.PerspectiveCamera(camDef.fov, aspect, camDef.near, camDef.far);
  camera.zoom = camDef.zoom;
  camera.updateProjectionMatrix();
  camera.position.set(camDef.position.x, camDef.position.y, camDef.position.z);
  camera.rotation.set(camDef.rotation.x, camDef.rotation.y, camDef.rotation.z);
  const rig = data.cameras.rig ? objects.get(data.cameras.rig) : null;
  (rig ?? scene).add(camera);

  const targets = new Map<string, THREE.Object3D | THREE.Material>();
  for (const [id, o] of objects) targets.set(id, o);
  for (const [id, m] of materialsById) targets.set(id, m);

  return {
    scene,
    camera,
    tiltMax: { ...data.cameras.tilt },
    targets,
    materials: [...materialsById.values()],
    dispose: () => {
      for (const g of geometries) g.dispose();
      for (const m of materialsById.values()) m.dispose();
    },
  };
}
