import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        baseBlue: "#0052FF",
        baseGreen: "#00D395",
        baseBg: "#000814",
        baseBgLight: "#001428",
      },
      animation: {
        'ripple': 'ripple-animation 0.6s ease-out',
        'particle': 'particle-float 1s ease-out forwards',
        'sparkle': 'sparkle-float 1.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;