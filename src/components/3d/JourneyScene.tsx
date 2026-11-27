"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  /** true: swivel to the visitor, open the visor, wave. false: visor down, back to coding. */
  greeting: boolean;
  /** Animates the mouth while the intro caption is being "spoken". */
  speaking: boolean;
  /** An intro clip of the real Satvik talking; shown in the helmet while the visor is up. */
  faceVideo?: HTMLVideoElement | null;
  onReady?: () => void;
  onError?: () => void;
};

// Story order of the page — the same list as MissionHud's STATIONS.
const STATIONS = ["hero", "about", "experience", "skills", "projects", "contact"];

const TEAL = 0x5fd9c9;
const CODING_YAW = 2.3; // chair faces the console, 3/4 away from the camera
const GREET_YAW = 0.14; // chair faces the visitor
const FLY_YAW = 0.5;
const CODE_COLORS = ["#5fd9c9", "#8aa0ff", "#e6e9ee", "#6b7480", "#f0b86e"];

// The route, one point per station. He flies it top to bottom.
const ROUTE: [number, number, number][] = [
  [0.3, 0.4, 1.6],
  [3, -14, 1],
  [-3, -30, 0],
  [3, -46, 1],
  [-3, -62, 0],
  [0, -78, 1],
];

type CodeLine = { indent: number; segments: { w: number; c: string }[] };

const randomLine = (): CodeLine => ({
  indent: Math.floor(Math.random() * 4),
  segments: Array.from({ length: 1 + Math.floor(Math.random() * 4) }, () => ({
    w: 24 + Math.random() * 90,
    c: CODE_COLORS[Math.floor(Math.random() * CODE_COLORS.length)],
  })),
});

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * The whole page's 3D world, fixed behind the content: the station where the
 * astronaut codes and greets (hero), then one continuous flight down the route
 * past an object for every section. Scroll position drives the flight; W/S or
 * the arrow keys fly it too. Built from primitives — no model files.
 */
