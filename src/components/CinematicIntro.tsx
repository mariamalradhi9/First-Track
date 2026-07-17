"use client";

/* eslint-disable @typescript-eslint/no-explicit-any -- THREE.js/GSAP are loaded as untyped
   globals via <script> tags (r128 has no ESM build), not imported modules; `any` here is
   the honest type for dynamically-loaded, unversioned window globals. */

import { useEffect, useRef, type RefObject } from "react";
import { loadThreeGltfAndGsap, createMarkMaterials, skinMark, buildStudioEnv } from "@/lib/load3d";

interface Props {
  heroSlotRef: RefObject<HTMLDivElement | null>;
  onComplete: () => void;
}

/**
 * Cinematic 3D logo intro — plays once on the login page.
 * White/theme-matched world → metallic logo fades in large, rotates once
 * elegantly (~3s) → scales down + flies up (~1s) to land permanently above
 * "Welcome Back". Spotlight, floating particles, floating shadow.
 *
 * Material accuracy (per client spec):
 *  - cardinal (inward) arrows: deep burgundy/maroon, soft glow
 *  - diagonal (outward) arrows: brushed aluminum — matte, slightly gray
 *  - center sphere: polished metallic silver — distinctly shinier than the arrows
 * three.js r128 treats hex colors as linear, not sRGB, so every material's
 * color/emissive must go through convertSRGBToLinear() or it renders washed out.
 */
