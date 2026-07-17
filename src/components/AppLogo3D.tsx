"use client";

/* eslint-disable @typescript-eslint/no-explicit-any -- THREE.js is an untyped window global, see src/lib/load3d.ts */

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { loadThreeAndGltf, createMarkMaterials, skinMark, buildStudioEnv } from "@/lib/load3d";
import { AppLogo } from "./AppLogo";

interface Props {
  size?: number;
  className?: string;
}

/**
 * The real 3D Almoayyed mark, rendered small and persistent for the sidebar/
 * header — a very slow, continuous, subtle rotation (per the client's brief:
 * "should almost feel alive without attracting unnecessary attention").
 * Falls back to the flat 2D AppLogo while the model loads or if WebGL/the
 * model fails, so the header logo is never missing.
 */
export function AppLogo3D({ size = 34, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    const cleanupFns: Array<() => void> = [];

    async function run() {
      try {
        await loadThreeAndGltf();
      } catch {
        if (alive) setFailed(true);
        return;
      }
      if (!alive) return;

      const THREE = (window as any).THREE;
      const canvas = canvasRef.current;
      if (!canvas || typeof THREE === "undefined") {
        setFailed(true);
        return;
      }

      let renderer: any;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      } catch {
        setFailed(true);
        return;
      }
      const dpr = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(size, size, false);
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;

      const scene = new THREE.Scene();
      scene.environment = buildStudioEnv(THREE, renderer);
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const key = new THREE.DirectionalLight(0xffffff, 1.6);
      key.position.set(4, 6, 7);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xdfe6f5, 0.55);
      fill.position.set(-6, -2, 4);
      scene.add(fill);

      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
      camera.position.set(0, 0, 12);

      const grp = new THREE.Group();
      scene.add(grp);
      grp.rotation.x = -0.16;

      const materials = createMarkMaterials(THREE);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const loader = new THREE.GLTFLoader();
      loader.load(
        "/base.glb",
        (gltf: any) => {
          if (!alive) return;
          const root = gltf.scene;
          skinMark(THREE, root, materials);
          const box = new THREE.Box3().setFromObject(root);
          const s = new THREE.Vector3();
          box.getSize(s);
          const ctr = new THREE.Vector3();
          box.getCenter(ctr);
          const fit = 4.6 / Math.max(s.x, s.y, s.z);
          root.scale.setScalar(fit);
          root.position.set(-ctr.x * fit, -ctr.y * fit, -ctr.z * fit);
          grp.add(root);
          setReady(true);
        },
        undefined,
        () => {
          if (alive) setFailed(true);
        }
      );

      let raf = 0;
      const tick = () => {
        if (!alive) return;
        raf = requestAnimationFrame(tick);
        if (!reduce) grp.rotation.y += 0.0022; // ~48s per full rotation — slow, subtle
        renderer.render(scene, camera);
      };
      tick();
      cleanupFns.push(() => cancelAnimationFrame(raf));
    }

    run();
    return () => {
      alive = false;
      cleanupFns.forEach((fn) => fn());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  return (
    <span className={clsx("relative inline-block flex-none", className)} style={{ width: size, height: size }}>
      <AppLogo size={size} className={clsx("absolute inset-0 transition-opacity duration-300", ready && !failed ? "opacity-0" : "opacity-100")} />
      {!failed && (
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          // CSS size locked explicitly — three.js's renderer.setSize() rewrites the
          // canvas's width/height *attributes* to size*devicePixelRatio for the
          // backing buffer; without a separate CSS size it displays at that
          // inflated (e.g. 2x) size too, since attributes double as display size
          // by default when no CSS overrides them.
          style={{ width: size, height: size }}
          className={clsx("absolute inset-0 transition-opacity duration-300", ready ? "opacity-100" : "opacity-0")}
        />
      )}
    </span>
  );
}
