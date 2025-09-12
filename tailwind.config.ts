import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      // colors: {
      //   amber: generateScale("amber"),
      //   blue: generateScale("blue"),
      //   brown: generateScale("brown"),
      //   crimson: generateScale("crimson"),
      //   cyan: generateScale("cyan"),
      //   gold: generateScale("gold"),
      //   gray: generateScale("gray"),
      //   green: generateScale("green"),
      //   indigo: generateScale("indigo"),
      //   iris: generateScale("iris"),
      //   jade: generateScale("jade"),
      //   lime: generateScale("lime"),
      //   mauve: generateScale("mauve"),
      //   mint: generateScale("mint"),
      //   olive: generateScale("olive"),
      //   orange: generateScale("orange"),
      //   pink: generateScale("pink"),
      //   plum: generateScale("plum"),
      //   purple: generateScale("purple"),
      //   red: generateScale("red"),
      //   ruby: generateScale("ruby"),
      //   sage: generateScale("sage"),
      //   sand: generateScale("sand"),
      //   sky: generateScale("sky"),
      //   slate: generateScale("slate"),
      //   teal: generateScale("teal"),
      //   tomato: generateScale("tomato"),
      //   violet: generateScale("violet"),
      //   yellow: generateScale("yellow"),
      // },
      
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;


