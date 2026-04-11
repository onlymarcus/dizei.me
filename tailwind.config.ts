import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",
        mist: "#E2E8F0",
        cloud: "#F8FAFC",
        brand: {
          50: "#F0FDFA",
          100: "#CCFBF1",
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0F766E",
          900: "#134E4A"
        }
      },
      boxShadow: {
        soft: "0 20px 60px rgba(15, 23, 42, 0.10)",
        glow: "0 18px 50px rgba(20, 184, 166, 0.24)"
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(to right, rgba(148, 163, 184, 0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.10) 1px, transparent 1px)"
      }
    }
  },
  plugins: [],
};

export default config;
