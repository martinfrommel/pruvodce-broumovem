/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}", 'node_modules/daisyui/dist/**/*.js', 'node_modules/react-daisyui/dist/**/*.js'],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#181E7E",
        secondary: "#F3F3F3",
        tertiary: "#E5E5E5",
        quarternary: {
          500: "#fb4e14",
          600: "#e23c04",
          700: "#b02e03",
        },
      },
    },
  },
  plugins: [require('daisyui')],
      daisyui: {
      themes: [
        {
          pruvodcebroumovem: {

 "primary": "#181E7E",

 "secondary": "#F3F3F3",

 "accent": "#FB4E14",

 "neutral": "#181E7E",

 "base-100": "#E5E5E5",

 "info": "#FB4E14",

 "success": "#27E76E",

 "warning": "#945810",

 "error": "#F6517F",
          },
        },
      ],
    },
};
