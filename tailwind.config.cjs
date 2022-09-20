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
        quarternary: {
          500:"#fb4e14",
          600: "#e23c04",
          700: "#b02e03",
        }
        ,
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(.215, .61, .355, 1)'
      }
    },
  },
  plugins: [],
};
