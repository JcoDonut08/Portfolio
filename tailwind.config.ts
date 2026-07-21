import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        night: "#080807",
        ink: "#10100D",
        bone: "#F5F4EF",
        stone: "#A8A29A",
        cyan: "#32E6E2",
        magenta: "#FF4D8D",
        amber: "#F2B84B",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Arial", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Consolas", "monospace"],
        display: [
          "Arial Narrow",
          "Bahnschrift",
          "var(--font-geist-sans)",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
