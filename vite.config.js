import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  define: {
    'process.env': JSON.stringify({
      NODE_ENV: process.env.NODE_ENV || 'development',
      // Add other empty defaults if needed by dependencies
      REACT_APP_VERSION: '1.0.0',
      // ... any other expected env vars
    })
  }
})