export function CinematicIntro({ heroSlotRef, onComplete }: Props) {
  const introRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const finishedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let cancelled = false;
    const cleanupFns: Array<() => void> = [];

    async function run() {
      const intro = introRef.current!;
      const introFallbackTimer = setTimeout(() => {
        // libraries taking unusually long (slow network) — don't leave the
        // screen blank forever waiting for a script tag.
        if (!finishedRef.current) forceFinishBeforeLibsReady();
      }, 6000);

      function forceFinishBeforeLibsReady() {
        finishedRef.current = true;
        introRef.current?.classList.add("done");
        onCompleteRef.current();
      }

      try {
        await loadThreeGltfAndGsap();
      } catch {
        clearTimeout(introFallbackTimer);
        if (!finishedRef.current) forceFinishBeforeLibsReady();
        return;
      }
      clearTimeout(introFallbackTimer);
      if (cancelled) return;

      const THREE = (window as any).THREE;
      const gsap = (window as any).gsap;
      const stage = stageRef.current!;
      const spot = spotRef.current!;
      const shadow = shadowRef.current!;
      const wrap = wrapRef.current!;
      const canvas = canvasRef.current!;
      const heroSlot = heroSlotRef.current;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      function landInstant() {
        if (!heroSlot) return;
        stage.style.transform = "none";
        const t = heroSlot.getBoundingClientRect();
        const w = wrap.getBoundingClientRect();
        if (!w.width) return;
        const sc = t.width / w.width;
        const tx = t.left + t.width / 2 - (w.left + w.width / 2);
        const ty = t.top + t.height / 2 - (w.top + w.height / 2);
        stage.style.transform = `translate(${tx}px,${ty}px) scale(${sc})`;
      }

      function revealLogin() {
        if (finishedRef.current) return;
        finishedRef.current = true;
        intro.classList.add("done");
        onCompleteRef.current();
      }

      function forceFinish() {
        if (finishedRef.current) return;
        try {
          gsap?.globalTimeline.getChildren().forEach((t: any) => t.kill());
        } catch {}
        spot.style.opacity = "0";
        shadow.style.opacity = "0";
        if (grp) grp.rotation.set(0, 0, 0);
        landInstant();
        revealLogin();
      }

      const failsafe = setTimeout(forceFinish, 8500);
      // The landed logo is a `position:fixed` overlay manually aligned to sit
      // over `heroSlot` (a normal in-flow element). Fixed elements don't move
      // with page scroll, so without this the logo stays glued to the same
      // spot on screen while "Welcome Back" scrolls away underneath it —
      // resync on every scroll, not just resize.
      const onReposition = () => {
        if (finishedRef.current) landInstant();
      };
      window.addEventListener("resize", onReposition);
      window.addEventListener("scroll", onReposition, { passive: true, capture: true });
      cleanupFns.push(() => {
        clearTimeout(failsafe);
        window.removeEventListener("resize", onReposition);
        window.removeEventListener("scroll", onReposition, { capture: true } as EventListenerOptions);
      });

      if (typeof THREE === "undefined") return forceFinish();

      let renderer: any;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      } catch {
        return forceFinish();
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      const resizeRenderer = () => {
        const s = canvas.clientWidth || 480;
        renderer.setSize(s, s, false);
      };

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
      camera.position.set(0, 0, 12);

      // studio environment — soft gradient so metals pick up directional highlights
      scene.environment = buildStudioEnv(THREE, renderer);

      scene.add(new THREE.AmbientLight(0xffffff, 0.42));
      const key = new THREE.DirectionalLight(0xffffff, 1.85);
      key.position.set(4, 6, 7);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xdfe6f5, 0.6);
      fill.position.set(-6, -2, 4);
      scene.add(fill);
      const rim = new THREE.PointLight(0xf4cdda, 1.1, 42);
      rim.position.set(-5, 4, -4);
      scene.add(rim);

      const grp = new THREE.Group();
      scene.add(grp);
      grp.rotation.x = -0.16;

      const markMaterials = createMarkMaterials(THREE);

      // floating particles
      const N = 130;
      const pg = new THREE.BufferGeometry();
      const pp = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        const r = 3.5 + Math.random() * 3.2;
        const th = Math.random() * 6.283;
        const ph = Math.acos(2 * Math.random() - 1);
        pp[i * 3] = r * Math.sin(ph) * Math.cos(th);
        pp[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.72;
        pp[i * 3 + 2] = r * Math.cos(ph);
      }
      pg.setAttribute("position", new THREE.BufferAttribute(pp, 3));
      const particles = new THREE.Points(
        pg,
        new THREE.PointsMaterial({ color: 0xb49aa8, size: 0.05, transparent: true, opacity: 0, depthWrite: false, sizeAttenuation: true })
      );
      scene.add(particles);

      let idle = false;
      let alive = true;
      cleanupFns.push(() => {
        alive = false;
      });

      const loader = new THREE.GLTFLoader();
      loader.load(
        "/base.glb",
        (gl: any) => {
          if (!alive || cancelled) return;
          const root = gl.scene;
          skinMark(THREE, root, markMaterials);
          const box = new THREE.Box3().setFromObject(root);
          const s = new THREE.Vector3();
          box.getSize(s);
          const ctr = new THREE.Vector3();
          box.getCenter(ctr);
          const fit = 4.3 / Math.max(s.x, s.y, s.z);
          root.scale.setScalar(fit);
          root.position.set(-ctr.x * fit, -ctr.y * fit, -ctr.z * fit);
          grp.add(root);
          startCinematic();
        },
        undefined,
        () => forceFinish()
      );

      resizeRenderer();
      window.addEventListener("resize", resizeRenderer);
      cleanupFns.push(() => window.removeEventListener("resize", resizeRenderer));

      function tick() {
        if (!alive) return;
        requestAnimationFrame(tick);
        const now = performance.now();
        if (idle) grp.rotation.y += 0.004;
        particles.rotation.y += 0.0008;
        rim.position.set(Math.cos(now * 0.0006) * 6, 3.4, Math.sin(now * 0.0006) * 6 - 2);
        renderer.render(scene, camera);
      }
      tick();

      function startCinematic() {
        if (!gsap || reduce || !heroSlot) {
          forceFinish();
          return;
        }
        gsap.set(stage, { opacity: 0, x: 0, y: 0, scale: 1 });
        gsap.set(grp.rotation, { y: -0.55 });
        gsap.set(grp.scale, { x: 0.9, y: 0.9, z: 0.9 });

        stage.style.transform = "none";
        const t = heroSlot.getBoundingClientRect();
        const w = wrap.getBoundingClientRect();
        const sc = t.width / w.width;
        const tx = t.left + t.width / 2 - (w.left + w.width / 2);
        const ty = t.top + t.height / 2 - (w.top + w.height / 2);

        const tl = gsap.timeline();
        tl.to(stage, { opacity: 1, duration: 0.7, ease: "power2.out" }, 0)
          .to(grp.scale, { x: 1, y: 1, z: 1, duration: 1.0, ease: "power3.out" }, 0)
          .to(spot, { opacity: 1, duration: 0.9, ease: "power2.out" }, 0)
          .to(shadow, { opacity: 1, duration: 0.9, ease: "power2.out" }, 0.2)
          .to(particles.material, { opacity: 0.85, duration: 1.1, ease: "power1.out" }, 0.25);
        tl.to(grp.rotation, { y: "+=" + Math.PI * 2, duration: 3.0, ease: "power1.inOut" }, 0.35);
        tl.addLabel("move")
          .to(stage, { x: tx, y: ty, scale: sc, duration: 1.0, ease: "power3.inOut" }, "move")
          .to(grp.rotation, { y: Math.PI * 2, x: 0, duration: 1.0, ease: "power2.inOut" }, "move")
          .to(spot, { opacity: 0, duration: 0.7, ease: "power2.in" }, "move")
          .to(shadow, { opacity: 0, duration: 0.7, ease: "power2.in" }, "move")
          .to(particles.material, { opacity: 0, duration: 0.6, ease: "power2.in" }, "move");
        tl.add(() => {
          idle = !reduce;
        }, ">");
        tl.add(revealLogin, ">").to({}, { duration: 0.9 });
      }

      if (reduce) {
        // straight to the form, logo still lands, no animation
        setTimeout(() => {
          if (!finishedRef.current) forceFinish();
        }, 300);
      }
    }

    run();
    return () => {
      cancelled = true;
      cleanupFns.forEach((fn) => fn());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div ref={introRef} id="cinematic-intro" className="fixed inset-0 z-[90] bg-[image:var(--bg-grad)] transition-opacity duration-700">
        <div
          ref={spotRef}
          className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 w-[min(86vmin,860px)] h-[min(86vmin,860px)] rounded-full pointer-events-none opacity-0 blur-[8px]"
          style={{
            background:
              "radial-gradient(circle, rgba(201,120,152,.20) 0%, rgba(150,120,160,.10) 33%, rgba(90,90,120,0) 62%)",
          }}
        />
      </div>
      <div ref={stageRef} className="fixed inset-0 z-[95] pointer-events-none flex items-center justify-center" style={{ transformOrigin: "50% 50%" }}>
        <div ref={wrapRef} className="relative w-[min(56vh,90vw)] h-[min(56vh,90vw)]">
          <canvas ref={canvasRef} className="w-full h-full block" />
          <div
            ref={shadowRef}
            className="absolute left-1/2 bottom-[5%] -translate-x-1/2 w-[48%] h-[6.5%] rounded-full opacity-0 pointer-events-none blur-[5px]"
            style={{ background: "radial-gradient(ellipse, rgba(18,20,38,.24), rgba(18,20,38,0) 70%)" }}
          />
        </div>
      </div>
      <style jsx>{`
        #cinematic-intro.done {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }
      `}</style>
    </>
  );
}
