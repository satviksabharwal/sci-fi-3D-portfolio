"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useMousePosition } from "@/hooks/useMousePosition";

export function ParticleBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { normalised } = useMousePosition();
  const normRef = useRef(normalised);

  useEffect(() => {
    normRef.current = normalised;
  }, [normalised]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 80;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Stars / particles
    const COUNT = 2500;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);

    const cyan = new THREE.Color("#00f5c4");
    const violet = new THREE.Color("#7c3aed");
    const white = new THREE.Color("#ffffff");

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

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geo, mat);
    scene.add(particles);

    // Connecting lines (sparse network)
    const lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color("#00f5c4"),
      transparent: true,
      opacity: 0.04,
    });
    const lineGeo = new THREE.BufferGeometry();
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
      new THREE.BufferAttribute(new Float32Array(linePositions), 3),
    );
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    // Animation
    let frame = 0;
    const animate = () => {
      frame++;
      const t = frame * 0.0005;
      particles.rotation.y = t * 0.3 + normRef.current.x * 0.08;
      particles.rotation.x = t * 0.15 + normRef.current.y * 0.05;
      lines.rotation.y = particles.rotation.y;
      lines.rotation.x = particles.rotation.x;

      // Camera subtle drift
      camera.position.x += (normRef.current.x * 4 - camera.position.x) * 0.02;
      camera.position.y += (normRef.current.y * 3 - camera.position.y) * 0.02;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden
    />
  );
}
