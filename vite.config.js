import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 1919,
    proxy: {
      '/IWA': {
        target: 'http://localhost:1818',
        changeOrigin: true,
      }
    }
  }
})
