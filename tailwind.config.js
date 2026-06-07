/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wedding: {
          primary: '#d4a574',
          secondary: '#8b7355',
          accent: '#f5e6d3',
          gold: '#c9a959',
          rose: '#e8b4b8',
          ivory: '#fffef5'
        }
      }
    },
  },
  plugins: [],
}
