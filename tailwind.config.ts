import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        bg: {
          primary: "#05070f",
          secondary: "#0a0d18",
          tertiary: "#0f1322",
        },
        accent: {
          cyan: "#00f5c4",
          violet: "#7c3aed",
          pink: "#f472b6",
        },
        surface: "rgba(255,255,255,0.04)",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(0,245,196,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,196,0.03) 1px, transparent 1px)",
        "hero-glow":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,58,237,0.3), transparent)",
        "card-glow":
          "linear-gradient(135deg, rgba(0,245,196,0.06), rgba(124,58,237,0.06))",
      },
      backgroundSize: {
        "grid-size": "60px 60px",
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "slide-up": "slideUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in": "fadeIn 0.6s ease forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        slideUp: {
          from: { transform: "translateY(60px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        "glow-cyan": "0 0 40px rgba(0,245,196,0.2)",
        "glow-violet": "0 0 40px rgba(124,58,237,0.3)",
        "card-hover": "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,245,196,0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