export function JourneyScene({ greeting, speaking, faceVideo, onReady, onError }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef(greeting);
  const speakingRef = useRef(speaking);
  const changedAtRef = useRef(-100);
  const clockRef = useRef(0);
  const readyRef = useRef(onReady);
  const errorRef = useRef(onError);

  useEffect(() => {
    if (greetingRef.current !== greeting) {
      greetingRef.current = greeting;
      changedAtRef.current = clockRef.current;
    }
  }, [greeting]);

  useEffect(() => {
    speakingRef.current = speaking;
  }, [speaking]);

  const faceVideoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    faceVideoRef.current = faceVideo ?? null;
  }, [faceVideo]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      errorRef.current?.();
      return;
    }
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 400);
    const textures: THREE.Texture[] = [];
    const spinners: { obj: THREE.Object3D; speed: number }[] = [];

    // ── Lights ────────────────────────────────────────────────
    scene.add(new THREE.HemisphereLight(0xaebcff, 0x0b0c0e, 0.7));
    const key = new THREE.DirectionalLight(0xffffff, 1.7);
    key.position.set(-2, 3, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x3d5afe, 2.4);
    rim.position.set(2.5, 2, -3);
    scene.add(rim);

    // ── Helpers ───────────────────────────────────────────────
    const std = (color: number, extra: THREE.MeshStandardMaterialParameters = {}) =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.7, ...extra });
    const add = (
      parent: THREE.Object3D,
      geo: THREE.BufferGeometry,
      mat: THREE.Material,
      x = 0,
      y = 0,
      z = 0,
    ) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      parent.add(m);
      return m;
    };
    const group = (parent: THREE.Object3D, x = 0, y = 0, z = 0) => {
      const g = new THREE.Group();
      g.position.set(x, y, z);
      parent.add(g);
      return g;
    };
    const canvasTex = (
      w: number,
      h: number,
      draw: (ctx: CanvasRenderingContext2D) => void,
    ) => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      draw(c.getContext("2d")!);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      textures.push(tex);
      return tex;
    };

    const suit = std(0xe8ecf1, { roughness: 0.6 });
    const suitShade = std(0xb9c0ca);
    const dark = std(0x1b1f26, { roughness: 0.5, metalness: 0.4 });
    const darker = std(0x101318, { roughness: 0.6, metalness: 0.3 });
    const glow = std(TEAL, { emissive: TEAL, emissiveIntensity: 1.6 });
    const skin = std(0xd7a37c, { roughness: 0.8 });
    const hair = std(0x15110f, { roughness: 0.9 });
    const white = std(0xffffff, { roughness: 0.4 });
    const helmetMat = std(0xf1f4f8, { roughness: 0.45, side: THREE.DoubleSide });
    const visorMat = std(0x0a1a20, {
      roughness: 0.12,
      metalness: 0.7,
      emissive: TEAL,
      emissiveIntensity: 0.22,
      transparent: true,
      opacity: 0.94,
      side: THREE.DoubleSide,
    });

    // ── Deep space: stars along the whole route ───────────────
    const dotTex = canvasTex(64, 64, (ctx) => {
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.35, "rgba(255,255,255,0.55)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
    });
    const STAR_COUNT = 2600;
    const starPos = new Float32Array(STAR_COUNT * 3);
    const starCol = new Float32Array(STAR_COUNT * 3);
    const starTints = [new THREE.Color(0xffffff), new THREE.Color(0x9fb4ff), new THREE.Color(TEAL)];
    for (let i = 0; i < STAR_COUNT; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 150;
      starPos[i * 3 + 1] = 30 - Math.random() * 150;
      starPos[i * 3 + 2] = -6 - Math.random() * 90;
      const c = starTints[Math.random() < 0.7 ? 0 : Math.random() < 0.5 ? 1 : 2];
      starCol.set([c.r, c.g, c.b], i * 3);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starCol, 3));
    scene.add(
      new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({
          size: 0.55,
          map: dotTex,
          vertexColors: true,
          transparent: true,
          opacity: 0.9,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      ),
    );

    // ── Planets ───────────────────────────────────────────────
    const planet = (
      r: number,
      x: number,
      y: number,
      z: number,
      colors: [string, string, string],
      halo: number,
    ) => {
      const tex = canvasTex(256, 128, (ctx) => {
        ctx.fillStyle = colors[0];
        ctx.fillRect(0, 0, 256, 128);
        for (let i = 0; i < 46; i++) {
          ctx.globalAlpha = 0.12 + Math.random() * 0.3;
          ctx.fillStyle = colors[1 + Math.floor(Math.random() * 2)];
          ctx.fillRect(0, Math.random() * 128, 256, 1 + Math.random() * 9);
        }
        for (let i = 0; i < 90; i++) {
          ctx.globalAlpha = 0.1 + Math.random() * 0.2;
          ctx.fillStyle = Math.random() < 0.5 ? "#000000" : "#ffffff";
          ctx.beginPath();
          ctx.arc(Math.random() * 256, Math.random() * 128, Math.random() * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      const g = group(scene, x, y, z);
      const body = add(g, new THREE.SphereGeometry(r, 56, 36), std(0xffffff, { map: tex, roughness: 0.95 }));
      body.rotation.z = 0.3;
      spinners.push({ obj: body, speed: 0.04 });
      add(
        g,
        new THREE.SphereGeometry(r * 1.07, 40, 28),
        new THREE.MeshBasicMaterial({
          color: halo,
          transparent: true,
          opacity: 0.13,
          side: THREE.BackSide,
          depthWrite: false,
        }),
      );
      return g;
    };
    const ring = (parent: THREE.Object3D, inner: number, outer: number, color: number, opacity: number) => {
      const m = add(
        parent,
        new THREE.RingGeometry(inner, outer, 96),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide, depthWrite: false }),
      );
      m.rotation.x = 1.25;
      m.rotation.y = 0.2;
      return m;
    };

    // Origin: the two moons where he studied.
    planet(1.1, -7.3, -11, -5, ["#3a4266", "#8aa0ff", "#1d2238"], 0x8aa0ff);
    planet(1.7, 1, -18.5, -8, ["#1d4d52", "#5fd9c9", "#0e2a2d"], TEAL);
    // Flight log: one world per company, oldest first, spread along the
    // experience stretch of the route (y -30 … -46). Order and count follow
    // EXPERIENCE in src/lib/data.ts — add a planet here when adding a job.
    planet(1.2, -10, -27, -5, ["#2b3140", "#8aa0ff", "#161a24"], 0x8aa0ff); // Wipro
    planet(1.7, -11.5, -31, -12, ["#1f3a4d", "#5faad9", "#0f1f2b"], 0x5faad9); // Brillio
    const staffbase = planet(3.2, -13, -35.5, -9, ["#12423f", "#5fd9c9", "#082321"], TEAL);
    ring(staffbase, 4.2, 5.9, TEAL, 0.28);
    planet(1.5, -9.5, -40, -6, ["#3d2f4d", "#b08cff", "#1b1424"], 0xb08cff); // Codefitters
    planet(2.5, -12.5, -44, -10, ["#4a3413", "#f0b86e", "#231807"], 0xf0b86e); // Talon.One
    // Open channel: home.
    const home = planet(7, 0, -90, -12, ["#123a66", "#2f86d6", "#5fd9c9"], 0x7fe3d4);
    ring(home, 8.2, 8.35, TEAL, 0.6);

    // ── Systems: a constellation of skills ────────────────────
    const constellation = group(scene, 0, -46, -6);
    const skillStars: [number, number, number][] = [
      [-16, 3, 0], [-13.5, 1, -1], [-15, -1.5, 0.5], [-12, -3, -0.5], [-14.5, -5, 0],
      [-9, 4.5, -1], [-6.5, 2.5, 0], [-9.5, 1, 0.5],
      [-7, -3, -1], [-4, -4.5, 0], [-8.5, -6, 0.5],
    ];
    const clusters = [[0, 1, 2, 3, 4], [5, 6, 7], [8, 9, 10]];
    const cGeo = new THREE.BufferGeometry();
    cGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(skillStars.flat()), 3));
    constellation.add(
      new THREE.Points(
        cGeo,
        new THREE.PointsMaterial({
          size: 1.5,
          map: dotTex,
          color: 0xdffcf6,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      ),
    );
    const linePts: number[] = [];
    clusters.forEach((c) => {
      for (let i = 0; i < c.length - 1; i++) linePts.push(...skillStars[c[i]], ...skillStars[c[i + 1]]);
    });
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePts), 3));
    constellation.add(
      new THREE.LineSegments(lGeo, new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0.4 })),
    );

    // ── Payloads: satellites ──────────────────────────────────
    const panelMat = std(0x2b4acb, { emissive: 0x2b4acb, emissiveIntensity: 0.5, metalness: 0.5, roughness: 0.35 });
    const satSpots: [number, number, number][] = [
      [-17, -56, -12], [-12, -60, -18], [-20, -63.5, -15], [-13, -67, -13], [-18, -70.5, -16],
    ];
    satSpots.forEach(([x, y, z], i) => {
      const s = group(scene, x, y, z);
      s.rotation.set(0.4 + i, 0.6 * i, 0.2);
      s.scale.setScalar(1.1);
      add(s, new THREE.BoxGeometry(0.6, 0.6, 0.85), dark);
      add(s, new THREE.BoxGeometry(0.62, 0.08, 0.87), glow);
      add(s, new THREE.BoxGeometry(1.5, 0.03, 0.6), panelMat, -1.15, 0, 0);
      add(s, new THREE.BoxGeometry(1.5, 0.03, 0.6), panelMat, 1.15, 0, 0);
      const dish = add(s, new THREE.ConeGeometry(0.28, 0.18, 20, 1, true), white, 0, 0.42, 0);
      dish.rotation.x = Math.PI;
      spinners.push({ obj: s, speed: 0.12 + i * 0.03 });
    });

    // ── Station floor + porthole ──────────────────────────────
    const floorTex = canvasTex(256, 256, (ctx) => {
      const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
      g.addColorStop(0, "rgba(95,217,201,0.20)");
      g.addColorStop(0.45, "rgba(95,217,201,0.05)");
      g.addColorStop(1, "rgba(95,217,201,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 256);
    });
    const floor = add(
      scene,
      new THREE.CircleGeometry(1.9, 48),
      new THREE.MeshBasicMaterial({ map: floorTex, transparent: true, depthWrite: false }),
    );
    floor.rotation.x = -Math.PI / 2;
    const floorRing = add(
      scene,
      new THREE.TorusGeometry(1.25, 0.004, 6, 96),
      new THREE.MeshBasicMaterial({ color: TEAL, transparent: true, opacity: 0.35 }),
      0,
      0.005,
      0,
    );
    floorRing.rotation.x = Math.PI / 2;

    const portTex = canvasTex(256, 256, (ctx) => {
      ctx.fillStyle = "#04050a";
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 70; i++) {
        ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.7})`;
        ctx.fillRect(Math.random() * 256, Math.random() * 256, 1.4, 1.4);
      }
      const pg = ctx.createRadialGradient(215, 250, 80, 215, 250, 150);
      pg.addColorStop(0, "#0d2a4a");
      pg.addColorStop(0.86, "#1d5d8f");
      pg.addColorStop(0.96, "#7fe9dc");
      pg.addColorStop(1, "rgba(127,233,220,0)");
      ctx.fillStyle = pg;
      ctx.beginPath();
      ctx.arc(215, 250, 150, 0, Math.PI * 2);
      ctx.fill();
    });
    const port = group(scene, -0.62, 1.52, -1.3);
    port.rotation.y = 0.2;
    port.scale.setScalar(0.82);
    add(port, new THREE.CircleGeometry(0.46, 48), new THREE.MeshBasicMaterial({ map: portTex }));
    add(port, new THREE.TorusGeometry(0.47, 0.045, 12, 64), dark);
    add(port, new THREE.TorusGeometry(0.53, 0.008, 6, 64), glow);

    // ── Console ───────────────────────────────────────────────
    const station = group(scene);
    station.rotation.y = CODING_YAW;
    add(station, new THREE.BoxGeometry(1.5, 0.05, 0.62), dark, 0, 0.74, 0.62);
    add(station, new THREE.BoxGeometry(1.4, 0.72, 0.06), darker, 0, 0.36, 0.88);
    add(station, new THREE.BoxGeometry(0.06, 0.72, 0.56), darker, -0.72, 0.36, 0.62);
    add(station, new THREE.BoxGeometry(0.06, 0.72, 0.56), darker, 0.72, 0.36, 0.62);
    add(station, new THREE.BoxGeometry(1.5, 0.012, 0.012), glow, 0, 0.745, 0.31);
    add(station, new THREE.BoxGeometry(0.44, 0.02, 0.15), darker, 0, 0.775, 0.43);
    add(
      station,
      new THREE.BoxGeometry(0.4, 0.004, 0.11),
      std(TEAL, { emissive: TEAL, emissiveIntensity: 0.35, roughness: 0.9 }),
      0,
      0.787,
      0.43,
    );
    add(station, new THREE.CylinderGeometry(0.02, 0.02, 0.2, 12), dark, 0, 0.86, 0.86);
    add(station, new THREE.BoxGeometry(0.92, 0.54, 0.03), dark, 0, 1.2, 0.87);

    const codeCanvas = document.createElement("canvas");
    codeCanvas.width = 512;
    codeCanvas.height = 288;
    const cctx = codeCanvas.getContext("2d")!;
    const codeTex = new THREE.CanvasTexture(codeCanvas);
    codeTex.colorSpace = THREE.SRGBColorSpace;
    textures.push(codeTex);
    const screen = add(
      station,
      new THREE.PlaneGeometry(0.86, 0.48),
      new THREE.MeshBasicMaterial({ map: codeTex }),
      0,
      1.2,
      0.852,
    );
    screen.rotation.y = Math.PI;

    const MAX_LINES = 11;
    let lines: CodeLine[] = Array.from({ length: 7 }, randomLine);
    let typed = 0;
    const drawCode = (cursorOn: boolean) => {
      cctx.fillStyle = "#070b10";
      cctx.fillRect(0, 0, 512, 288);
      cctx.fillStyle = "rgba(95,217,201,0.10)";
      cctx.fillRect(0, 0, 512, 22);
      lines.forEach((line, i) => {
        const y = 36 + i * 22;
        cctx.fillStyle = "#39414c";
        cctx.fillRect(14, y, 10, 8);
        let x = 40 + line.indent * 22;
        const last = i === lines.length - 1;
        const count = last ? typed : line.segments.length;
        for (let s = 0; s < count; s++) {
          cctx.fillStyle = line.segments[s].c;
          cctx.fillRect(x, y, line.segments[s].w, 8);
          x += line.segments[s].w + 10;
        }
        if (last && cursorOn) {
          cctx.fillStyle = "#5fd9c9";
          cctx.fillRect(x, y - 3, 7, 14);
        }
      });
      codeTex.needsUpdate = true;
    };
    const typeStep = () => {
      const last = lines[lines.length - 1];
      if (typed < last.segments.length) typed++;
      else {
        lines.push(randomLine());
        if (lines.length > MAX_LINES) lines = lines.slice(1);
        typed = 0;
      }
    };
    drawCode(true);

    const sideTex = canvasTex(256, 192, (ctx) => {
      ctx.fillStyle = "#070b10";
      ctx.fillRect(0, 0, 256, 192);
      for (let i = 0; i < 9; i++) {
        const h = 30 + Math.random() * 110;
        ctx.fillStyle = i % 3 === 0 ? "#8aa0ff" : "#5fd9c9";
        ctx.fillRect(22 + i * 24, 168 - h, 12, h);
      }
    });
    const side = group(station, 0.66, 1.12, 0.78);
    side.rotation.y = Math.PI + 0.55;
    add(side, new THREE.BoxGeometry(0.4, 0.3, 0.02), dark, 0, 0, -0.012);
    add(side, new THREE.PlaneGeometry(0.36, 0.26), new THREE.MeshBasicMaterial({ map: sideTex }));

    const screenLight = new THREE.PointLight(TEAL, 1.6, 3.2);
    screenLight.position.set(0, 1.2, 0.55);
    station.add(screenLight);

    // ── Chair (stays on the station) ──────────────────────────
    const chair = group(scene);
    chair.rotation.y = CODING_YAW;
    add(chair, new THREE.CylinderGeometry(0.26, 0.3, 0.05, 32), dark, 0, 0.03, 0);
    add(chair, new THREE.CylinderGeometry(0.035, 0.035, 0.42, 12), dark, 0, 0.25, 0);
    add(chair, new THREE.BoxGeometry(0.46, 0.08, 0.44), darker, 0, 0.49, 0);
    add(chair, new THREE.BoxGeometry(0.42, 0.56, 0.07), darker, 0, 0.84, -0.27);
    add(chair, new THREE.BoxGeometry(0.43, 0.012, 0.012), glow, 0, 0.53, 0.22);

    // ── Astronaut (leaves the chair to fly the route) ─────────
    const PIVOT = 0.9; // body centre: he tilts around this while flying
    const astro = group(scene);
    const body = group(astro, 0, PIVOT, 0);
    body.rotation.order = "YXZ";
    const rig = group(body, 0, -PIVOT, 0);

    // Suit materials: woven outer fabric, convoluted (ribbed) joints, anodised
    // bearing rings, rubberised gloves and soles, teal identification stripes.
    const weave = canvasTex(128, 128, (ctx) => {
      ctx.fillStyle = "#808080";
      ctx.fillRect(0, 0, 128, 128);
      for (let i = 0; i < 128; i += 4) {
        ctx.fillStyle = i % 8 === 0 ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.22)";
        ctx.fillRect(0, i, 128, 2);
        ctx.fillRect(i, 0, 2, 128);
      }
      for (let i = 0; i < 500; i++) {
        ctx.fillStyle = Math.random() < 0.5 ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)";
        ctx.fillRect(Math.random() * 128, Math.random() * 128, 2, 2);
      }
    });
    weave.wrapS = weave.wrapT = THREE.RepeatWrapping;
    weave.repeat.set(5, 5);
    const fabric = std(0xe6eaef, { roughness: 0.85, bumpMap: weave, bumpScale: 1.4 });
    const fabricShade = std(0xc3cad3, { roughness: 0.9, bumpMap: weave, bumpScale: 1.4 });
    const joint = std(0xaeb6c0, { roughness: 0.75 });
    const metal = std(0xd9dee5, { roughness: 0.38, metalness: 0.3 });
    const rubber = std(0x2b3038, { roughness: 0.92 });
    const stripe = std(0x3fb8a6, { roughness: 0.6, emissive: TEAL, emissiveIntensity: 0.25 });
    const pack = std(0xd4d9df, { roughness: 0.55, metalness: 0.15 });

    const ringGeo = (r: number, tube: number) => new THREE.TorusGeometry(r, tube, 8, 24);
    /** A flat ring around a limb (the limb runs along Y). */
    const band = (parent: THREE.Object3D, r: number, tube: number, y: number, mat: THREE.Material) => {
      const m = add(parent, ringGeo(r, tube), mat, 0, y, 0);
      m.rotation.x = Math.PI / 2;
      return m;
    };
    /** Convoluted joint fabric: fine ribs hugging the limb, starting at y and running down. */
    const bellows = (parent: THREE.Object3D, r: number, y: number, count: number) => {
      for (let i = 0; i < count; i++) band(parent, r, 0.0055, y - i * 0.0125, joint);
    };

    const legs = [-1, 1].map((sx) => {
      const hip = group(rig, sx * 0.105, 0.6, 0);
      add(hip, new THREE.CylinderGeometry(0.092, 0.084, 0.3, 20), fabric, 0, -0.17, 0);
      add(hip, new THREE.SphereGeometry(0.092, 16, 10), fabric, 0, -0.02, 0);
      band(hip, 0.0905, 0.008, -0.1, stripe);
      bellows(hip, 0.0875, -0.285, 4); // ribbing above the knee

      const knee = group(hip, 0, -0.37, 0);
      // the joint itself is a ball of fabric, so the bend is smooth from any angle
      add(knee, new THREE.SphereGeometry(0.088, 20, 14), fabric);
      const kneePad = add(knee, new THREE.SphereGeometry(1, 18, 12), fabricShade, 0, -0.012, 0.062);
      kneePad.scale.set(0.058, 0.064, 0.034);
      bellows(knee, 0.082, -0.065, 4); // ribbing below the knee
      add(knee, new THREE.CylinderGeometry(0.08, 0.07, 0.28, 20), fabric, 0, -0.2, 0);
      band(knee, 0.0725, 0.007, -0.35, metal); // boot disconnect
      // boot: cuff, foot, toe cap, treaded sole
      add(knee, new THREE.CylinderGeometry(0.077, 0.082, 0.1, 20), fabricShade, 0, -0.41, 0);
      add(knee, new THREE.BoxGeometry(0.135, 0.075, 0.2), fabricShade, 0, -0.475, 0.03);
      const toe = add(knee, new THREE.SphereGeometry(0.0675, 16, 12), fabricShade, 0, -0.475, 0.13);
      toe.scale.set(1, 0.56, 1.1);
      add(knee, new THREE.BoxGeometry(0.15, 0.03, 0.3), rubber, 0, -0.525, 0.045);
      for (let i = 0; i < 4; i++) {
        add(knee, new THREE.BoxGeometry(0.15, 0.012, 0.03), rubber, 0, -0.545, -0.07 + i * 0.075);
      }
      return { hip, knee };
    });

    const upper = group(rig, 0, 0.62, -0.02); // pivots at the hips
    // lower torso + waist bearing
    const waist = add(upper, new THREE.CylinderGeometry(0.2, 0.185, 0.16, 28), fabric, 0, 0.09, 0);
    waist.scale.set(1.08, 1, 0.84);
    const waistRing = add(upper, ringGeo(0.2, 0.01), metal, 0, 0.17, 0);
    waistRing.rotation.x = Math.PI / 2;
    waistRing.scale.set(1.1, 0.86, 1);
    // hard upper torso
    const torso = add(upper, new THREE.CapsuleGeometry(0.19, 0.24, 8, 24), fabric, 0, 0.31, 0);
    torso.scale.set(1.14, 1, 0.86);
    // harness straps over the shoulders
    for (const sx of [-1, 1]) {
      const strap = add(upper, new THREE.BoxGeometry(0.034, 0.3, 0.014), fabricShade, sx * 0.115, 0.37, 0.158);
      strap.rotation.set(-0.16, 0, sx * -0.1);
      // shoulder bearing ring, facing sideways
      const bearing = add(upper, ringGeo(0.09, 0.009), metal, sx * 0.232, 0.48, 0);
      bearing.rotation.y = Math.PI / 2;
    }
    // chest display & control unit
    const dcm = group(upper, 0, 0.31, 0.17);
    add(dcm, new THREE.BoxGeometry(0.21, 0.135, 0.07), dark);
    add(dcm, new THREE.BoxGeometry(0.22, 0.012, 0.075), metal, 0, 0.072, 0);
    add(dcm, new THREE.BoxGeometry(0.085, 0.045, 0.006), glow, -0.045, 0.028, 0.036); // display
    add(dcm, new THREE.BoxGeometry(0.07, 0.006, 0.008), darker, -0.045, 0.036, 0.04);
    add(dcm, new THREE.BoxGeometry(0.05, 0.006, 0.008), darker, -0.055, 0.022, 0.04);
    [0xf0b86e, 0xffffff, TEAL].forEach((c, i) => {
      add(dcm, new THREE.SphereGeometry(0.008, 10, 8), std(c, { emissive: c, emissiveIntensity: 1.4 }), 0.03 + i * 0.026, 0.04, 0.036);
    });
    for (let i = 0; i < 3; i++) {
      const knob = add(dcm, new THREE.CylinderGeometry(0.012, 0.012, 0.02, 12), metal, 0.03 + i * 0.026, 0.008, 0.042);
      knob.rotation.x = Math.PI / 2;
    }
    add(dcm, new THREE.BoxGeometry(0.17, 0.02, 0.006), stripe, 0, -0.04, 0.036);
    // mission patch
    const patch = add(upper, new THREE.CircleGeometry(0.03, 24), stripe, -0.115, 0.475, 0.158);
    patch.rotation.set(-0.3, -0.25, 0);
    const patchRing = add(upper, ringGeo(0.03, 0.004), metal, -0.115, 0.475, 0.159);
    patchRing.rotation.set(-0.3, -0.25, 0);
    // life-support backpack
    add(upper, new THREE.BoxGeometry(0.4, 0.5, 0.17), pack, 0, 0.37, -0.225);
    add(upper, new THREE.BoxGeometry(0.3, 0.07, 0.13), fabricShade, 0, 0.655, -0.215);
    add(upper, new THREE.BoxGeometry(0.26, 0.3, 0.012), fabricShade, 0, 0.4, -0.316);
    add(upper, new THREE.BoxGeometry(0.41, 0.014, 0.175), stripe, 0, 0.56, -0.225);
    for (const sx of [-1, 1]) {
      add(upper, new THREE.CylinderGeometry(0.045, 0.045, 0.42, 16), metal, sx * 0.215, 0.36, -0.24); // tanks
      add(upper, new THREE.SphereGeometry(0.045, 14, 10), metal, sx * 0.215, 0.57, -0.24);
      const nozzle = add(upper, new THREE.CylinderGeometry(0.03, 0.05, 0.07, 14, 1, true), dark, sx * 0.1, 0.09, -0.225);
      nozzle.rotation.x = 0;
      // umbilical hose: backpack → round the ribs → chest unit
      const hose = new THREE.CatmullRomCurve3([
        new THREE.Vector3(sx * 0.17, 0.24, -0.15),
        new THREE.Vector3(sx * 0.245, 0.25, -0.02),
        new THREE.Vector3(sx * 0.2, 0.28, 0.12),
        new THREE.Vector3(sx * 0.1, 0.3, 0.175),
      ]);
      add(upper, new THREE.TubeGeometry(hose, 20, 0.012, 8), rubber);
      add(upper, new THREE.SphereGeometry(0.018, 10, 8), metal, sx * 0.1, 0.3, 0.178);
    }
    // neck ring
    const collar = add(upper, ringGeo(0.15, 0.03), metal, 0, 0.57, 0);
    collar.rotation.x = Math.PI / 2;
    const collarSeal = add(upper, ringGeo(0.147, 0.02), dark, 0, 0.595, 0);
    collarSeal.rotation.x = Math.PI / 2;

    // Jetpack flames
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0x9ff3e6,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const flames = [-1, 1].map((sx) => {
      const f = add(upper, new THREE.ConeGeometry(0.05, 0.6, 14, 1, true), flameMat, sx * 0.1, 0.05, -0.225);
      f.rotation.x = Math.PI;
      return f;
    });
    const jetLight = new THREE.PointLight(TEAL, 0, 4);
    jetLight.position.set(0, -0.1, -0.4);
    upper.add(jetLight);

    // Head
    const head = group(upper, 0, 0.75, 0);
    const R = 0.12;
    const face3d = group(head); // hidden while an intro video plays in the helmet
    const skull = add(face3d, new THREE.SphereGeometry(R, 28, 20), skin);
    skull.scale.set(1, 1.1, 1);
    const hairCap = add(face3d,
      new THREE.SphereGeometry(R + 0.008, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.47),
      hair,
      0,
      0.012,
      0,
    );
    hairCap.scale.set(1, 1.1, 1);
    hairCap.rotation.x = -0.38;
    const quiff = add(face3d, new THREE.SphereGeometry(0.06, 16, 12), hair, 0, 0.118, 0.045);
    quiff.scale.set(1.5, 0.6, 1);
    const beard = add(face3d,
      new THREE.SphereGeometry(R + 0.005, 28, 12, 0, Math.PI * 2, Math.PI * 0.6, Math.PI * 0.4),
      hair,
    );
    beard.scale.set(1, 1.1, 1);
    add(face3d, new THREE.BoxGeometry(0.062, 0.013, 0.012), hair, 0, -0.036, 0.117);
    const mouth = add(face3d, new THREE.BoxGeometry(0.044, 0.012, 0.01), white, 0, -0.056, 0.116);
    add(face3d, new THREE.SphereGeometry(0.016, 12, 10), skin, 0, -0.008, 0.122);
    const eyes: THREE.Mesh[] = [];
    for (const sx of [-1, 1]) {
      eyes.push(add(face3d, new THREE.SphereGeometry(0.0125, 12, 10), hair, sx * 0.043, 0.02, 0.109));
      add(face3d, new THREE.BoxGeometry(0.042, 0.009, 0.01), hair, sx * 0.043, 0.048, 0.112);
      add(face3d, new THREE.SphereGeometry(0.022, 12, 10), skin, sx * 0.12, 0, 0);
    }

    // Helmet: shell with a front opening + a visor that swings up over the top.
    const HR = 0.19;
    const OPEN = 0.95;
    const T0 = Math.PI * 0.27;
    const T1 = Math.PI * 0.73;
    const frontStart = Math.PI / 2 - OPEN;
    add(head, new THREE.SphereGeometry(HR, 40, 28, Math.PI / 2 + OPEN, Math.PI * 2 - OPEN * 2), helmetMat);
    add(head, new THREE.SphereGeometry(HR, 24, 10, frontStart, OPEN * 2, 0, T0), helmetMat);
    add(head, new THREE.SphereGeometry(HR, 24, 10, frontStart, OPEN * 2, T1, Math.PI - T1), helmetMat);
    // The real Satvik inside the helmet: the intro video is projected onto the
    // front of a head-shaped mesh, so it turns and shades like a head instead of
    // sitting there as a flat picture. The studio background is keyed out and
    // the sides/back fall off into hair colour. FACE_CENTER / FACE_SPAN locate
    // his head in Runway's 1088×704 frame (fractions, y from the bottom).
    const FACE_CENTER = new THREE.Vector2(0.505, 0.6);
    const FACE_SPAN = new THREE.Vector2(0.155, 0.38);
    // Padded helmet liner: dark, lit by the scene, so the head sits in shadow
    // inside the suit rather than against the white shell.
    add(
      head,
      new THREE.SphereGeometry(HR - 0.004, 32, 24),
      std(0x232a35, { roughness: 1, side: THREE.BackSide }),
    );
    const faceMat = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: null as THREE.Texture | null }, // resting face (still)
        mapB: { value: null as THREE.Texture | null }, // talking face (video)
        mixB: { value: 0 },
        center: { value: FACE_CENTER },
        span: { value: FACE_SPAN },
        glowCol: { value: new THREE.Color(TEAL) },
      },
      vertexShader: `
        varying vec3 vP;
        void main() {
          vec3 p = position;
          vP = p;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }`,
      fragmentShader: `
        uniform sampler2D map;
        uniform sampler2D mapB;
        uniform float mixB;
        uniform vec2 center;
        uniform vec2 span;
        uniform vec3 glowCol;
        varying vec3 vP;
        void main() {
          vec2 uv = center + vP.xy * span;
          vec3 c = mix(texture2D(map, uv).rgb, texture2D(mapB, uv).rgb, mixB);
          // Cut his whole head (hair, ears, beard) out of the frame.
          // Above the jaw the studio wall is white, so the matte follows his
          // real outline: bright, colourless pixels become transparent. That
          // test is switched off over the middle of the face so teeth, eyes
          // and skin highlights can never be keyed. Below the jaw the wall is
          // dark like his beard, so there the edge is a jaw-shaped taper.
          float luma = dot(c, vec3(0.299, 0.587, 0.114));
          float sat = max(c.r, max(c.g, c.b)) - min(c.r, min(c.g, c.b));
          float wall = smoothstep(0.6, 0.8, luma) * (1.0 - smoothstep(0.035, 0.09, sat));
          float outer = max(smoothstep(0.5, 0.62, abs(vP.x)), smoothstep(0.5, 0.64, vP.y));
          float upper = smoothstep(-0.52, -0.4, vP.y);
          float alpha = 1.0 - wall * outer * upper;
          float jaw = mix(0.3, 0.72, smoothstep(-0.85, -0.47, vP.y)) + 0.28 * smoothstep(-0.47, -0.3, vP.y);
          alpha *= 1.0 - smoothstep(jaw * 0.84, jaw, abs(vP.x));
          alpha *= smoothstep(-0.99, -0.88, vP.y);
          alpha *= 1.0 - smoothstep(0.92, 1.0, length(vP.xy));
          // theme lighting, fixed to the head
          float front = smoothstep(0.05, 0.9, vP.z);
          c *= 0.6 + 0.36 * front;
          c += glowCol * pow(1.0 - front, 2.0) * 0.06;
          gl_FragColor = vec4(c, alpha);
          #include <colorspace_fragment>
        }`,
      transparent: true,
    });
    const faceScreen = add(head, new THREE.SphereGeometry(1, 48, 32), faceMat, 0, 0.002, 0);
    faceScreen.scale.set(0.1, 0.152, 0.116);
    // Neck: his real neck from the same footage (so it matches the face in
    // colour and moves with it), projected onto a curved strip just behind the
    // chin. It shares the head's textures and frame mapping, is feathered at
    // the sides where the studio wall begins, and darkens into the neck seal
    // before the shirt collar would show.
    const neckGeo = new THREE.CylinderGeometry(0.44, 0.52, 0.56, 24, 1, true, -Math.PI / 2, Math.PI);
    neckGeo.translate(0, -1.0, -0.12);
    const neck = add(
      head,
      neckGeo,
      new THREE.ShaderMaterial({
        uniforms: {
          map: faceMat.uniforms.map,
          mapB: faceMat.uniforms.mapB,
          mixB: faceMat.uniforms.mixB,
          center: faceMat.uniforms.center,
          span: faceMat.uniforms.span,
        },
        vertexShader: `
          varying vec3 vP;
          void main() {
            vP = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: `
          uniform sampler2D map;
          uniform sampler2D mapB;
          uniform float mixB;
          uniform vec2 center;
          uniform vec2 span;
          varying vec3 vP;
          void main() {
            vec2 uv = center + vP.xy * span;
            vec3 c = mix(texture2D(map, uv).rgb, texture2D(mapB, uv).rgb, mixB);
            float alpha = 1.0 - smoothstep(0.27, 0.36, abs(vP.x));
            // under-chin shade at the top, gone to shadow by the shirt line
            c *= 0.52 * smoothstep(-1.12, -0.92, vP.y);
            gl_FragColor = vec4(c, alpha);
            #include <colorspace_fragment>
          }`,
        transparent: true,
      }),
    );
    neck.position.copy(faceScreen.position);
    neck.scale.copy(faceScreen.scale);
    neck.visible = false;
    // the suit's neck seal: a dark ring the neck disappears into
    add(head, new THREE.CylinderGeometry(0.082, 0.1, 0.05, 28), darker, 0, -0.2, -0.004);
    faceScreen.visible = false;
    // His resting face: the first frame of a clip, held as a paused video.
    // It must be video, not an image — browsers colour-convert the two
    // differently, and the cross-fade into each talking clip would then shift
    // his skin tone. Until it loads (or if it fails) the simple 3D face stands in.
    let restReady = false;
    const restVideo = document.createElement("video");
    restVideo.muted = true;
    restVideo.playsInline = true;
    restVideo.setAttribute("muted", "");
    restVideo.setAttribute("playsinline", "");
    restVideo.preload = "auto";
    const restTex = new THREE.VideoTexture(restVideo);
    restTex.colorSpace = THREE.SRGBColorSpace;
    textures.push(restTex);
    const markRestReady = () => {
      restTex.needsUpdate = true;
      restReady = true;
    };
    // Desktop browsers decode a frame as soon as the data is there.
    restVideo.addEventListener("loadeddata", () => {
      restVideo.currentTime = 0.04;
    });
    restVideo.addEventListener("seeked", markRestReady);
    restVideo.src = "/intro/rest.mp4";
    restVideo.load();
    // iPhones ignore preload and only decode once playback starts, so play
    // the (muted, inline) clip for a moment and hold it on its first frames.
    restVideo
      .play()
      .then(() => {
        setTimeout(() => {
          restVideo.pause();
          markRestReady();
        }, 150);
      })
      .catch(() => {
        // autoplay refused (e.g. Low Power Mode): the still below takes over
      });
    // Last resort so the helmet never falls back to the cartoon face just
    // because video is unavailable: the same frame as a still image.
    let restImageReady = false;
    const restImage = new THREE.TextureLoader().load("/intro/rest.jpg", () => {
      restImageReady = true;
    });
    restImage.colorSpace = THREE.SRGBColorSpace;
    textures.push(restImage);
    let baseTex: THREE.Texture = restTex;
    faceMat.uniforms.map.value = restTex;
    faceMat.uniforms.mapB.value = restTex;
    let shownVideo: HTMLVideoElement | null = null;
    let faceTex: THREE.VideoTexture | null = null;

    const visor = group(head);
    add(
      visor,
      new THREE.SphereGeometry(HR + 0.006, 32, 20, frontStart - 0.06, OPEN * 2 + 0.12, T0 - 0.05, T1 - T0 + 0.1),
      visorMat,
    );
    for (const sx of [-1, 1]) {
      const ear = add(head, new THREE.CylinderGeometry(0.045, 0.045, 0.03, 20), dark, sx * HR, 0, 0);
      ear.rotation.z = Math.PI / 2;
      const dot = add(head, new THREE.CylinderGeometry(0.02, 0.02, 0.034, 16), glow, sx * HR, 0, 0);
      dot.rotation.z = Math.PI / 2;
    }

    // Arms — index 0 is his right arm (‑X when he faces +Z), 1 his left.
    const arms = [-1, 1].map((sx) => {
      const shoulder = group(upper, sx * 0.255, 0.48, 0);
      add(shoulder, new THREE.SphereGeometry(0.088, 18, 14), fabric);
      bellows(shoulder, 0.071, -0.062, 4);
      add(shoulder, new THREE.CylinderGeometry(0.068, 0.062, 0.15, 18), fabric, 0, -0.17, 0);
      band(shoulder, 0.0675, 0.007, -0.15, stripe);
      bellows(shoulder, 0.064, -0.215, 3); // ribbing above the elbow

      const elbow = group(shoulder, 0, -0.28, 0);
      add(elbow, new THREE.SphereGeometry(0.066, 18, 12), fabric); // elbow ball
      bellows(elbow, 0.0615, -0.045, 3); // ribbing below the elbow
      add(elbow, new THREE.CylinderGeometry(0.06, 0.049, 0.14, 18), fabric, 0, -0.115, 0);
      band(elbow, 0.05, 0.006, -0.188, metal); // wrist disconnect

      // Glove. With the forearm along −Y, +Z is the back of the hand and −Z
      // the palm, so fingers curl toward −Z (down onto the keys when typing).
      add(elbow, new THREE.CylinderGeometry(0.049, 0.043, 0.05, 18), fabricShade, 0, -0.215, 0);
      const hand = group(elbow, 0, -0.245, 0); // the wrist: bends in the frame loop
      // A cupped palm: a thin, slightly arched back of the hand, with the two
      // fleshy pads (thumb side and little-finger side) on the inside and a
      // hollow left between them — that hollow is what lets a hand close.
      const back = add(hand, new THREE.SphereGeometry(1, 18, 12), fabricShade, 0, -0.024, 0.006);
      back.scale.set(0.04, 0.038, 0.013);
      const thenar = add(hand, new THREE.SphereGeometry(1, 14, 10), fabricShade, -sx * 0.02, -0.014, -0.008);
      thenar.scale.set(0.02, 0.026, 0.013);
      const hypothenar = add(hand, new THREE.SphereGeometry(1, 14, 10), fabricShade, sx * 0.022, -0.02, -0.006);
      hypothenar.scale.set(0.015, 0.028, 0.011);
      const knuckleRow = add(hand, new THREE.SphereGeometry(1, 14, 10), joint, 0, -0.05, 0.004);
      knuckleRow.scale.set(0.038, 0.012, 0.013);

      // Fingers: three segments each, fanned slightly, each joint a pivot.
      const lengths = [0.021, 0.026, 0.024, 0.018]; // index, middle, ring, little
      const fingers = lengths.map((len, f) => {
        const order = sx < 0 ? f : 3 - f; // index sits next to the thumb on both hands
        const knuckle = group(hand, -0.0285 + order * 0.019, -0.052, 0.002);
        knuckle.rotation.z = (order - 1.5) * 0.07;
        add(knuckle, new THREE.SphereGeometry(0.0096, 10, 8), fabricShade);
        add(knuckle, new THREE.CapsuleGeometry(0.0086, len, 4, 10), fabricShade, 0, -len / 2 - 0.004, 0);
        const mid = group(knuckle, 0, -len - 0.01, 0);
        add(mid, new THREE.SphereGeometry(0.0088, 10, 8), joint);
        add(mid, new THREE.CapsuleGeometry(0.008, len * 0.6, 4, 10), fabricShade, 0, -len * 0.3 - 0.004, 0);
        const tip = group(mid, 0, -len * 0.6 - 0.009, 0);
        add(tip, new THREE.CapsuleGeometry(0.0078, 0.008, 4, 10), rubber, 0, -0.008, 0); // rubber fingertip
        return { knuckle, mid, tip };
      });
      const thumbBase = group(hand, -sx * 0.034, -0.012, -0.008);
      thumbBase.rotation.set(0.45, 0, -sx * 0.8);
      add(thumbBase, new THREE.CapsuleGeometry(0.0105, 0.02, 4, 10), fabricShade, 0, -0.016, 0);
      const thumbTip = group(thumbBase, 0, -0.036, 0);
      thumbTip.rotation.z = sx * 0.4;
      add(thumbTip, new THREE.SphereGeometry(0.0098, 10, 8), joint);
      add(thumbTip, new THREE.CapsuleGeometry(0.0092, 0.012, 4, 10), rubber, 0, -0.011, 0);
      return { shoulder, elbow, sx, hand, fingers };
    });

    // ── Flight state ──────────────────────────────────────────
    const curve = new THREE.CatmullRomCurve3(ROUTE.map((p) => new THREE.Vector3(...p)));
    const pose = {
      yaw: CODING_YAW,
      visor: 0,
      lean: 0.12,
      headX: 0.1,
      headY: 0,
      steer: 0,
      lateral: 0,
      pitch: 0,
      a: [
        { sx: -0.35, sz: 0, ex: -1.15, ez: 0.3, wx: 0.1, curl: 0.35 },
        { sx: -0.35, sz: 0, ex: -1.15, ez: -0.3, wx: 0.1, curl: 0.35 },
      ],
    };
    const pointer = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // Keyboard flying: W/S or ↑/↓ thrust, A/D or ←/→ steer, 1–6 jump.
    const held = { up: false, down: false, left: false, right: false };
    const isTyping = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;
      return !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
    };
    const keyName = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowup" || k === "w") return "up";
      if (k === "arrowdown" || k === "s") return "down";
      if (k === "arrowleft" || k === "a") return "left";
      if (k === "arrowright" || k === "d") return "right";
      return null;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      const name = keyName(e);
      if (name) {
        held[name] = true;
        e.preventDefault();
        return;
      }
      const n = Number(e.key);
      if (n >= 1 && n <= STATIONS.length) {
        document.getElementById(STATIONS[n - 1])?.scrollIntoView({ behavior: "smooth" });
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const name = keyName(e);
      if (name) held[name] = false;
    };
    const releaseKeys = () => {
      held.up = held.down = held.left = held.right = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", releaseKeys);

    // Section tops, refreshed now and then (content height changes as it loads).
    let tops: number[] = [];
    const measure = () => {
      tops = STATIONS.map((id) => document.getElementById(id)?.offsetTop ?? -1);
    };
    measure();
    const measureId = setInterval(measure, 1200);

    // Where we are on the route: station index + fraction.
    const routePos = () => {
      if (tops.length === 0 || tops[1] < 0) return 0;
      const y = window.scrollY;
      let i = 0;
      while (i < tops.length - 1 && y >= tops[i + 1]) i++;
      const end = tops[i + 1] ?? document.documentElement.scrollHeight - window.innerHeight;
      const span = Math.max(end - tops[i], 1);
      return Math.min(i + Math.min(Math.max((y - tops[i]) / span, 0), 1), STATIONS.length - 1);
    };

    let last = performance.now();
    let rafId = 0;
    let typeAcc = 0;
    let cursorOn = true;
    let cursorAcc = 0;
    let keyVel = 0;
    let lateralTarget = 0; // where A/D has flown him, in world units from the route
    let lastScroll = window.scrollY;
    let speed = 0;
    let wide = true;
    let heroDist = 5;
    let viewW = 1;
    let viewH = 1;
    const camPos = new THREE.Vector3();
    const camLook = new THREE.Vector3();
    const headWorld = new THREE.Vector3();
    const headNdc = new THREE.Vector3();
    const target = new THREE.Vector3();

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      clockRef.current += dt;
      const t = clockRef.current;
      const k = (rate: number) => (reducedMotion ? 1 : 1 - Math.exp(-rate * dt));
      const osc = reducedMotion ? 0 : 1;

      // Keys → scroll
      const thrust = (held.down ? 1 : 0) - (held.up ? 1 : 0);
      keyVel += (thrust * 1200 - keyVel) * (1 - Math.exp(-5 * dt));
      if (Math.abs(keyVel) > 4) {
        window.scrollTo({ top: window.scrollY + keyVel * dt, behavior: "instant" });
      }
      const scrollY = window.scrollY;
      speed += ((scrollY - lastScroll) / Math.max(dt, 0.001) - speed) * (1 - Math.exp(-6 * dt));
      lastScroll = scrollY;
      const speedN = Math.max(-1, Math.min(1, speed / 2200));

      const u = routePos();
      const ride = smooth(0.1, 0.6, u); // 0 seated on the station → 1 in flight
      const g = greetingRef.current && ride < 0.02;
      const since = t - changedAtRef.current;

      // ── Seat behaviour (same as before) ──
      const yawTarget = ride > 0.02 ? FLY_YAW : g || since < 0.35 ? GREET_YAW : CODING_YAW;
      const facingViewer = Math.abs(pose.yaw - GREET_YAW) < 0.5;
      const visorTarget = g && (since > 0.55 || reducedMotion) ? 1 : 0;
      const atConsole = !g && ride < 0.02 && Math.abs(pose.yaw - CODING_YAW) < 0.25;
      const waving = g && since > 1.0 && since < 3.6;

      pose.yaw += (yawTarget - pose.yaw) * k(3.2);
      pose.visor += (visorTarget - pose.visor) * k(7);
      pose.lean += ((atConsole ? 0.12 : 0.0) - pose.lean) * k(4);
      // A/D or ←/→ fly him sideways. He stays where you leave him (no spring
      // back) and can cross the whole screen: the limits are the screen edges
      // at his depth, measured from his usual spot in the right margin.
      const steerDir = (held.right ? 1 : 0) - (held.left ? 1 : 0);
      pose.steer += (steerDir - pose.steer) * k(3);
      const screenWidth = 2 * (wide ? 11 : 24) * Math.tan((14 * Math.PI) / 180) * camera.aspect;
      const homeFrac = 0.5 + (wide ? 0.39 : 0.36);
      lateralTarget =
        ride > 0.05
          ? Math.max(
              -(homeFrac - 0.07) * screenWidth,
              Math.min((0.95 - homeFrac) * screenWidth, lateralTarget + steerDir * 6 * dt),
            )
          : 0;
      pose.lateral += (lateralTarget - pose.lateral) * k(7);
      pose.pitch += (speedN - pose.pitch) * k(4);

      chair.rotation.y = mix(pose.yaw, CODING_YAW, ride);
      visor.rotation.x = -1.3 * pose.visor;
      upper.rotation.x = pose.lean + Math.sin(t * 1.4) * 0.008 * osc;

      // ── Position on the route ──
      curve.getPoint(u / (STATIONS.length - 1), target);
      astro.position.set(
        target.x * ride + pose.lateral * ride,
        target.y * ride + Math.sin(t * 1.3) * 0.1 * ride * osc,
        target.z * ride,
      );
      body.rotation.set(
        (0.22 + pose.pitch * 0.55) * ride,
        pose.yaw - pose.steer * 0.5 * ride,
        (-pose.steer * 0.45 + Math.sin(t * 0.9) * 0.05 * osc) * ride,
      );

      // Legs: seated → trailing
      legs.forEach((leg, i) => {
        const kick = Math.sin(t * 2.2 + i * Math.PI) * 0.12 * osc;
        leg.hip.rotation.x = mix(-Math.PI / 2, 0.18 + kick, ride);
        leg.knee.rotation.x = mix(Math.PI / 2, 0.3 - kick * 0.6, ride);
      });

      // Head
      const talking = speakingRef.current && facingViewer && g;
      // Where to look. While greeting or flying he looks at the pointer: first
      // work out the turn that faces the camera from where he is on screen,
      // then add the offset from his head to the pointer. At the console he
      // watches his code instead.
      let headXT = 0.1 + Math.sin(t * 0.7) * 0.03 * osc;
      let headYT = Math.sin(t * 0.45) * 0.12 * osc;
      if (g || ride > 0.02) {
        head.getWorldPosition(headWorld);
        const toCamX = camera.position.x - headWorld.x;
        const toCamY = camera.position.y - headWorld.y;
        const toCamZ = camera.position.z - headWorld.z;
        headNdc.copy(headWorld).project(camera);
        const dx = pointer.x - headNdc.x;
        const dy = pointer.y + headNdc.y; // pointer.y grows downward, NDC y upward
        const faceCamYaw = Math.atan2(toCamX, toCamZ) - body.rotation.y;
        const faceCamPitch = -Math.atan2(toCamY, Math.hypot(toCamX, toCamZ)) - upper.rotation.x;
        headYT = Math.max(-0.6, Math.min(0.6, faceCamYaw + dx * 0.42));
        headXT =
          Math.max(-0.3, Math.min(0.35, faceCamPitch + dy * 0.3)) +
          (talking ? Math.sin(t * 5.2) * 0.03 * osc : 0);
      }
      pose.headX += (headXT - pose.headX) * k(6);
      pose.headY += (headYT - pose.headY) * k(6);
      head.rotation.set(pose.headX, pose.headY, 0);
      mouth.scale.y = talking ? 0.7 + Math.abs(Math.sin(t * 11)) * 2.2 : 1;
      const blink = t % 3.7 < 0.12 ? 0.12 : 1;
      eyes.forEach((e) => (e.scale.y = blink));

      // Helmet: the resting still, cross-faded to the intro clip while it plays.
      const fv = faceVideoRef.current;
      if (fv !== shownVideo) {
        faceTex?.dispose();
        faceTex = fv ? new THREE.VideoTexture(fv) : null;
        if (faceTex) faceTex.colorSpace = THREE.SRGBColorSpace;
        faceMat.uniforms.mapB.value = faceTex ?? baseTex;
        faceMat.uniforms.mixB.value = 0;
        shownVideo = fv;
      }
      // Fade out just before a clip ends so it never freezes on a mid-word frame.
      const clipLive =
        !!fv &&
        !fv.paused &&
        !fv.ended &&
        fv.currentTime > 0.04 &&
        fv.duration - fv.currentTime > 0.14;
      faceMat.uniforms.mixB.value +=
        ((clipLive ? 1 : 0) - faceMat.uniforms.mixB.value) * (1 - Math.exp(-16 * dt));
      // If the resting video hasn't produced a frame after a couple of
      // seconds, switch to the still image.
      if (!restReady && restImageReady && baseTex !== restImage && t > 2.5) {
        baseTex = restImage;
        faceMat.uniforms.map.value = restImage;
        if (!faceTex) faceMat.uniforms.mapB.value = restImage;
      }
      const faceReady = restReady || baseTex === restImage;
      faceScreen.visible = faceReady;
      neck.visible = faceReady;
      face3d.visible = !faceReady;

      // Arms
      arms.forEach((arm, i) => {
        const p = pose.a[i];
        const inward = -arm.sx * 0.3;
        let sx = -0.35;
        let sz = 0;
        let ex = -1.15;
        let ez = inward;
        let wx = 0.1; // wrist bend
        let curl = 0.35; // how closed the fingers are
        if (ride > 0.02) {
          sx = -0.15 + pose.pitch * 0.3;
          sz = arm.sx * (0.45 + Math.sin(t * 1.1 + i) * 0.06 * osc);
          ex = -0.45;
          ez = 0;
          wx = 0.2;
          curl = 0.5; // relaxed, half-closed in flight
        } else if (atConsole) {
          ex += Math.sin(t * 17 + i * 2.1) * 0.05 * osc;
          sx += Math.sin(t * 9 + i) * 0.012 * osc;
        } else if (i === 0 && waving) {
          sx = 0;
          sz = -1.9;
          ex = 0;
          ez = -1.1 + Math.sin(t * 9) * 0.45 * osc;
          wx = 0;
          curl = 0.06; // open hand for the wave
        } else {
          sx = -0.3;
          ex = -0.85;
          ez = inward * 0.5;
          wx = -0.5; // hand lies flat along the thigh
          curl = 0.22;
          if (talking && i === 1) ex += Math.sin(t * 3.1) * 0.12 * osc;
        }
        p.sx += (sx - p.sx) * k(7);
        p.sz += (sz - p.sz) * k(7);
        p.ex += (ex - p.ex) * k(9);
        p.ez += (ez - p.ez) * k(9);
        arm.shoulder.rotation.set(p.sx, 0, p.sz);
        arm.elbow.rotation.set(p.ex, 0, p.ez);
        p.wx += (wx - p.wx) * k(8);
        p.curl += (curl - p.curl) * k(8);
        arm.hand.rotation.x = p.wx;
        arm.fingers.forEach((finger, f) => {
          // while typing each finger taps on its own rhythm
          const tap = atConsole ? Math.max(0, Math.sin(t * 13 + f * 1.9 + i * 2.3)) * 0.3 * osc : 0;
          finger.knuckle.rotation.x = p.curl + f * 0.04 + tap;
          finger.mid.rotation.x = 0.25 + p.curl * 1.1 + tap * 0.5;
          finger.tip.rotation.x = 0.15 + p.curl * 0.8;
        });
      });

      // Jetpack
      const burn = ride * (0.55 + Math.abs(speedN) * 1.6 + Math.sin(t * 40) * 0.08 * osc);
      flames.forEach((f) => {
        f.visible = ride > 0.03;
        f.scale.set(1, Math.max(burn, 0.05), 1);
        f.position.y = 0.05 - 0.3 * Math.max(burn, 0.05);
      });
      jetLight.intensity = burn * 2.5;

      // Screen
      cursorAcc += dt;
      if (atConsole && !reducedMotion) {
        typeAcc += dt;
        if (typeAcc > 0.11) {
          typeAcc = 0;
          typeStep();
          drawCode(true);
        }
      } else if (cursorAcc > 0.5 && ride < 0.9) {
        cursorAcc = 0;
        cursorOn = !cursorOn;
        drawCode(cursorOn);
      }

      spinners.forEach((s) => (s.obj.rotation.y += s.speed * dt * osc));
      constellation.rotation.y = Math.sin(t * 0.15) * 0.08 * osc + pointer.x * 0.05;

      // ── Camera: station framing → chase camera ──
      // The camera tracks the route, not his steering, so A/D visibly moves him.
      const rideDist = wide ? 11 : 24;
      const routeX = target.x * ride;
      camPos.set(
        mix(-0.3, routeX, ride),
        mix(1.45, astro.position.y + 1.3, ride),
        mix(heroDist, astro.position.z + rideDist, ride),
      );
      camLook.set(
        mix(0.02, routeX, ride),
        mix(0.98, astro.position.y + 0.85 - pose.pitch * 0.6, ride),
        mix(0, astro.position.z, ride),
      );
      camera.position.copy(camPos);
      camera.lookAt(camLook);
      const fov = 28 + Math.abs(speedN) * 9 * ride * osc;
      camera.fov += (fov - camera.fov) * k(5);
      // Where he sits on screen: beside the hero text on the station, then out
      // in the right margin for the flight so he never covers the content.
      const offX = wide ? mix(-0.23, -0.39, ride) : mix(0, -0.36, ride);
      const offY = wide ? 0 : mix(-0.3, -0.1, ride);
      camera.setViewOffset(viewW, viewH, offX * viewW, offY * viewH, viewW, viewH);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(frame);
    };

    const start = () => {
      cancelAnimationFrame(rafId);
      if (document.hidden) return;
      last = performance.now();
      rafId = requestAnimationFrame(frame);
    };

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      viewW = w;
      viewH = h;
      camera.aspect = w / h;
      wide = w >= 1024;
      // Wide: the station lives in the right half, the text has the left.
      // Narrow: it sits below the hero text, so it has to be smaller.
      heroDist = wide
        ? 4.25 * Math.max(1, 1.08 / (camera.aspect * 0.5))
        : 4.25 * Math.max(2.7, 1.08 / camera.aspect);
      measure();
    };
    window.addEventListener("resize", resize);
    resize();
    document.addEventListener("visibilitychange", start);

    start();
    readyRef.current?.();

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(measureId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", start);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", releaseKeys);
      scene.traverse((obj) => {
        const o = obj as THREE.Mesh;
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => m.dispose());
        }
      });
      textures.forEach((tex) => tex.dispose());
      faceTex?.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  // -z-10 inside <main>'s stacking context: behind every section, above the body.
  return (
    <div
      ref={mountRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
}
