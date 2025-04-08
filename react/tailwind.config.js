/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        custom: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};