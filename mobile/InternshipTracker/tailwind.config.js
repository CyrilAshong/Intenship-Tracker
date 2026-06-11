/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1a2b4a',
          light: '#2d4270',
          dark: '#0f1a2e',
        },
        teal: {
          DEFAULT: '#00c896',
          light: '#e6faf5',
          dark: '#00a87e',
        },
      },
    },
  },
  plugins: [],
};