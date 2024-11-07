import type { Config } from "tailwindcss";

import colors from "tailwindcss/colors";
import {
  variableColorsPlugin,
  createVariableColors,
} from "tailwindcss-variable-colors";

const config: Config = {
  darkMode: "selector",

  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    colors: createVariableColors(colors),
  },
  plugins: [variableColorsPlugin(colors)],
};
export default config;
