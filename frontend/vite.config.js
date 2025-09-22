// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),tailwindcss(),],
  server: {
    proxy: {
      '/chat': 'http://localhost:5000',
      '/action_plan': 'http://localhost:5000'
    }
  }
})
