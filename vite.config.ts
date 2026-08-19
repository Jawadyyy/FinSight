import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // Anything the frontend calls at /auth/* is forwarded to the backend.
      // Same-origin to the browser, so the refresh cookie works.
      '/auth': 'http://localhost:3000',
      '/transactions': 'http://localhost:3000',
      '/budgets': 'http://localhost:3000',
      '/analytics': 'http://localhost:3000',
    },
  },
})