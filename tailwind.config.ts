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
        ink: "#0A0E14",
        bg: "#0C101A",
        card: "#121626",
        mutedText: "#C8D2E6",
        line: "#232B3E",
        gold: "#FFCC00",
        silver: "#CBD5FF",
        bronze: "#FFC496",
      },
      maxWidth: {
        frame: "420px",
      },
    },
  },
  plugins: [],
};

export default config;