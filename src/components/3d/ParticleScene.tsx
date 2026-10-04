"use client";

import { useEffect, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from "three";

export function ParticleScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Scene
    const scene = new Scene();
    const camera = new PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 80;

    const renderer = new WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Stars / particles
    const COUNT = 2500;
    const geo = new BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);

    const cyan = new Color("#00f5c4");
    const violet = new Color("#7c3aed");
    const white = new Color("#ffffff");

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 300;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 300;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;

      const rand = Math.random();
      const c = rand < 0.3 ? cyan : rand < 0.5 ? violet : white;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geo.setAttribute("position", new BufferAttribute(positions, 3));
    geo.setAttribute("color", new BufferAttribute(colors, 3));

    const mat = new PointsMaterial({
      size: 0.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });

    const particles = new Points(geo, mat);
    scene.add(particles);

    // Connecting lines (sparse network)
    const lineMat = new LineBasicMaterial({
      color: new Color("#00f5c4"),
      transparent: true,
      opacity: 0.04,
    });
    const lineGeo = new BufferGeometry();
    const linePositions: number[] = [];
    const step = Math.floor(COUNT / 80);
    for (let i = 0; i < 80; i++) {
      const a = i * step * 3;
      const b = ((i + 1) % 80) * step * 3;
      linePositions.push(positions[a], positions[a + 1], positions[a + 2]);
      linePositions.push(positions[b], positions[b + 1], positions[b + 2]);
    }
    lineGeo.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(linePositions), 3),
    );
    const lines = new LineSegments(lineGeo, lineMat);
    scene.add(lines);

    // Mouse parallax — kept in a plain object so pointer moves never
    // trigger a React render.
    const mouse = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // Animation
    let frame = 0;
    let rafId = 0;
    const renderFrame = () => {
      frame++;
      const t = frame * 0.0005;
      particles.rotation.y = t * 0.3 + mouse.x * 0.08;
      particles.rotation.x = t * 0.15 + mouse.y * 0.05;
      lines.rotation.y = particles.rotation.y;
      lines.rotation.x = particles.rotation.x;

      // Camera subtle drift
      camera.position.x += (mouse.x * 4 - camera.position.x) * 0.02;
      camera.position.y += (mouse.y * 3 - camera.position.y) * 0.02;

      renderer.render(scene, camera);
    };
    const animate = () => {
      renderFrame();
      rafId = requestAnimationFrame(animate);
    };
    const start = () => {
      cancelAnimationFrame(rafId);
      // Reduced motion: draw a single static frame instead of looping.
      if (reducedMotion) renderFrame();
      else animate();
    };
    start();

    // Don't burn CPU/GPU while the tab is in the background.
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(rafId);
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (reducedMotion) renderFrame();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      geo.dispose();
      mat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none animate-fade-in"
      aria-hidden="true"
    />
  );
}
