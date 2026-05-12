import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/dark-horizon-web/', // <--- AÑADE ESTA LÍNEA (el nombre de tu repo)
  server: {
    historyApiFallback: true,  // ← añade esto
  }
})