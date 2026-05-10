/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: '#800000',
          light: '#a62b2b',
          dark: '#4d0000',
        },
        ash: {
          DEFAULT: '#b2beb5',
          light: '#dcdedd',
          dark: '#8b968e',
        },
        skyYellow: {
          DEFAULT: '#fce883',
          light: '#fdf3b8',
          dark: '#e6cc4c',
        }
      },
    },
  },
  plugins: [],
}
