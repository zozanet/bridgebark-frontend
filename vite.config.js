import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',   // output folder for production build
    emptyOutDir: true // clears dist before each build
  },
  base: './'          // ensures assets load correctly on Vercel & Telegram Mini App
})