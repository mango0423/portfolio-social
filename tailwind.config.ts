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
        primary: {
          DEFAULT: "#E8F5E9",
          deep: "#2E7D32",
        },
        background: "#FAFAF5",
        foreground: "#1a1a1a",
        accent: "#2E7D32",
      },
    },
  },
  plugins: [],
};
export default config;
