"use client";

import { useEffect, useRef } from "react";
import { useMousePosition } from "@/hooks/useMousePosition";

export function Avatar3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const headGroupRef = useRef<SVGGElement>(null);
  const leftEyeRef = useRef<SVGGElement>(null);
  const rightEyeRef = useRef<SVGGElement>(null);
  const { normalised } = useMousePosition();

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (wrapRef.current) {
        wrapRef.current.style.transform = `perspective(700px) rotateY(${normalised.x * 13}deg) rotateX(${-normalised.y * 8}deg)`;
      }
      const headRotate = normalised.x * 5;
      const eyeX = normalised.x * 4;
      const eyeY = -normalised.y * 3;
      if (headGroupRef.current) {
        headGroupRef.current.setAttribute(
          "transform",
          `rotate(${headRotate}, 150, 188)`,
        );
      }
      if (leftEyeRef.current) {
        leftEyeRef.current.setAttribute(
          "transform",
          `translate(${eyeX}, ${eyeY})`,
        );
      }
      if (rightEyeRef.current) {
        rightEyeRef.current.setAttribute(
          "transform",
          `translate(${eyeX}, ${eyeY})`,
        );
      }
    });
  }, [normalised]);

  const CHIPS = [
    {
      text: "React",
      color: "#00f5c4",
      border: "rgba(0,245,196,0.25)",
      top: "68px",
      right: "8px",
      left: undefined,
      dur: "4s",
      delay: "0s",
    },
    {
      text: "TypeScript",
      color: "#a78bfa",
      border: "rgba(167,139,250,0.25)",
      top: "185px",
      right: undefined,
      left: "5px",
      dur: "5s",
      delay: "1.2s",
    },
    {
      text: "Three.js",
      color: "#f472b6",
      border: "rgba(244,114,182,0.25)",
      top: "320px",
      right: "6px",
      left: undefined,
      dur: "4.5s",
      delay: "2s",
    },
    {
      text: "Next.js",
      color: "#00f5c4",
      border: "rgba(0,245,196,0.2)",
      top: "430px",
      right: undefined,
      left: "8px",
      dur: "6s",
      delay: "0.5s",
    },
  ];

  return (
    <div className="relative flex items-center justify-center w-[380px] h-[540px]">
      {/* Ambient glow blobs */}
      <div className="absolute top-[5%] left-[2%] w-48 h-48 rounded-full bg-cyan-400/[0.08] blur-3xl pointer-events-none" />
      <div className="absolute top-[15%] right-[4%] w-36 h-40 rounded-full bg-fuchsia-500/[0.07] blur-3xl pointer-events-none" />
      <div className="absolute bottom-[4%] left-[5%] w-72 h-24 rounded-full bg-accent-cyan/[0.05] blur-3xl pointer-events-none" />

      {/* Orbit rings */}
      <div className="absolute w-[370px] h-[370px] rounded-full border border-accent-cyan/10 animate-spin-slow pointer-events-none" />
      <div
        className="absolute w-[300px] h-[300px] rounded-full border border-violet-500/10 pointer-events-none"
        style={{ animation: "spin 16s linear infinite reverse" }}
      />

      {/* HUD corners */}
      <div className="absolute top-3.5 left-3.5 w-5 h-5 border-t border-l border-accent-cyan/35 pointer-events-none" />
      <div className="absolute top-3.5 right-3.5 w-5 h-5 border-t border-r border-accent-cyan/35 pointer-events-none" />
      <div className="absolute bottom-3.5 left-3.5 w-5 h-5 border-b border-l border-accent-cyan/35 pointer-events-none" />
      <div className="absolute bottom-3.5 right-3.5 w-5 h-5 border-b border-r border-accent-cyan/35 pointer-events-none" />

      {/* HUD labels */}
      <div className="absolute top-5 left-10 text-[8px] font-mono text-accent-cyan/45 leading-[1.7] pointer-events-none uppercase tracking-widest">
        <div>ID_SCAN</div>
        <div className="animate-pulse">● ACTIVE</div>
      </div>
      <div className="absolute top-5 right-10 text-[8px] font-mono text-accent-cyan/45 leading-[1.7] text-right pointer-events-none uppercase tracking-widest">
        <div>FE_DEV</div>
        <div>5+_YRS</div>
      </div>
      <div className="absolute bottom-5 left-10 text-[8px] font-mono text-accent-cyan/45 leading-[1.7] pointer-events-none uppercase tracking-widest">
        <div>BTech·MSc</div>
        <div>CS·WEB</div>
      </div>
      <div className="absolute bottom-5 right-10 text-[8px] font-mono text-accent-cyan/45 leading-[1.7] text-right pointer-events-none uppercase tracking-widest">
        <div>REACT·TS</div>
        <div className="animate-pulse">ONLINE</div>
      </div>

      {/* Floating tech chips */}
      {CHIPS.map((c) => (
        <div
          key={c.text}
          className="absolute text-[9px] font-mono px-2.5 py-1.5 rounded-lg border backdrop-blur-sm whitespace-nowrap pointer-events-none z-10"
          style={{
            color: c.color,
            borderColor: c.border,
            background: "rgba(5,7,15,0.88)",
            top: c.top,
            ...(c.right ? { right: c.right } : { left: c.left }),
            animation: `float ${c.dur} ease-in-out ${c.delay} infinite`,
          }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
            style={{ background: c.color, boxShadow: `0 0 5px ${c.color}` }}
          />
          {c.text}
        </div>
      ))}

      {/* Ground puddle */}
      <div
        className="absolute bottom-5 w-44 h-5 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse,rgba(0,200,255,0.2) 0%,rgba(0,245,196,0.08) 50%,transparent 80%)",
          filter: "blur(5px)",
        }}
      />

      {/* Avatar — mouse tracking */}
      <div
        ref={wrapRef}
        className="relative z-10 transition-[transform] duration-[120ms] ease-out"
        style={{
          animation: "avatarFloat 5s ease-in-out infinite",
          filter:
            "drop-shadow(0 32px 22px rgba(0,0,0,0.75)) drop-shadow(0 0 50px rgba(0,200,255,0.18)) drop-shadow(0 0 90px rgba(0,245,196,0.09))",
        }}
      >
        {/* Scan line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
          <div
            className="absolute left-0 right-0 h-[2px]"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(0,245,196,0.5),transparent)",
              animation: "scanDown 4s linear infinite",
            }}
          />
        </div>

        <svg
          width="300"
          height="500"
          viewBox="0 0 300 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="av-skin" cx="38%" cy="28%" r="65%">
              <stop offset="0%" stopColor="#f4c89e" />
              <stop offset="45%" stopColor="#e0a070" />
              <stop offset="80%" stopColor="#c07848" />
              <stop offset="100%" stopColor="#8a4e28" />
            </radialGradient>
            <radialGradient id="av-skinDark" cx="30%" cy="25%" r="65%">
              <stop offset="0%" stopColor="#e8b080" />
              <stop offset="55%" stopColor="#c07848" />
              <stop offset="100%" stopColor="#8a4e28" />
            </radialGradient>
            <linearGradient id="av-jeansL" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2a4e84" />
              <stop offset="50%" stopColor="#1e3a6a" />
              <stop offset="100%" stopColor="#0e1e38" />
            </linearGradient>
            <linearGradient id="av-jeansR" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0e1e38" />
              <stop offset="50%" stopColor="#1e3a6a" />
              <stop offset="100%" stopColor="#2a4e84" />
            </linearGradient>
            <linearGradient id="av-shirt" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#eeebe4" />
              <stop offset="60%" stopColor="#d8d4cc" />
              <stop offset="100%" stopColor="#b8b4ac" />
            </linearGradient>
            <linearGradient id="av-jktL" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b04420" />
              <stop offset="40%" stopColor="#7a3018" />
              <stop offset="100%" stopColor="#4a2460" />
            </linearGradient>
            <linearGradient id="av-jktR" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4a2460" />
              <stop offset="60%" stopColor="#7a3018" />
              <stop offset="100%" stopColor="#9a3c1c" />
            </linearGradient>
            <radialGradient id="av-iris" cx="38%" cy="32%" r="62%">
              <stop offset="0%" stopColor="#4a3018" />
              <stop offset="55%" stopColor="#201408" />
              <stop offset="100%" stopColor="#080402" />
            </radialGradient>
            <linearGradient id="av-shoe" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6a4428" />
              <stop offset="55%" stopColor="#3c2214" />
              <stop offset="100%" stopColor="#1c0e08" />
            </linearGradient>
            <linearGradient id="av-tabBG" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#001c38" />
              <stop offset="100%" stopColor="#000e1c" />
            </linearGradient>
            <linearGradient id="av-tabGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f5c4" stopOpacity=".75" />
              <stop offset="50%" stopColor="#0088ff" stopOpacity=".5" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity=".4" />
            </linearGradient>
            <linearGradient id="av-neck" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d89060" />
              <stop offset="100%" stopColor="#9a5c30" />
            </linearGradient>
            <pattern
              id="av-tribal"
              x="0"
              y="0"
              width="16"
              height="16"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="8"
                cy="8"
                r="3"
                fill="none"
                stroke="rgba(255,200,100,0.2)"
                strokeWidth=".9"
              />
              <circle
                cx="8"
                cy="8"
                r="5.5"
                fill="none"
                stroke="rgba(200,130,80,0.14)"
                strokeWidth=".7"
              />
              <path
                d="M0 8 Q4 4 8 8 Q12 12 16 8"
                stroke="rgba(255,170,60,0.14)"
                strokeWidth=".6"
                fill="none"
              />
              <path
                d="M8 0 Q12 4 8 8 Q4 12 8 16"
                stroke="rgba(180,80,80,0.1)"
                strokeWidth=".6"
                fill="none"
              />
            </pattern>
            <filter id="av-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter
              id="av-softGlow"
              x="-60%"
              y="-60%"
              width="220%"
              height="220%"
            >
              <feGaussianBlur stdDeviation="9" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="av-headShadow">
              <feDropShadow
                dx="2"
                dy="5"
                stdDeviation="5"
                floodColor="rgba(0,0,0,0.55)"
              />
            </filter>
          </defs>

          {/* Ground shadow */}
          <ellipse
            cx="150"
            cy="490"
            rx="78"
            ry="12"
            fill="rgba(0,0,0,0.6)"
            filter="url(#av-softGlow)"
          />
          <ellipse
            cx="150"
            cy="490"
            rx="55"
            ry="7"
            fill="rgba(0,200,255,0.1)"
            filter="url(#av-softGlow)"
          />

          {/* Shoes */}
          <path
            d="M96 462 Q96 452 104 448 L135 450 Q140 452 140 458 L138 466 Q130 472 116 472 Q104 472 98 468Z"
            fill="url(#av-shoe)"
          />
          <path
            d="M96 462 Q96 452 104 448 L135 450"
            fill="none"
            stroke="rgba(180,120,70,0.45)"
            strokeWidth="1.2"
          />
          <ellipse
            cx="106"
            cy="454"
            rx="9"
            ry="3"
            fill="rgba(160,110,60,0.35)"
            transform="rotate(-5 106 454)"
          />
          <ellipse cx="132" cy="460" rx="5" ry="2" fill="rgba(0,220,255,0.2)" />
          <path
            d="M96 466 Q96 470 104 472 L138 470 L140 466"
            fill="rgba(20,12,6,0.8)"
          />

          <path
            d="M204 462 Q204 452 196 448 L165 450 Q160 452 160 458 L162 466 Q170 472 184 472 Q196 472 202 468Z"
            fill="url(#av-shoe)"
          />
          <path
            d="M204 462 Q204 452 196 448 L165 450"
            fill="none"
            stroke="rgba(180,120,70,0.45)"
            strokeWidth="1.2"
          />
          <ellipse
            cx="194"
            cy="454"
            rx="9"
            ry="3"
            fill="rgba(160,110,60,0.35)"
            transform="rotate(5 194 454)"
          />
          <ellipse cx="168" cy="460" rx="5" ry="2" fill="rgba(0,220,255,0.2)" />
          <path
            d="M204 466 Q204 470 196 472 L162 470 L160 466"
            fill="rgba(20,12,6,0.8)"
          />

          {/* Jeans */}
          <path
            d="M106 295 Q100 370 96 448 L140 452 L140 295Z"
            fill="url(#av-jeansL)"
          />
          <path
            d="M118 305 Q115 375 114 445"
            stroke="rgba(80,130,220,0.2)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M138 295 Q136 370 136 448"
            stroke="rgba(0,0,0,0.25)"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M100 350 Q98 400 96 448"
            stroke="rgba(0,245,196,0.65)"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#av-glow)"
          />
          <path
            d="M100 350 Q98 400 96 448"
            stroke="rgba(0,245,196,0.2)"
            strokeWidth="8"
            strokeLinecap="round"
            filter="url(#av-softGlow)"
          />

          <path
            d="M194 295 Q200 370 204 448 L160 452 L160 295Z"
            fill="url(#av-jeansR)"
          />
          <path
            d="M182 305 Q185 375 186 445"
            stroke="rgba(80,130,220,0.2)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M162 295 Q164 370 164 448"
            stroke="rgba(0,0,0,0.25)"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M200 350 Q202 400 204 448"
            stroke="rgba(0,245,196,0.65)"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#av-glow)"
          />
          <path
            d="M200 350 Q202 400 204 448"
            stroke="rgba(0,245,196,0.2)"
            strokeWidth="8"
            strokeLinecap="round"
            filter="url(#av-softGlow)"
          />
          <path
            d="M106 295 Q150 312 194 295 L190 272 Q150 288 110 272Z"
            fill="#0e1e38"
            opacity="0.6"
          />

          {/* Shirt */}
          <path
            d="M126 180 L120 270 Q150 282 180 270 L174 180 Q162 172 150 170 Q138 172 126 180Z"
            fill="url(#av-shirt)"
          />
          <path
            d="M136 176 L150 192 L164 176"
            fill="none"
            stroke="#c4c0b8"
            strokeWidth="1.5"
          />
          <path
            d="M136 176 L142 168 L150 174 L158 168 L164 176"
            fill="#dddad2"
            opacity="0.9"
          />
          <line
            x1="150"
            y1="195"
            x2="150"
            y2="268"
            stroke="rgba(180,176,168,0.4)"
            strokeWidth="0.8"
            strokeDasharray="3 4"
          />

          {/* Jacket */}
          <path
            d="M126 180 L106 295 L88 295 L92 210 Q96 195 106 185 Q116 178 126 180Z"
            fill="url(#av-jktL)"
          />
          <path
            d="M126 180 L106 295 L88 295 L92 210 Q96 195 106 185 Q116 178 126 180Z"
            fill="url(#av-tribal)"
            opacity="0.8"
          />
          <path
            d="M126 180 L118 210 L110 268 L108 293"
            stroke="rgba(60,30,10,0.4)"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M136 176 L122 200 L134 204 L150 190Z"
            fill="#7a2c18"
            opacity="0.88"
          />
          <path
            d="M136 176 L130 188"
            stroke="rgba(210,130,70,0.45)"
            strokeWidth="1"
            strokeLinecap="round"
          />

          <path
            d="M174 180 L194 295 L212 295 L208 210 Q204 195 194 185 Q184 178 174 180Z"
            fill="url(#av-jktR)"
          />
          <path
            d="M174 180 L194 295 L212 295 L208 210 Q204 195 194 185 Q184 178 174 180Z"
            fill="url(#av-tribal)"
            opacity="0.8"
          />
          <path
            d="M174 180 L182 210 L190 268 L192 293"
            stroke="rgba(60,30,10,0.4)"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M164 176 L178 200 L166 204 L150 190Z"
            fill="#7a2c18"
            opacity="0.88"
          />
          <path
            d="M164 176 L170 188"
            stroke="rgba(210,130,70,0.45)"
            strokeWidth="1"
            strokeLinecap="round"
          />

          <circle
            cx="100"
            cy="248"
            r="11"
            fill="none"
            stroke="rgba(255,185,80,0.22)"
            strokeWidth="1.5"
          />
          <circle
            cx="100"
            cy="248"
            r="6"
            fill="none"
            stroke="rgba(220,130,60,0.18)"
            strokeWidth="1"
          />
          <circle
            cx="200"
            cy="248"
            r="11"
            fill="none"
            stroke="rgba(255,185,80,0.22)"
            strokeWidth="1.5"
          />
          <circle
            cx="200"
            cy="248"
            r="6"
            fill="none"
            stroke="rgba(220,130,60,0.18)"
            strokeWidth="1"
          />

          {/* Arms */}
          <path
            d="M92 210 Q86 240 88 270 L106 274 L108 210Z"
            fill="url(#av-jktL)"
          />
          <path
            d="M92 210 Q86 240 88 270 L106 274 L108 210Z"
            fill="url(#av-tribal)"
            opacity="0.75"
          />
          <path
            d="M88 270 Q84 280 88 292 Q94 300 104 300 L112 272Z"
            fill="url(#av-skinDark)"
          />
          <path
            d="M88 292 Q86 304 92 310 L110 312 Q116 308 118 300 L110 292Z"
            fill="url(#av-skin)"
          />
          <path
            d="M90 296 L87 289 M95 298 L93 291 M100 299 L99 292 M105 298 L106 291"
            stroke="#a06030"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          <path
            d="M208 210 Q214 240 212 270 L194 274 L192 210Z"
            fill="url(#av-jktR)"
          />
          <path
            d="M208 210 Q214 240 212 270 L194 274 L192 210Z"
            fill="url(#av-tribal)"
            opacity="0.75"
          />
          <path
            d="M212 270 Q216 280 212 292 Q206 300 196 300 L188 272Z"
            fill="url(#av-skinDark)"
          />
          <path
            d="M212 292 Q214 304 208 310 L190 312 Q184 308 182 300 L190 292Z"
            fill="url(#av-skin)"
          />
          <path
            d="M210 296 L213 289 M205 298 L207 291 M200 299 L201 292 M195 298 L194 291"
            stroke="#a06030"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Tablet */}
          <rect
            x="108"
            y="295"
            width="84"
            height="56"
            rx="6"
            fill="rgba(0,200,255,0.1)"
            filter="url(#av-softGlow)"
          />
          <rect
            x="112"
            y="299"
            width="76"
            height="50"
            rx="5"
            fill="url(#av-tabBG)"
            stroke="#003c55"
            strokeWidth="1.2"
          />
          <rect
            x="112"
            y="299"
            width="76"
            height="50"
            rx="5"
            fill="url(#av-tabGlow)"
            opacity="0.5"
          />
          <line
            x1="120"
            y1="308"
            x2="180"
            y2="308"
            stroke="rgba(0,245,196,0.65)"
            strokeWidth="1"
          />
          <line
            x1="120"
            y1="314"
            x2="172"
            y2="314"
            stroke="rgba(0,200,255,0.4)"
            strokeWidth=".8"
          />
          <line
            x1="120"
            y1="320"
            x2="176"
            y2="320"
            stroke="rgba(0,200,255,0.4)"
            strokeWidth=".8"
          />
          <line
            x1="120"
            y1="326"
            x2="164"
            y2="326"
            stroke="rgba(124,58,237,0.4)"
            strokeWidth=".8"
          />
          <line
            x1="120"
            y1="332"
            x2="174"
            y2="332"
            stroke="rgba(0,200,255,0.3)"
            strokeWidth=".8"
          />
          <polyline
            points="120,340 126,335 132,337 138,332 144,334 150,329 156,331 162,327 168,329 174,325"
            fill="none"
            stroke="#00f5c4"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="112"
            y="299"
            width="76"
            height="50"
            rx="5"
            fill="none"
            stroke="#00f5c4"
            strokeWidth=".8"
            opacity=".45"
            filter="url(#av-glow)"
          />
          <circle cx="150" cy="303" r="2" fill="rgba(0,245,196,0.4)" />

          {/* Head + Neck group — rotates with mouse */}
          <g ref={headGroupRef}>
            {/* Neck */}
            <path
              d="M136 160 Q134 178 136 184 Q143 190 150 190 Q157 190 164 184 Q166 178 164 160 Q158 156 150 155 Q142 156 136 160Z"
              fill="url(#av-neck)"
            />
            <path
              d="M136 164 Q133 175 136 184"
              stroke="rgba(100,50,20,0.4)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M164 164 Q167 175 164 184"
              stroke="rgba(100,50,20,0.25)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Head */}
            <ellipse
              cx="150"
              cy="170"
              rx="64"
              ry="10"
              fill="rgba(0,0,0,0.3)"
              filter="url(#av-softGlow)"
            />
            <path
              d="M86 98 Q82 122 84 146 Q86 172 96 186 Q110 204 150 206 Q190 204 204 186 Q214 172 216 146 Q218 122 214 98 Q206 58 150 53 Q94 58 86 98Z"
              fill="url(#av-skin)"
              filter="url(#av-headShadow)"
            />
            <ellipse
              cx="100"
              cy="155"
              rx="24"
              ry="16"
              fill="rgba(240,145,100,0.18)"
              transform="rotate(-10 100 155)"
            />
            <ellipse
              cx="200"
              cy="155"
              rx="24"
              ry="16"
              fill="rgba(240,145,100,0.18)"
              transform="rotate(10 200 155)"
            />
            <ellipse
              cx="147"
              cy="80"
              rx="32"
              ry="20"
              fill="rgba(255,230,205,0.3)"
              transform="rotate(-5 147 80)"
            />
            <ellipse
              cx="150"
              cy="196"
              rx="30"
              ry="10"
              fill="rgba(110,55,20,0.3)"
            />

            {/* Ears */}
            <ellipse cx="84" cy="135" rx="10" ry="14" fill="#d49060" />
            <ellipse
              cx="84"
              cy="135"
              rx="6.5"
              ry="9"
              fill="rgba(170,85,45,0.4)"
            />
            <ellipse
              cx="84"
              cy="133"
              rx="4"
              ry="5.5"
              fill="rgba(215,150,95,0.28)"
            />
            <ellipse cx="216" cy="135" rx="10" ry="14" fill="#d49060" />
            <ellipse
              cx="216"
              cy="135"
              rx="6.5"
              ry="9"
              fill="rgba(170,85,45,0.4)"
            />
            <ellipse
              cx="216"
              cy="133"
              rx="4"
              ry="5.5"
              fill="rgba(215,150,95,0.28)"
            />

            {/* Curly hair — back layer */}
            <path
              d="M87 96 Q84 72 96 58 Q113 42 150 38 Q187 42 204 58 Q216 72 213 96 Q206 66 186 54 Q168 46 150 45 Q132 46 114 54 Q94 66 87 96Z"
              fill="#0c0906"
            />
            <circle cx="112" cy="64" r="15" fill="#0a0806" />
            <circle cx="130" cy="50" r="16" fill="#0a0806" />
            <circle cx="150" cy="44" r="17" fill="#0a0806" />
            <circle cx="170" cy="50" r="16" fill="#0a0806" />
            <circle cx="188" cy="64" r="15" fill="#0a0806" />
            <circle cx="96" cy="80" r="14" fill="#0a0806" />
            <circle cx="204" cy="80" r="14" fill="#0a0806" />
            {/* Mid layer */}
            <circle cx="106" cy="68" r="13" fill="#13100a" />
            <circle cx="122" cy="53" r="14" fill="#13100a" />
            <circle cx="140" cy="46" r="14" fill="#13100a" />
            <circle cx="160" cy="46" r="14" fill="#13100a" />
            <circle cx="178" cy="53" r="13" fill="#13100a" />
            <circle cx="194" cy="68" r="13" fill="#13100a" />
            <circle cx="98" cy="86" r="12" fill="#13100a" />
            <circle cx="202" cy="86" r="12" fill="#13100a" />
            {/* Front layer */}
            <circle cx="110" cy="70" r="11" fill="#1c160e" />
            <circle cx="126" cy="56" r="12" fill="#1c160e" />
            <circle cx="142" cy="49" r="12" fill="#1c160e" />
            <circle cx="158" cy="49" r="12" fill="#1c160e" />
            <circle cx="174" cy="56" r="11" fill="#1c160e" />
            <circle cx="190" cy="70" r="11" fill="#1c160e" />
            {/* Sheen */}
            <circle cx="118" cy="60" r="7" fill="rgba(75,55,28,0.65)" />
            <circle cx="134" cy="50" r="7" fill="rgba(75,55,28,0.6)" />
            <circle cx="150" cy="45" r="8" fill="rgba(75,55,28,0.55)" />
            <circle cx="166" cy="50" r="7" fill="rgba(75,55,28,0.5)" />
            <circle cx="182" cy="60" r="6" fill="rgba(65,48,24,0.45)" />
            {/* Sideburns */}
            <ellipse cx="88" cy="104" rx="12" ry="24" fill="#0c0906" />
            <ellipse cx="212" cy="104" rx="12" ry="24" fill="#0c0906" />
            <circle cx="90" cy="95" r="10" fill="#13100a" />
            <circle cx="210" cy="95" r="10" fill="#13100a" />
            <circle cx="92" cy="86" r="8" fill="#1c160e" />
            <circle cx="208" cy="86" r="8" fill="#1c160e" />

            {/* Eyebrows */}
            <path
              d="M104 110 Q120 101 138 108"
              stroke="#160c04"
              strokeWidth="5.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M104 110 Q120 101 138 108"
              stroke="#241808"
              strokeWidth="3.2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M105 109 Q120 102 137 108"
              stroke="#382610"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M162 108 Q180 101 196 110"
              stroke="#160c04"
              strokeWidth="5.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M162 108 Q180 101 196 110"
              stroke="#241808"
              strokeWidth="3.2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M163 108 Q180 102 195 109"
              stroke="#382610"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Eyes */}
            <ellipse cx="118" cy="132" rx="18" ry="15" fill="#f5f1eb" />
            <ellipse
              cx="118"
              cy="132"
              rx="18"
              ry="15"
              fill="none"
              stroke="rgba(170,130,90,0.25)"
              strokeWidth=".8"
            />
            <g ref={leftEyeRef}>
              <circle cx="118" cy="132" r="11" fill="url(#av-iris)" />
              <circle cx="118" cy="132" r="6.5" fill="#0e0804" />
              <circle cx="118" cy="132" r="3.5" fill="#040202" />
              <circle cx="124" cy="125" r="5" fill="rgba(255,255,255,0.94)" />
              <circle cx="113" cy="136" r="2.2" fill="rgba(255,255,255,0.55)" />
            </g>
            <path
              d="M100 125 Q118 116 136 125"
              stroke="#140a02"
              strokeWidth="2.8"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M101 140 Q118 146 135 140"
              stroke="rgba(170,110,60,0.25)"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M101 125 L98 120 M107 121 L105 116 M113 119 L112 114 M119 118 L119 113 M125 119 L126 114 M131 121 L133 116 M135 124 L138 120"
              stroke="#160a02"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            <ellipse cx="182" cy="132" rx="18" ry="15" fill="#f5f1eb" />
            <ellipse
              cx="182"
              cy="132"
              rx="18"
              ry="15"
              fill="none"
              stroke="rgba(170,130,90,0.25)"
              strokeWidth=".8"
            />
            <g ref={rightEyeRef}>
              <circle cx="182" cy="132" r="11" fill="url(#av-iris)" />
              <circle cx="182" cy="132" r="6.5" fill="#0e0804" />
              <circle cx="182" cy="132" r="3.5" fill="#040202" />
              <circle cx="188" cy="125" r="5" fill="rgba(255,255,255,0.94)" />
              <circle cx="177" cy="136" r="2.2" fill="rgba(255,255,255,0.55)" />
            </g>
            <path
              d="M164 125 Q182 116 200 125"
              stroke="#140a02"
              strokeWidth="2.8"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M165 140 Q182 146 199 140"
              stroke="rgba(170,110,60,0.25)"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M165 125 L162 120 M171 121 L169 116 M177 119 L176 114 M183 118 L183 113 M189 119 L190 114 M195 121 L197 116 M199 124 L202 120"
              stroke="#160a02"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Nose */}
            <ellipse
              cx="150"
              cy="160"
              rx="11"
              ry="8"
              fill="#c07848"
              opacity="0.55"
            />
            <ellipse
              cx="150"
              cy="158"
              rx="7"
              ry="5"
              fill="#d89060"
              opacity="0.45"
            />
            <ellipse
              cx="140"
              cy="163"
              rx="6"
              ry="4"
              fill="#9a4e2a"
              opacity="0.5"
              transform="rotate(-14 140 163)"
            />
            <ellipse
              cx="160"
              cy="163"
              rx="6"
              ry="4"
              fill="#9a4e2a"
              opacity="0.5"
              transform="rotate(14 160 163)"
            />
            <ellipse
              cx="147"
              cy="157"
              rx="4.5"
              ry="3"
              fill="rgba(240,195,148,0.5)"
              transform="rotate(-8 147 157)"
            />

            {/* Mustache */}
            <path
              d="M131 170 Q140 164 150 167 Q160 164 169 170 Q163 177 150 174 Q137 177 131 170Z"
              fill="#160e06"
            />
            <path
              d="M135 169 Q143 165 150 167 Q157 165 165 169"
              stroke="rgba(50,35,14,0.5)"
              strokeWidth="1"
              fill="none"
            />

            {/* Mouth */}
            <path
              d="M134 174 Q150 178 166 174"
              stroke="#8a4828"
              strokeWidth="1.3"
              fill="none"
              strokeLinecap="round"
              opacity="0.6"
            />

            {/* Sci-fi overlays — head level */}
            <circle
              cx="212"
              cy="120"
              r="3.5"
              fill="#00f5c4"
              opacity="0.55"
              filter="url(#av-glow)"
            />
            <circle cx="212" cy="120" r="2" fill="#00f5c4" opacity="0.92" />
            <circle
              cx="88"
              cy="120"
              r="2.5"
              fill="#a78bfa"
              opacity="0.5"
              filter="url(#av-glow)"
            />
            <path
              d="M130 182 Q150 190 170 182"
              stroke="#00f5c4"
              strokeWidth="1.2"
              fill="none"
              opacity="0.25"
              filter="url(#av-glow)"
            />
          </g>
          {/* end headGroupRef */}

          {/* Sci-fi overlays — body level */}
          <path
            d="M96 235 L90 258 L94 264 L98 278"
            stroke="rgba(0,245,196,0.18)"
            strokeWidth=".8"
            fill="none"
          />
          <path
            d="M204 235 L210 258 L206 264 L202 278"
            stroke="rgba(0,245,196,0.18)"
            strokeWidth=".8"
            fill="none"
          />
          <circle cx="94" cy="264" r="2" fill="rgba(0,245,196,0.35)" />
          <circle cx="206" cy="264" r="2" fill="rgba(167,139,250,0.35)" />
        </svg>
      </div>

      <style>{`
        @keyframes avatarFloat {
          0%,100% { transform: translateY(0px) rotate(-0.4deg); }
          50%      { transform: translateY(-14px) rotate(0.4deg); }
        }
        @keyframes scanDown {
          0%   { top: 0%;   opacity: 0.8; }
          100% { top: 100%; opacity: 0;   }
        }
      `}</style>
    </div>
  );
}
