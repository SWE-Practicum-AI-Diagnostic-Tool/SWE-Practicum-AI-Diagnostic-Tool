import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    https: {
      key: './certs/localhost-key.pem',
      cert: './certs/localhost.pem',
    }
  }
})
