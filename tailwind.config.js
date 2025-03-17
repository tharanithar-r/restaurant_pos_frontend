import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "custom-gradient": `linear-gradient(
          180deg,
          hsl(18deg 75% 11%) 0%,
          hsl(18deg 74% 10%) 2%,
          hsl(20deg 73% 9%) 4%,
          hsl(20deg 72% 8%) 6%,
          hsl(20deg 71% 8%) 8%,
          hsl(19deg 69% 7%) 10%,
          hsl(18deg 66% 6%) 14%,
          hsl(16deg 61% 5%) 20%,
          hsl(14deg 50% 3%) 34%,
          hsl(0deg 0% 2%) 100%
        )`,
      },
      fontFamily: {
        Manrope: ["Manrope", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      addCommonColors: true,
      themes: {
        dark: {
          colors: {
            warning: {
              50: "#ffeedc",
              100: "#ffd1af",
              200: "#feb381",
              300: "#fc9650",
              400: "#f9791f",
              500: "#e05f06",
              600: "#af4a02",
              700: "#7d3400",
              800: "#4d1f00",
              900: "#1f0800",
              DEFAULT: "#f9791f",
              foreground: "#ffffff",
            },
            focus: "#fa8f45",
          },
        },
      },
    }),
  ],
};
