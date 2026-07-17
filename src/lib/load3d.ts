/* eslint-disable @typescript-eslint/no-explicit-any -- THREE.js is loaded as an untyped global
   via <script> tag (r128 has no ESM build), not an imported module. */

const THREE_SRC = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
const GSAP_SRC = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
const GLTF_LOADER_SRC = "/GLTFLoader.js";

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.getAttribute("data-loaded") === "true") return resolve();
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)));
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => {
      s.setAttribute("data-loaded", "true");
      resolve();
    };
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(s);
  });
}

// three.js must finish before GLTFLoader.js (it attaches THREE.GLTFLoader onto
// the global THREE namespace).
export async function loadThreeAndGltf() {
  await loadScript(THREE_SRC);
  await loadScript(GLTF_LOADER_SRC);
}

export async function loadThreeGltfAndGsap() {
  await loadScript(THREE_SRC);
  await Promise.all([loadScript(GLTF_LOADER_SRC), loadScript(GSAP_SRC)]);
}

/**
 * Brand materials for the Almoayyed mark — shared between the login page's
 * cinematic intro and the small persistent sidebar/header mark, so both
 * always render identically:
 *  - cardinal (inward) arrows: deep burgundy/maroon, soft glow
 *  - diagonal (outward) arrows: brushed aluminum — matte, slightly gray
 *  - center sphere: polished metallic silver — visibly shinier than the arrows
 * three.js r128 treats hex colors as linear, not sRGB, so every color must go
 * through convertSRGBToLinear() or it renders washed out.
 */
export function createMarkMaterials(THREE: any) {
  function srgb(hex: number) {
    const c = new THREE.Color(hex);
    c.convertSRGBToLinear();
    return c;
  }

  const wine = new THREE.MeshPhysicalMaterial({
    color: srgb(0x5c1030),
    metalness: 0.6,
    roughness: 0.32,
    clearcoat: 0.5,
    clearcoatRoughness: 0.24,
    emissive: srgb(0x4a0e28),
    emissiveIntensity: 0.24,
    envMapIntensity: 0.85,
  });
  const silver = new THREE.MeshPhysicalMaterial({
    color: srgb(0xaab0ba),
    metalness: 0.85,
    roughness: 0.44,
    clearcoat: 0.12,
    clearcoatRoughness: 0.4,
    envMapIntensity: 0.65,
  });
  const chrome = new THREE.MeshPhysicalMaterial({
    color: srgb(0xd9dce1),
    metalness: 1,
    roughness: 0.06,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    envMapIntensity: 1.4,
  });

  return { wine, silver, chrome };
}

export function skinMark(THREE: any, root: any, materials: ReturnType<typeof createMarkMaterials>) {
  root.updateMatrixWorld(true);
  const c0 = new THREE.Box3().setFromObject(root).getCenter(new THREE.Vector3());
  root.traverse((o: any) => {
    if (!o.isMesh) return;
    const c = new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3()).sub(c0);
    const r = Math.hypot(c.x, c.y);
    if (r < 0.3) o.material = materials.chrome;
    else if (Math.min(Math.abs(c.x), Math.abs(c.y)) < 0.4 * r) o.material = materials.wine;
    else o.material = materials.silver;
  });
}

/** Simple studio-gradient environment map so the metal picks up soft directional highlights. */
export function buildStudioEnv(THREE: any, renderer: any) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const x = c.getContext("2d")!;
  const g = x.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, "#ffffff");
  g.addColorStop(0.45, "#d6dae4");
  g.addColorStop(0.6, "#a1a7b5");
  g.addColorStop(1, "#6b7280");
  x.fillStyle = g;
  x.fillRect(0, 0, 512, 256);
  x.globalAlpha = 0.9;
  const b = x.createLinearGradient(0, 0, 512, 0);
  b.addColorStop(0, "rgba(255,255,255,0)");
  b.addColorStop(0.5, "rgba(255,255,255,.9)");
  b.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = b;
  x.fillRect(30, 36, 260, 24);
  x.fillRect(300, 150, 170, 18);
  x.globalAlpha = 1;
  const t = new THREE.CanvasTexture(c);
  t.mapping = THREE.EquirectangularReflectionMapping;
  t.encoding = THREE.sRGBEncoding;
  const p = new THREE.PMREMGenerator(renderer);
  const env = p.fromEquirectangular(t).texture;
  t.dispose();
  p.dispose();
  return env;
}
