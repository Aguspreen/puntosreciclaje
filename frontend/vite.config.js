import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/usuarios': 'http://localhost:4000',
      '/puntos': 'http://localhost:4000',
      '/reportes': 'http://localhost:4000'
    }
  }
})
