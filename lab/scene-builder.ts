/**
 * scene-builder — turns the Peachworlds scene-state JSON (lab/data/scene.json,
 * gitignored reference data) into a live three.js graph.
 *
 * The JSON is the single source of truth: object transforms, geometry params,
 * PBR material values, camera and light settings all come straight from it —
 * nothing here invents numbers.
 */
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

// ---- JSON shapes (only the fields we consume) ----
interface Vec3 { x: number; y: number; z: number }

export interface PwObject {
  uuid: string;
  name: string;
  type: string; // "SCENE" | "CAMERA" | "LIGHT" | "MESH" | "IMPORTED" | " GROUP" (sic)
  position: Vec3;
  rotation: Vec3;
  scale: Vec3;
  visible: boolean;
  // SCENE
  background?: string;
  // CAMERA
  fov?: number; near?: number; far?: number; zoom?: number;
  cameraType?: string;
  controls?: { type: string; maxRotation: { x: number; y: number }; easingDuration: number };
  // LIGHT
  lightType?: string; intensity?: number; color?: string;
  // MESH
  geometry?: Record<string, number | string>;
  materialId?: string;
  // IMPORTED
  object?: { assetType: string; assetUrl: string };
  materials?: string[];
  animation?: { loop: boolean; speed: number };
}

export interface PwMaterial {
  uuid: string;
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

export interface SceneState {
  engineState: {
    sceneObjectId: string;
    defaultCameraId: string;
    pwObjects: Record<string, PwObject>;
    pwMaterials: Record<string, PwMaterial>;
    parents: Record<string, string>;
    children: Record<string, string[]>;
    effects: Record<string, Record<string, unknown>>;
    effectsOrder: string[];
  };
  animations: {
    sheetsById: Record<string, AnimationSheet>;
  };
}

export interface AnimationSheet {
  sequence: {
    length: number;
    tracksByObject: Record<string, TracksForObject>;
  };
}
export interface TracksForObject {
  trackIdByPropPath: Record<string, string>;
  trackData: Record<string, { keyframes: { byId: Record<string, Keyframe> } }>;
}
export interface Keyframe {
  value: number | { r: number; g: number; b: number; a?: number };
  position: number;
  handles: [number, number, number, number];
  connectedRight: boolean;
}

export interface BuiltScene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  cameraRig: THREE.Object3D | null;
  tiltMax: { x: number; y: number };
  objectsById: Map<string, THREE.Object3D>;
  materialsById: Map<string, THREE.Material>;
  mixers: THREE.AnimationMixer[];
  glbReady: Promise<void>;
}

// The reference stores some colors as Peachworlds CSS vars; resolved values
// live in clone/index.html. Timeline color tracks override these at runtime.
const CSS_VAR_COLORS: Record<string, string> = {
  "var(--pw-user-color-style-638cefad-7e44-448c-b7c4-e6ba29f86741)": "#10004a",
};
const resolveColor = (c: string) => CSS_VAR_COLORS[c] ?? c;

function makeMaterial(def: PwMaterial): THREE.MeshPhysicalMaterial {
  const m = new THREE.MeshPhysicalMaterial();
  m.name = def.name;
  m.side = def.side === "BACK" ? THREE.BackSide : def.side === "DOUBLE" ? THREE.DoubleSide : THREE.FrontSide;
  m.transparent = def.transparent;
  m.color.set(resolveColor(def.color));
  m.opacity = def.opacity;
  m.alphaTest = def.alphaTest;
  m.roughness = def.roughness;
  m.metalness = def.metalness;
  m.emissive.set(resolveColor(def.emissive));
  m.emissiveIntensity = def.emissiveIntensity;
  m.ior = def.ior;
  m.reflectivity = def.reflectivity;
  m.iridescence = def.iridescence;
  m.iridescenceIOR = def.iridescenceIOR;
  m.sheen = def.sheen;
  m.sheenRoughness = def.sheenRoughness;
  m.sheenColor.set(resolveColor(def.sheenColor));
  m.clearcoat = def.clearcoat;
  m.clearcoatRoughness = def.clearcoatRoughness;
  m.transmission = def.transmission;
  m.dispersion = def.dispersion;
  m.specularIntensity = def.specularIntensity;
  m.specularColor.set(resolveColor(def.specularColor));
  m.thickness = def.thickness;
  m.attenuationColor.set(resolveColor(def.attenuationColor));
  // 0 in the export means "disabled"; three uses Infinity for that.
  m.attenuationDistance = def.attenuationDistance > 0 ? def.attenuationDistance : Infinity;
  return m;
}

