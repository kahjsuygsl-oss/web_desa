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
        // Tema biru + hijau (mengikuti purwarupa KIM Masbagik Timur).
        primary: {
          DEFAULT: "#1E3A8A", // biru (blue-900)
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#166534", // hijau tua (green-800)
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#22C55E", // hijau terang (green-500)
          foreground: "#052E16",
        },
        background: "#F8FAFC",
        foreground: "#1F2937",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      container: {
        center: true,
        padding: "1rem",
        screens: { "2xl": "1200px" },
      },
    },
  },
  plugins: [],
};

export default config;
