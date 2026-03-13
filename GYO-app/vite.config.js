import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(), // On place Tailwind en premier pour qu'il traite le CSS avant React
    react(),
  ],
  // Configuration explicite pour Vercel
  build: {
    outDir: 'dist',
    sourcemap: false,
    emptyOutDir: true, // Nettoie le dossier dist à chaque build
  },
  // Configuration Vitest (Tests)
  test: {
    globals: true,
    environment: 'jsdom',
    //setupFiles: './src/setupTests.js', // À décommenter si tu as ce fichier
    exclude: ['node_modules', 'dist'],
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    server: {
      deps: {
        inline: [/@tailwindcss\/vite/, /tailwindcss/]
      }
    }
  },
})