function makeGeometry(g: Record<string, number | string>): THREE.BufferGeometry {
  switch (g.type) {
    case "SPHERE":
      return new THREE.SphereGeometry(
        g.radius as number, g.widthSegments as number, g.heightSegments as number,
        g.phiStart as number, g.phiLength as number, g.thetaStart as number, g.thetaLength as number,
      );
    case "PLANE":
      return new THREE.PlaneGeometry(
        g.width as number, g.height as number, g.widthSegments as number, g.heightSegments as number,
      );
    default:
      console.warn("[lab] unknown geometry type", g.type, "— using unit box");
      return new THREE.BoxGeometry(1, 1, 1);
  }
}

/** GLBs are served from lab/assets (downloaded copies of the reference CDN files). */
const localAssetUrl = (remote: string) => `./assets/${remote.split("/").pop()}`;

export function buildScene(state: SceneState, viewportAspect: number): BuiltScene {
  const es = state.engineState;
  const objectsById = new Map<string, THREE.Object3D>();
  const materialsById = new Map<string, THREE.Material>();
  const mixers: THREE.AnimationMixer[] = [];

  for (const [id, def] of Object.entries(es.pwMaterials)) {
    materialsById.set(id, makeMaterial(def));
  }

  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let cameraRig: THREE.Object3D | null = null;
  let tiltMax = { x: 0, y: 0 };
  const glbLoads: Promise<void>[] = [];
  const loader = new GLTFLoader();
  const draco = new DRACOLoader();
  draco.setDecoderPath("./assets/draco/"); // local copy of three's decoder
  loader.setDRACOLoader(draco);
  const glbCache = new Map<string, Promise<import("three/addons/loaders/GLTFLoader.js").GLTF>>();

  for (const [id, def] of Object.entries(es.pwObjects)) {
    let obj: THREE.Object3D;
    switch (def.type.trim()) {
      case "SCENE": {
        const s = new THREE.Scene();
        if (def.background) s.background = new THREE.Color(resolveColor(def.background));
        scene = s;
        obj = s;
        break;
      }
      case "CAMERA": {
        const cam = new THREE.PerspectiveCamera(def.fov, viewportAspect, def.near, def.far);
        cam.zoom = def.zoom ?? 1;
        cam.updateProjectionMatrix();
        obj = cam;
        if (id === es.defaultCameraId) {
          camera = cam;
          if (def.controls?.type === "TILT") tiltMax = { ...def.controls.maxRotation };
        }
        break;
      }
      case "LIGHT": {
        const color = new THREE.Color(resolveColor(def.color ?? "#ffffff"));
        obj =
          def.lightType === "DIRECTIONAL"
            ? new THREE.DirectionalLight(color, def.intensity)
            : new THREE.AmbientLight(color, def.intensity);
        break;
      }
      case "MESH": {
        const mat = materialsById.get(def.materialId ?? "") ?? new THREE.MeshPhysicalMaterial();
        const mesh = new THREE.Mesh(makeGeometry(def.geometry!), mat);
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        obj = mesh;
        break;
      }
      case "IMPORTED": {
        // Placeholder group now; the GLB content is attached when loaded.
        const holder = new THREE.Group();
        obj = holder;
        const url = localAssetUrl(def.object!.assetUrl);
        if (!glbCache.has(url)) glbCache.set(url, loader.loadAsync(url));
        const overrideMat = def.materials?.length ? materialsById.get(def.materials[0]) : undefined;
        glbLoads.push(
          glbCache.get(url)!.then((gltf) => {
            const inst = gltf.scene.clone(true);
            if (overrideMat) {
              inst.traverse((c) => {
                if ((c as THREE.Mesh).isMesh) (c as THREE.Mesh).material = overrideMat;
              });
            }
            holder.add(inst);
            if (gltf.animations.length) {
              const mixer = new THREE.AnimationMixer(inst);
              for (const clip of gltf.animations) {
                const action = mixer.clipAction(clip);
                action.loop = def.animation?.loop ? THREE.LoopRepeat : THREE.LoopOnce;
                action.timeScale = def.animation?.speed ?? 1;
                action.play();
              }
              mixers.push(mixer);
            }
          }),
        );
        break;
      }
      default: {
        obj = new THREE.Group(); // " GROUP"
        if (def.name === "Camera Rig") cameraRig = obj;
      }
    }

    obj.name = def.name;
    obj.position.set(def.position.x, def.position.y, def.position.z);
    obj.rotation.set(def.rotation.x, def.rotation.y, def.rotation.z);
    obj.scale.set(def.scale.x, def.scale.y, def.scale.z);
    obj.visible = def.visible;
    objectsById.set(id, obj);
  }

  // Parent everything per the exported hierarchy.
  for (const [childId, parentId] of Object.entries(es.parents)) {
    const child = objectsById.get(childId);
    const parent = objectsById.get(parentId);
    if (child && parent) parent.add(child);
  }

  if (!scene || !camera) throw new Error("scene.json is missing a SCENE or default CAMERA object");

  return {
    scene,
    camera,
    cameraRig,
    tiltMax,
    objectsById,
    materialsById,
    mixers,
    glbReady: Promise.all(glbLoads).then(() => undefined),
  };
}
