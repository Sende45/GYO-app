/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gyo-purple': '#7C3AED', // Ton violet
        'gyo-black': '#111827',  // Ton noir
        'gyo-white': '#F9FAFB',  // Ton blanc
      },
    },
  },
  plugins: [],
}