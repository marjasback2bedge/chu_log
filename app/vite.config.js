import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/chu_log/',
  server: {
    host: true,
    allowedHosts: [
      '9bb0-1-174-187-248.ngrok-free.app'
    ]
  }
})
