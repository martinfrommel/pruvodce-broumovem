/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#181E7E",
        secondary: "#F3F3F3",
        tertiary: "#E5E5E5",
        quarternary: "#fb4e14",
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(.215, .61, .355, 1)'
      }
    },
  },
  plugins: [],
};
