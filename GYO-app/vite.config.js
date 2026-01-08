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
    // Cette section permet à Vitest de fonctionner
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    // On exclut les dossiers lourds pour gagner en vitesse
    exclude: ['node_modules', 'dist'],
  },
})