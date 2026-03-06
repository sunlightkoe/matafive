import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 🌟 重要：這裡設定部署到 GitHub Pages 的路徑
  base: '/matafive/', 
})