import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F4F5FB",
        surface: "#FFFFFF",
        ink: "#1B1A2E",
        muted: "#6B6A85",
        violet: {
          DEFAULT: "#6D4AFF",
          dark: "#5938E8",
          soft: "#EEEAFF",
        },
        gold: "#FFB020",
        green: "#16B981",
        locked: "#CFD2E0",
        line: "#E4E5F0",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(27,26,46,0.04), 0 8px 24px rgba(27,26,46,0.06)",
        glow: "0 0 0 4px rgba(109,74,255,0.15)",
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "fade-up": {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        pop: "pop 0.25s ease-out",
        "fade-up": "fade-up 0.3s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
