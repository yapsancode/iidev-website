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
        indigo: {
          50: "oklch(97% 0.02 270)",
          100: "oklch(94% 0.05 270)",
          200: "oklch(89% 0.1 270)",
          300: "oklch(80% 0.15 270)",
          400: "oklch(71% 0.2 270)",
          500: "oklch(62% 0.25 270)",
          600: "oklch(53% 0.27 270)",
          700: "oklch(44% 0.26 270)",
          800: "oklch(35% 0.2 270)",
          900: "oklch(25% 0.15 270)",
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