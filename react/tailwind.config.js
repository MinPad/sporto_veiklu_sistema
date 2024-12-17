/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // This ensures that Tailwind scans your React components for classes
  ],
  // theme: {
  //   extend: {
  //     fontFamily: {
  //       custom: ['Dancing Script', 'cursive'],
  //     },
  //   },
  // },
  theme: {
    extend: {
      fontFamily: {
        custom: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")
  ],
};