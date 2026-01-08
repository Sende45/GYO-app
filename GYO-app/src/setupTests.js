import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  test: {
    globals: true, // Très important : permet d'utiliser 'describe', 'it', 'expect' sans les importer
    environment: 'jsdom', // Simule le navigateur
    setupFiles: './src/setupTests.js', // Ton fichier de préparation
  },
})