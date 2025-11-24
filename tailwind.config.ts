// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // This makes ring-emerald-500, bg-emerald-500, etc. work immediately
        emerald: {
          50: "oklch(98% 0.05 160)",
          100: "oklch(95% 0.08 160)",
          200: "oklch(90% 0.12 160)",
          300: "oklch(82% 0.15 160)",
          400: "oklch(72% 0.18 160)",
          500: "oklch(65% 0.25 160)",   // ← this is your main emerald
          600: "oklch(55% 0.28 160)",
          700: "oklch(45% 0.28 160)",
          800: "oklch(35% 0.25 160)",
          900: "oklch(25% 0.20 160)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;