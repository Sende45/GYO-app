import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    exclude: ['node_modules', 'dist'],
    // AJOUTS CRUCIAUX :
    css: true, // Permet de traiter les fichiers CSS (indispensable pour Tailwind v4)
    server: {
      deps: {
        inline: [/tailwindcss/] // Force le traitement de Tailwind dans les tests
      }
    }
  },
})