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
        primary: { DEFAULT: "#0F766E", foreground: "#FFFFFF" },
        secondary: { DEFAULT: "#14B8A6", foreground: "#FFFFFF" },
        accent: { DEFAULT: "#F59E0B", foreground: "#1F2937" },
      },
      fontFamily: { sans: ["var(--font-sans)", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};

export default config;
