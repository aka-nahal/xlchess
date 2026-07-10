import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Sampled directly from the live xlchess.com hero.
        navy: {
          950: "#050B1D",
          900: "#061631",
          800: "#081532",
          700: "#0F1D4D",
        },
        brand: {
          DEFAULT: "#6366f1",
          light: "#818cf8",
          soft: "#a5b4fc",
          violet: "#8b5cf6",
          orchid: "#c084fc",
        },
        board: {
          light: "#e8ecf6",
          dark: "#6b73b8",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
